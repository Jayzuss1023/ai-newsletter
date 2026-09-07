"use server";

import { wrapDatabaseOperation } from "@/lib/database/error-handler";
import { clientPromise } from "@/lib/prisma";
import { Newsletter } from "@prisma/client";
import { ObjectId } from "mongodb";

// ============================================
// NEWSLETTER ACTIONS
// ============================================

/**
 * Creates and saves a generated newsletter to the database
 *
 * This function is called after AI generation completes (Pro users only).
 * It stores all newsletter components for future reference.
 *
 * @param data - Complete newsletter data and metadata
 * @returns Created newsletter record
 */

type NewsletterDocument = {
  _id: ObjectId;
  userId: ObjectId;
  suggestedTitles: string[];
  suggestedSubjectLines: string[];
  body: string;
  topAnnouncements: string[];
  additionalInfo?: string | null;
  startDate: Date;
  endDate: Date;
  userInput?: string | null;
  feedsUsed: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
};

// Reconstruct the MongoDB(NewsletterDocument) format to match the Type Newsletter
function toNewsletter(doc: NewsletterDocument) {
  return {
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    suggestedTitles: doc.suggestedTitles,
    suggestedSubjectLines: doc.suggestedSubjectLines,
    body: doc.body,
    topAnnouncements: doc.topAnnouncements,
    additionalInfo: doc.additionalInfo ?? null,
    startDate: doc.startDate,
    endDate: doc.endDate,
    userInput: doc.userInput ?? null,
    feedsUsed: doc.feedsUsed.map((id) => id.toString()),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function createNewsletter(data: {
  userId: string;
  suggestedTitles: string[];
  suggestedSubjectLines: string[];
  body: string;
  topAnnouncements: string[];
  additionalInfo?: string;
  startDate: Date;
  endDate: Date;
  userInput?: string;
  feedsUsed: string[];
}) {
  return wrapDatabaseOperation(async () => {
    const client = await clientPromise;
    const db = client.db("newsletter");
    const now = new Date();
    const result = await db.collection("Newsletter").insertOne({
      userId: new ObjectId(data.userId),
      suggestedTitles: data.suggestedTitles,
      suggestedSubjectLines: data.suggestedSubjectLines,
      body: data.body,
      topAnnouncements: data.topAnnouncements,
      additionalInfo: data.additionalInfo,
      startDate: data.startDate,
      endDate: data.endDate,
      userInput: data.userInput,
      feedsUsed: data.feedsUsed.map((id) => new ObjectId(id)),
      createdAt: now,
      updatedAt: now,
    });

    const newsletter = await db
      .collection("Newsletter")
      .findOne({ _id: result.insertedId });

    if (!newsletter) {
      return null;
    }

    return { ...newsletter, id: newsletter._id.toString() };
  }, "create newsletter");
}

/**
 * Gets all newsletters for a user, ordered by most recent first
 *
 * Supports pagination via limit and skip options.
 * Used for displaying newsletter history.
 *
 * @param userId - User's database ID
 * @param options - Optional pagination parameters
 * @returns Array of newsletters
 */

export async function getNewslettersByUserId(
  userId: string,
  options?: {
    limit?: number;
    skip?: number;
  },
) {
  return wrapDatabaseOperation(async () => {
    const client = await clientPromise;
    const db = client.db("newsletter");
    const newsletters = await db
      .collection("Newsletter")
      .find({
        userId: new ObjectId(userId),
      })
      .sort({ createdAt: -1 })
      .skip(options?.skip ?? 0)
      .limit(options?.limit ?? 0)
      .toArray();

    return newsletters.map((newsletter) => ({
      ...newsletter,
      id: newsletter._id.toString(),
    }));
  }, "fetch newsletters by user");
}

/**
 * Gets a single newsletter by ID with authorization check
 *
 * Ensures the newsletter belongs to the requesting user
 * for security. Returns null if not found.
 *
 * @param id - Newsletter ID
 * @param userId - User's database ID for authorization
 * @returns Newsletter or null if not found/unauthorized
 */
export async function getNewsletterById(id: string, userId: string) {
  return wrapDatabaseOperation(async () => {
    const client = await clientPromise;
    const db = client.db("newsletter");
    const newsletter = await db
      .collection<NewsletterDocument>("Newsletter")
      .findOne({
        _id: new ObjectId(id),
      });

    if (!newsletter) return null;

    if (newsletter.userId.toString() !== userId) {
      throw new Error("Unauthorized: Newsletter does not belong to user");
    }

    return toNewsletter(newsletter);
  }, "fetch newsletter by ID");
}

/**
 * Gets the total count of newsletters for a user
 *
 * Useful for pagination and displaying totals.
 *
 * @param userId - User's database ID
 * @returns Number of newsletters
 */
export async function getNewslettersCountByUserId(userId: string) {
  return wrapDatabaseOperation(async () => {
    const client = await clientPromise;
    const db = client.db("newsletter");
    return await db.collection("Newsletter").countDocuments({
      userId: new ObjectId(userId),
    });
  }, "count newsletters by user");
}

/**
 * Deletes a newsletter by ID with authorization check
 *
 * Verifies the newsletter exists and belongs to the user
 * before deletion. Throws error if not authorized.
 *
 * @param id - Newsletter ID to delete
 * @param userId - User's database ID for authorization
 * @retunbs Deleted newsletter record
 */
export async function deleteNewsletter(id: string, userId: string) {
  return wrapDatabaseOperation(async () => {
    const client = await clientPromise;
    const db = client.db("newsletter");
    const newsletter = await db.collection("Newsletter").findOne({
      _id: new ObjectId(id),
    });

    if (!newsletter) {
      throw new Error("Newsletter not found");
    }

    if (newsletter.userId.toString() !== userId) {
      throw new Error("Unauthorized: Newletter does not belong to user");
    }

    await db.collection("Newsletter").deleteOne({
      _id: new ObjectId(id),
    });

    return { ...newsletter, id: newsletter._id.toString() };
  }, "delete newsletter");
}
