import { auth } from "@clerk/nextjs/server";
import { ExternalLink, Plus } from "lucide-react";
import { getRssFeedsByUserId } from "@/actions/rss-feed";
import { upsertUserFromClerk } from "@/actions/user";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { AddFeedDialog } from "./add-feed-dialog";
// import { DeleteFeedButton } from "./delete-feed-button";

interface RssFeed {
  id: string;
  url: string;
  title: string | null;
  description: string | null;
  lastFetched: Date | null;
  _count?: {
    articles: number;
  };
}

export async function RssFeedManager() {
  const { userId, has } = await auth();
  const isPro = await has({ plan: "pro" });
  const feedLimit = isPro ? Infinity : 3;

  const user = await upsertUserFromClerk(userId!);
  const feeds = (await getRssFeedsByUserId(user.id)) as RssFeed[];

  return (
    <Card>
      <CardHeader>
        <div>
          <div>
            <CardTitle>RSS Feeds</CardTitle>
            <CardDescription>Manage your RSS feed sources</CardDescription>
          </div>
          {/* <AddFeedDialog/> */}
        </div>
      </CardHeader>
      <CardContent>
        {feeds.length === 0 ? (
          <div>
            <div>No RSS feeds added yet</div>
            {/* <AddFeedDialog/> */}
          </div>
        ) : (
          <div>
            {feeds.map((feed) => (
              <div key={feed.id}>
                <div>
                  <div>
                    <div>
                      <h3>{feed.title || "Untitled Feed"}</h3>
                    </div>
                    <a href={feed.url}>
                      <span>{feed.url}</span>
                      <ExternalLink />
                    </a>
                    {feed.description && <p>{feed.description}</p>}
                    <div>
                      <span>
                        {feed._count?.articles ?? 0} article
                        {feed._count?.articles !== 1 ? "s" : ""}
                      </span>
                      {feed.lastFetched && (
                        <span>
                          Last fetched:{" "}
                          {new Date(feed.lastFetched).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* <DeleteFeedButton
                    feedId={feed.id}
                    feedTitle={feed.title || feed.url}
                  /> */}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
