"use client";

import { formatDistanceToNow } from "date-fns";
import { Calendar, ChevronRight, FileText, Trash2 } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";
import { deleteNewsletterAction } from "@/actions/delete-newsletter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTransition, useState } from "react";

interface Newsletter {
  id: string;
  suggestedTitles: string[];
  suggestedSubjectLines: string[];
  body: string;
  topAnnouncements: string[];
  additionalInfo?: string | null;
  startDate: Date;
  endDate: Date;
  userInput?: string | null;
  feedsUsed: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface NewsletterHistoryProps {
  newsletters: Newsletter[];
}

export function NewsletterHistoryList({ newsletters }: NewsletterHistoryProps) {
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (
    e: React.MouseEvent,
    newsletterId: string,
    newsletterTitle: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const confirmed = window.confirm(`
            Are you sure you want to delete "${newsletterTitle}"? This action cannot be undone.
            `);

    if (!confirmed) return;

    setDeletingId(newsletterId);

    startTransition(async () => {
      try {
        await deleteNewsletterAction(newsletterId);
        toast.success("Newsletter deleted successfully");
        setDeletingId(null);
      } catch (error) {
        console.error("Failed to delete newsletter:", error);
        toast.error("Failed to delete newsletter");
        setDeletingId(null);
      }
    });
  };

  if (newsletters.length === 0) {
    return (
      <Card className="transition-all hover:shadow-lg p-4">
        <CardHeader>
          <CardTitle className="text-2xl">No Newsletters Yet</CardTitle>
          <CardDescription className="text-base">
            You haven't saved any newsletters yet. Generate and save your first
            newsletter to see it here.
          </CardDescription>
        </CardHeader>
        <CardDescription>
          <Link href="/dashboard">
            <Button className="bg-linear-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white">
              Go to Dashboard to generate a newsletter →
            </Button>
          </Link>
        </CardDescription>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {newsletters.map((newsletter) => {
        const title = newsletter.suggestedTitles[0] || "Untitled Newsletter";
        const isDeleting = deletingId === newsletter.id || isPending;
        return (
          <Card
            key={newsletter.id}
            className="h-full hover:shadow-lg transition-all group relative border-2 hover:border-cyan-600 dark:hover-cyan-400"
          >
            <Link href={`/dashboard/history/${newsletter.id}`}>
              <div className="cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg line-clamp-2 group-hover:bg-linear-to-r group-hover:from-cyan-500 group-hover:to-teal-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                        {title}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 dark:hover-red-950"
                        onClick={(e) => handleDelete(e, newsletter.id, title)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </Button>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors" />
                    </div>
                  </div>
                  <CardDescription className="flex items-center gap-2 text-sm">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDistanceToNow(new Date(newsletter.createdAt), {
                      addSuffix: true,
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Date Range */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge
                      variant="outline"
                      className="text-xs border-teal-600 text-teal-600"
                    >
                      {new Date(newsletter.startDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                        }
                      )}{" "}
                      -{" "}
                      {new Date(newsletter.endDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </Badge>
                  </div>

                  {/* Preview Text */}
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {newsletter.suggestedSubjectLines[0] ||
                      `${newsletter.body.substring(0, 100)}...`}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2 border-t">
                    <div className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{newsletter.feedsUsed.length}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>
                        {newsletter.topAnnouncements.length} announcements
                      </span>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Link>
          </Card>
        );
      })}
    </div>
  );
}
