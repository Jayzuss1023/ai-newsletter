"use server";
import {
  isPrismaError,
  wrapDatabaseOperation,
} from "@/lib/database/error-handler";
import clientPromise from "@/lib/prisma";
import type { ArticleCreateData, BulkOperationResult } from "@/lib/rss/types";
import { ObjectId } from "mongodb";


// ============================================
// RSS ARTICLE ACTIONS
// ============================================

/**
 * Creates a single RSS article with atuomatic deduplication using guid
 * If article already exists, adds the current feedId to sourceFeedIds for multi-source tracking
 * Uses MongoDB's $addToSet to prevent duplicate feedIds in the sourceFeedIds array
 */
export async function createRssArticle(data: ArticleCreateData) {
  return wrapDatabaseOperation(async () => {
    // First, try to find existing article
    const client = await clientPromise;
    const db = client.db("newsletter");
    const existing = await db
      .collection("RssArticle")
      .findOne(
        { guid: data.guid },
        { projection: { _id: 1, sourceFeedIds: 1 } },
      );

    if (existing) {
      // Article exists — $addToSet skips the feedId if it is already present
      await db.collection("RssArticle").updateOne(
        { _id: existing._id },
        {
          $addToSet: {
            sourceFeedIds: new ObjectId(data.feedId),
          },
        },
      );

      return await db.collection("RssArticle").findOne({ guid: data.guid });
    }

    // Article doesn't exist - create new
    const now = new Date();
    const feedObjectId = new ObjectId(data.feedId);
    return await db.collection("RssArticle").insertOne({
      feedId: feedObjectId,
      guid: data.guid,
      sourceFeedIds: [feedObjectId],
      title: data.title,
      link: data.link,
      content: data.content,
      summary: data.summary,
      pubDate: data.pubDate,
      author: data.author,
      categories: data.categories || [],
      imageUrl: data.imageUrl,
      createdAt: now,
      updatedAt: now,
    });
  }, "create RSS article");
} 


/**
 * Bulk creates multiple RSS articles, automatically skipping duplicates based on guid
 */
export async function bulkCreateRssArticles(
  articles: ArticleCreateData[],
): Promise<BulkOperationResult> {
  const results: BulkOperationResult = {
    created: 0,
    skipped: 0,
    errors: 0,
  };

  for (const article of articles) {
    try {
      await createRssArticle(article);
      results.created++;
    } catch (error) {
      if (
        (isPrismaError(error) && error.code === "P2002") ||
        (typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === 11000)
      ) {
        results.skipped++;
      } else {
        results.errors++;
        console.error(`Failed to create article ${article.guid}:`, error);
      }
    }
  }

  return results;
}

/**
 * Fetched articles by selected feeds and date range with importance scoring
 * Importance is calculated by the number of sources (sourceFeedIds length)
 */
export async function getArticlesByFeedsAndDateRange(
  feedIds: string[],
  startDate: Date,
  endDate: Date,
  limit: 100,
) {
  return wrapDatabaseOperation(async () => {
    const client = await clientPromise;
    const db = client.db("newsletter");
    const feedObjectIds = feedIds.map((id) => new ObjectId(id));
    const articles = await db
      .collection("RssArticle")
      .find({
        $or: [
          { feedId: { $in: [...feedIds, ...feedObjectIds] } },
          {
            sourceFeedIds: {
              $in: [...feedIds, ...feedObjectIds],
            },
          },
        ],
        pubDate: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .sort({ pubDate: -1 })
      .limit(limit)
      .toArray();

    // Add sourceCount for reference
    return articles.map((article: (typeof articles)[number]) => ({
      ...article,
      title: String(article.title ?? ""),
      link: String(article.link ?? ""),
      pubDate: article.pubDate as Date,
      summary: (article.summary as string | undefined) ?? null,
      content: (article.content as string | undefined) ?? null,
      feed: { title: null as string | null },
      sourceCount: Array.isArray(article.sourceFeedIds)
        ? article.sourceFeedIds.length
        : 0,
    }));
  }, "fetch articles by feeds and date range");
}
