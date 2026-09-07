"use server";

import { auth } from "@clerk/nextjs/server";
import clientPromise from "@/lib/prisma";
import { ObjectId, WithId, Document } from "mongodb";
import type { UserSettings } from "@prisma/client";

// ============================================
// USER SETTINGS ACTIONS
// ============================================

/**
 * User settings input type for upsert operations
 */

export interface UserSettingsInput {
  // Basic settings
  newsletterName?: string | null;
  description?: string | null;
  targetAudience?: string | null;
  defaultTone?: string | null;

  // Branding
  brandVoice?: string | null;
  companyName?: string | null;
  industry?: string | null;

  // Additional Information
  disclaimerText?: string | null;
  defaultTags?: string[];
  customFooter?: string | null;
  senderName?: string | null;
  senderEmail?: string | null;
}

function toUserSettings(doc: WithId<Document>): UserSettings {
  return {
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    newsletterName: (doc.newsletterName as string | null) ?? null,
    description: (doc.description as string | null) ?? null,
    targetAudience: (doc.targetAudience as string | null) ?? null,
    defaultTone: (doc.defaultTone as string | null) ?? null,
    brandVoice: (doc.brandVoice as string | null) ?? null,
    companyName: (doc.companyName as string | null) ?? null,
    industry: (doc.industry as string | null) ?? null,
    disclaimerText: (doc.disclaimerText as string | null) ?? null,
    defaultTags: Array.isArray(doc.defaultTags) ? doc.defaultTags : [],
    customFooter: (doc.customFooter as string | null) ?? null,
    senderName: (doc.senderName as string | null) ?? null,
    senderEmail: (doc.senderEmail as string | null) ?? null,
    createdAt: (doc.createdAt as Date) ?? new Date(),
    updatedAt: (doc.updatedAt as Date) ?? new Date(),
  };
}

/**
 * Fetches user settings for the authenticated user
 */
export async function getCurrentUserSettings() {
  const client = await clientPromise;
  const db = client.db("newsletter");
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const user = await db.collection("User").findOne({
      clerkUserId: userId,
    });

    if (!user) {
      return null;
    }

    const settings = await db.collection("UserSettings").findOne({
      userId: user._id,
    });

    if (!settings) {
      return null;
    }

    return toUserSettings(settings);
  } catch (error) {
    console.error("Failed to fetch user settings:", error);
    throw new Error("Failed to fetch user settings");
  }
}

/**
 * Fetches user settings by database userId
 */
export async function getUserSettingsByUserId(userId: string) {
  const client = await clientPromise;
  const db = client.db("newsletter");
  try {
    const settings = await db.collection("UserSettings").findOne({
      userId: new ObjectId(userId),
    });

    if (!settings) {
      return null;
    }

    return toUserSettings(settings);
  } catch (error) {
    console.error("Failed to fetch user settings by user Id:", error);
    throw new Error("Failed to fetch user settings");
  }
}

/**
 * Creates or updates user settings for the authenticated user
 */
export async function upsertUserSettings(data: UserSettingsInput) {
  const client = await clientPromise;
  const db = client.db("newsletter");
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Get the database user
    const user = await db.collection("User").findOne({
      clerkUserId: userId,
    });

    if (!user) {
      throw new Error("User not found in database");
    }

    // Check if settings exist (avoid upsert due to MongoDB free tier transaction limitation)
    const existingSettings = await db.collection("UserSettings").findOne({
      userId: user._id,
    });

    let settings: WithId<Document> | null = null;
    if (existingSettings) {
      // Update existing settings
      await db.collection("UserSettings").updateOne(
        {
          userId: user._id,
        },
        {
          $set: {
            newsletterName: data.newsletterName,
            description: data.description,
            targetAudience: data.targetAudience,
            defaultTone: data.defaultTone,
            brandVoice: data.brandVoice,
            companyName: data.companyName,
            industry: data.industry,
            disclaimerText: data.disclaimerText,
            defaultTags: data.defaultTags || [],
            customFooter: data.customFooter,
            senderName: data.senderName,
            senderEmail: data.senderEmail,
            updatedAt: new Date(),
          },
        },
      );
      settings = await db.collection("UserSettings").findOne({
        userId: user._id,
      });
    } else {
      const now = new Date();
      const result = await db.collection("UserSettings").insertOne({
        userId: user._id,
        newsletterName: data.newsletterName,
        description: data.description,
        targetAudience: data.targetAudience,
        defaultTone: data.defaultTone,
        brandVoice: data.brandVoice,
        companyName: data.companyName,
        industry: data.industry,
        disclaimerText: data.disclaimerText,
        defaultTags: data.defaultTags || [],
        customFooter: data.customFooter,
        senderName: data.senderName,
        senderEmail: data.senderEmail,
        createdAt: now,
        updatedAt: now,
      });
      settings = await db.collection("UserSettings").findOne({
        _id: result.insertedId,
      });
    }

    return settings ? toUserSettings(settings) : null;
  } catch (error) {
    console.error("Failed to upsert user settings:", error);
    throw new Error("Failed to save user settings;");
  }
}

/**
 * Deletes user settings for the authenticated user
 */
export async function deleteUserSettings(): Promise<void> {
  const client = await clientPromise;
  const db = client.db("newsletter");
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const user = await db.collection("User").findOne({
      clerkUserId: userId,
    });

    if (!user) {
      throw new Error("User not found in database");
    }

    await db.collection("UserSettings").deleteMany({
      userId: user._id,
    });
  } catch (error) {
    console.error("Failed to delete user settings:", error);
    throw new Error("Fialed to delete user settings;");
  }
}
