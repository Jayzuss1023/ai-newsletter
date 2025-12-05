// ============================================
// RSS-SPECIFIC TYPE DEFINITIONS
// ============================================

import { StringToBoolean } from "class-variance-authority/dist/types";

/**
 * Data required to create an RSS article.
 */
export interface ArticleCreateData {
  feedId: string;
  guid: string;
  title: string;
  link: string;
  content?: string;
  summary?: string;
  pubDate: Date;
  author?: string;
  categories?: string[];
  imageUrl?: string;
}

/**
 * Result of bulk article creation operation
 */
export interface BulkOperationResult {
  created: number;
  skipped: number;
  errors: number;
}

/**
 * Feed metadata extracted from RSS feed
 */
export interface FeedMetadata {
  title: string;
  description?: string;
  link?: string;
  imageUrl?: string;
  language?: string;
}

/**
 * Article data extracted from RSS feed item
 */
export interface ArticleData {
  guid: string;
  title: string;
  link: string;
  content?: string;
  summary?: string;
  pubDate: Date;
  author?: string;
  categories: string[];
  imageUrl?: string;
}
