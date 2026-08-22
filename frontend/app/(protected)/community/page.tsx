"use client";

import { useState } from "react";
import { useCommunityPostsQuery, useCreateCommunityPostMutation } from "@/api/useCommunity";
import { useTripsQuery } from "@/api/useTrips";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { 
  Search, 
  Filter, 
  ChevronDown, 
  PlusCircle, 
  Loader2, 
  MessageSquare,
  Map,
  UserCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

export default function CommunityPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");

  const { data: posts, isLoading: isPostsLoading } = useCommunityPostsQuery(search, sort);
  const { data: myTrips, isLoading: isTripsLoading } = useTripsQuery();
  const { mutateAsync: createPost, isPending: isCreating } = useCreateCommunityPostMutation();

  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedTripId, setSelectedTripId] = useState<string>("none");

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      toast.error("Post content cannot be empty.");
      return;
    }

    try {
      await createPost({
        content: newPostContent,
        tripId: selectedTripId === "none" ? undefined : selectedTripId,
      });
      toast.success("Post created successfully!");
      setIsNewPostOpen(false);
      setNewPostContent("");
      setSelectedTripId("none");
      queryClient.invalidateQueries({ queryKey: ["community"] });
    } catch (err) {
      toast.error("Failed to create post. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-32">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pt-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-bold text-3xl tracking-tight text-zinc-900">Community</h1>
          <Button 
            className="rounded-xl shadow-md shadow-indigo-500/10 hover:shadow-lg transition-all bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
            onClick={() => setIsNewPostOpen(true)}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input 
              placeholder="Search posts..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-11 bg-white border-zinc-200 rounded-xl focus:border-indigo-500 w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-11 rounded-xl bg-white">
              <Filter className="w-4 h-4 mr-2 text-zinc-500" />
              Filter
            </Button>
            <Select value={sort} onValueChange={(val) => setSort(val || "recent")}>
              <SelectTrigger className="w-[140px] h-11 rounded-xl bg-white border-zinc-200 focus:border-indigo-500">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Post List */}
        <div className="space-y-4">
          {isPostsLoading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-zinc-200 rounded-2xl animate-pulse" />
            ))
          ) : posts?.length === 0 ? (
            <div className="p-16 text-center border-2 border-dashed border-zinc-200 bg-white rounded-3xl">
              <MessageSquare className="w-10 h-10 text-zinc-300 mx-auto mb-4" />
              <p className="text-zinc-500 font-medium">No posts found. Be the first to post!</p>
            </div>
          ) : (
            <AnimatePresence>
              {posts?.map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.05, 0.5), duration: 0.3 }}
                >
                  <Card className="p-6 rounded-2xl bg-white border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      {post.user.photoUrl ? (
                        <div 
                          className="w-12 h-12 rounded-full bg-cover bg-center flex-shrink-0"
                          style={{ backgroundImage: `url(${post.user.photoUrl})` }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0">
                          <UserCircle className="w-8 h-8 text-zinc-300" />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-zinc-900 truncate">
                            {post.user.firstName} {post.user.lastName}
                          </h4>
                          <span className="text-xs text-zinc-500 flex-shrink-0">
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        
                        <p className="text-zinc-700 text-sm whitespace-pre-wrap leading-relaxed mb-3">
                          {post.content}
                        </p>
                        
                        {post.trip && (
                          <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-medium">
                            <Map className="w-3 h-3 mr-1.5" />
                            {post.trip.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </main>

      {/* New Post Dialog */}
      <Dialog open={isNewPostOpen} onOpenChange={setIsNewPostOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Create New Post</DialogTitle>
            <DialogDescription>
              Share your travel plans, ask questions, or post an update.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <Textarea 
              placeholder="What's on your mind?"
              className="min-h-[120px] resize-none rounded-xl bg-zinc-50 border-transparent focus:border-indigo-500 focus:bg-white"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Link a Trip (Optional)</label>
              <Select value={selectedTripId} onValueChange={(val) => setSelectedTripId(val || "none")} disabled={isTripsLoading}>
                <SelectTrigger className="h-11 rounded-xl bg-zinc-50 border-transparent focus:border-indigo-500 focus:bg-white">
                  <SelectValue placeholder="Select a trip..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Trip</SelectItem>
                  {myTrips?.map(trip => (
                    <SelectItem key={trip.id} value={trip.id}>{trip.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" className="rounded-xl" onClick={() => setIsNewPostOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700" 
              onClick={handleCreatePost}
              disabled={isCreating || !newPostContent.trim()}
            >
              {isCreating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
