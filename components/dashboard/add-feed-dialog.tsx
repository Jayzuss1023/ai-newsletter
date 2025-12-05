"use client";

import { useAuth } from "@clerk/nextjs";
import { Plus, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { validateAndAddFeed } from "@/actions/rss-fetch";
import { upsertUserFromClerk } from "@/actions/user";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface AddFeedDialogProps {
  currentFeedCount: number;
  feedLimit: number;
  isPro: boolean;
  trigger?: React.ReactNode;
}

export function AddFeedDialog({
  currentFeedCount,
  feedLimit,
  isPro,
  trigger,
}: AddFeedDialogProps) {
  const { userId } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [newFeedUrl, setNewFeedUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddFeed = async () => {
    if (!newFeedUrl.trim()) {
      toast.error("Plwease enter a valid URL");
      return;
    }

    try {
      setIsAdding(true);

      // Check feed limit
      if (currentFeedCount >= feedLimit) {
        toast.error(
          isPro
            ? "Feed limit reached"
            : "Starter plan limited to to 3 feeds. Upgrade to Prop for unlimited feeds."
        );
        return;
      }

      if (!userId) {
        throw new Error("Not authenticated");
      }

      const user = await upsertUserFromClerk(userId);
      const result = await validateAndAddFeed(user.id, newFeedUrl.trim());

      if (result.error) {
        toast.warning(`Feed added but: ${result.error}`);
      } else {
        toast.success(
          `Feed added successfuly! ${result.articlesCreated} articles imported`
        );
      }

      setNewFeedUrl("");
      setIsOpen(false);
      router.refresh(); // Refresh server component
    } catch (error) {
      console.error("Failed to add feed:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to add RSS feed"
      );
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus />
            Add Feed
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add RSS Feed</DialogTitle>
          <DialogDescription>
            Enter the URL of the RSS feed you want to add. We'll automatically
            fetch and validate it. The https:// prefix is optional.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div>
            <Label>RSS Feed URL</Label>
            <Input
              id="feed-url"
              type="text"
              placeholder="example.com/feed.xml or https://example.com/feed.xml"
              value={newFeedUrl}
              onChange={(e) => setNewFeedUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddFeed();
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isAdding}
          >
            Cancel
          </Button>
          <Button onClick={handleAddFeed} disabled={isAdding}>
            {isAdding ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Adding...
              </>
            ) : (
              "Add Feed"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
