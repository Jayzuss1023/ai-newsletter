"use client";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteRssFeed } from "@/actions/rss-feed";
import { Button } from "@/components/ui/button";

interface DeleteFeedButtonProps {
  feedId: string;
  feedTitle: string;
}

export function DeleteFeedButton({ feedId, feedTitle }: DeleteFeedButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {};

  return (
    <Button>
      <Trash2 />
    </Button>
  );
}
