"use server";

import { wrapDatabaseOperation } from "@/lib/database/error-handler";
import { clientPromise } from "@/lib/prisma";
import { ObjectId, type UpdateFilter, type Document } from "mongodb";

type RssFeedDocument = {
  _id: ObjectId;
  userId: ObjectId;
  url: string;
  title?: string | null;
  description?: string | null;
  link?: string | null;
  imageUrl?: string | null;
  language?: string | null;
  lastFetched?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type RssFeedWithCount = RssFeedDocument & {
  id: string;
  _count: { articles: number };
};

/**
 * Fetches all RSS feeds for a specific user with article counts
 */
export async function getRssFeedsByUserId(
  userId: string,
): Promise<RssFeedWithCount[]> {
  return wrapDatabaseOperation(async () => {
    const client = await clientPromise;
    const db = client.db("newsletter");
    const feeds = await db
      .collection<RssFeedDocument>("RssFeed")
      .find({
        userId: new ObjectId(userId),
      })
      .sort({ createdAt: -1 })
      .toArray();

    return Promise.all(
      feeds.map(async (feed): Promise<RssFeedWithCount> => {
        const articles = await db.collection("RssArticle").countDocuments({
          $or: [
            { feedId: feed._id },
            { sourceFeedIds: feed._id },
            { feedId: feed._id.toString() },
            { sourceFeedIds: feed._id.toString() },
          ],
        });

        return {
          ...feed,
          id: feed._id.toString(),
          _count: { articles },
        };
      }),
    );
  }, "fetch RSS feeds");
}

/**
 * Updates the lastFetched timestamp for an RSS feed
 */
export async function updateFeedLastFetched(feedId: string) {
  return wrapDatabaseOperation(async () => {
    const client = await clientPromise;
    const db = client.db("newsletter");
    await db.collection("RssFeed").updateOne(
      { _id: new ObjectId(feedId) },
      {
        $set: {
          lastFetched: new Date(),
          updatedAt: new Date(),
        },
      },
    );

    const feed = await db.collection("RssFeed").findOne({
      _id: new ObjectId(feedId),
    });

    if (!feed) {
      return null;
    }

    return { ...feed, id: feed._id.toString() };
  }, "update feed last fetched");
}

/**
 * Permanently deletes an RSS feed and cleans up articles not referenced by other feeds
 */
export async function deleteRssFeed(feedId: string) {
  return wrapDatabaseOperation(async () => {
    const client = await clientPromise;
    const db = client.db("newsletter");
    const feedObjectId = new ObjectId(feedId);

    await db.collection("RssArticle").updateMany(
      { sourceFeedIds: feedObjectId },
      { $pull: { sourceFeedIds: feedObjectId } } as unknown as UpdateFilter<Document>,
    );
    await db.collection("RssArticle").updateMany(
      { sourceFeedIds: feedId },
      { $pull: { sourceFeedIds: feedId } } as unknown as UpdateFilter<Document>,
    );

    await db.collection("RssArticle").deleteMany({
      sourceFeedIds: { $size: 0 },
    });

    await db.collection("RssFeed").deleteOne({
      _id: feedObjectId,
    });

    return { success: true };
  }, "delete RSS feed");
}
