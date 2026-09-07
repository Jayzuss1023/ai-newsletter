"use server";

import { wrapDatabaseOperation } from "@/lib/database/error-handler";
import { clientPromise } from "@/lib/prisma";

// ============================================
// USER ACTIONS
// ============================================

/**
 * Fetches a user by their Clerk user ID
 *
 * @param clerkUserId - The Clerk authentication ID
 * @returns User record or null if not found
 */
export async function getUserByClerkId(clerkUserId: string) {
  return wrapDatabaseOperation(async () => {
    const client = await clientPromise;
    const db = client.db("newsletter");
    const user = await db.collection("User").findOne({ clerkUserId });

    if (!user) {
      return null;
    }

    return { ...user, id: user._id.toString() };
  }, "fetch user by Clerk ID");
}

/**
 * Creates a user if they don't exist, or returns the existing user
 * Updates the timestamp when user already exists (tracks last activity)
 *
 * Note: Uses findOne + insertOne pattern instead of upsert to avoid transactions
 * (MongoDB Atlas free tier M0 doesn't support transactions)
 *
 * @param clerkUserId - The Clerk authentication ID
 * @returns User record (either created or existing)
 */
export async function upsertUserFromClerk(clerkUserId: string) {
  return wrapDatabaseOperation(async () => {
    const client = await clientPromise;
    const db = client.db("newsletter");
    const existingUser = await db.collection("User").findOne({ clerkUserId });

    if (existingUser) {
      await db.collection("User").updateOne(
        { clerkUserId },
        {
          $set: {
            updatedAt: new Date(),
          },
        },
      );

      const updated = await db.collection("User").findOne({ clerkUserId });
      if (!updated) {
        throw new Error("no user found");
      }
      return { ...updated, id: updated._id.toString() };
    }

    const now = new Date();
    const result = await db.collection("User").insertOne({
      clerkUserId,
      createdAt: now,
      updatedAt: now,
    });

    const created = await db
      .collection("User")
      .findOne({ _id: result.insertedId });

    if (!created) {
      throw new Error("no user found");
    }

    return { ...created, id: created._id.toString() };
  }, "upsert user");
}
