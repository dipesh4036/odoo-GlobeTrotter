"use client";

import { Button } from "@/components/ui/button";
import { Share2, Copy, Check, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ShareActionsProps {
  shareUrls: {
    whatsapp: string;
    twitter: string;
    publicUrl: string;
  };
}

export function ShareActions({ shareUrls }: ShareActionsProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrls.publicUrl);
    setIsCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    window.open(shareUrls.whatsapp, "_blank");
  };

  const handleTwitter = () => {
    window.open(shareUrls.twitter, "_blank");
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" className="h-9 w-9 rounded-full shadow-sm text-green-600 hover:text-green-700 hover:bg-green-50" onClick={handleWhatsApp}>
        <MessageCircle className="w-4 h-4" />
      </Button>
      <Button variant="outline" size="icon" className="h-9 w-9 rounded-full shadow-sm text-sky-500 hover:text-sky-600 hover:bg-sky-50" onClick={handleTwitter}>
        <Share2 className="w-4 h-4" />
      </Button>
      <Button variant="outline" size="icon" className="h-9 w-9 rounded-full shadow-sm" onClick={handleCopy}>
        {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-zinc-500" />}
      </Button>

      <div className="w-px h-6 bg-zinc-200 mx-1" />

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button variant="outline" className="h-9 rounded-full shadow-sm bg-white" disabled>
              <Copy className="w-4 h-4 mr-2" />
              Copy Trip
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-zinc-900 text-white border-none rounded-lg text-xs font-medium">
            <p>Login to copy this trip</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
