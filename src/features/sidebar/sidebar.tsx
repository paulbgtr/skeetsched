"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DraftsTab } from "./drafts/drafts-tab";
import { ScheduledPostsTab } from "./scheduled-posts/scheduled-posts-tab";

export default function Sidebar() {
  return (
    <aside className="py-2 w-72 min-h-screen border-r-[1px] text-gray-800">
      <Tabs defaultValue="drafts">
        <div className="px-2">
          <TabsList className="w-full">
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
            <TabsTrigger value="scheduled-posts">Scheduled</TabsTrigger>
          </TabsList>
          <div>
            <TabsContent value="drafts">
              <DraftsTab />
            </TabsContent>
            <TabsContent value="scheduled-posts">
              <ScheduledPostsTab />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </aside>
  );
}
