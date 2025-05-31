"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, MessageSquare, ArrowRight } from "lucide-react";
import { getRecentWhatsappMessages } from "@/lib/actions";

interface Message {
  id: string;
  sender: string;
  preview: string;
  timestamp: string; // Could be Date object for better sorting/formatting
  unread: boolean;
  link?: string; // Optional link to the full conversation
}

export function RecentWhatsappMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMessages() {
      setLoading(true);
      setError(null);
      try {
        const fetchedMessages = await getRecentWhatsappMessages(4); // Fetch 4 messages
        if (fetchedMessages && Array.isArray(fetchedMessages)) { // Basic check
          setMessages(fetchedMessages);
        } else {
          // This case might indicate an issue with the action's return type or an unexpected response
          console.warn("getRecentWhatsappMessages returned an unexpected value:", fetchedMessages);
          setMessages([]); // Default to empty array
        }
      } catch (err: any) {
        console.error("Error fetching recent WhatsApp messages:", err);
        setError(err.message || "Failed to load messages.");
        setMessages([]); // Clear messages on error
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, []);

  return (
    <Card className="col-span-1 md:col-span-1 lg:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-medium">Recent Messages</CardTitle>
          <CardDescription className="text-sm">Latest WhatsApp interactions.</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/whatsapp">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center h-48 text-destructive">
            <AlertTriangle className="h-8 w-8 mb-2" />
            <p className="text-center">{error}</p>
          </div>
        )}
        {!loading && !error && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48">
             <MessageSquare className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No recent messages.</p>
          </div>
        )}
        {!loading && !error && messages.length > 0 && (
          <div className="space-y-3 pt-2">
            {messages.map((message) => (
              <Link href={message.link || "/dashboard/whatsapp"} key={message.id} className="block group">
                <div className="flex items-end gap-2 p-3 rounded-lg transition-colors group-hover:bg-muted/50">
                  <div className={`flex-shrink-0 h-2.5 w-2.5 rounded-full self-start mt-1.5 ${message.unread ? 'bg-primary' : 'bg-muted-foreground/30'}`}></div>
                  
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className={`font-semibold text-sm ${message.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {message.sender}
                      </h4>
                      <span className={`text-xs whitespace-nowrap ${message.unread ? 'text-primary font-medium' : 'text-muted-foreground/80'}`}>
                        {message.timestamp}
                      </span>
                    </div>
                    <div className={`p-2 rounded-md ${message.unread ? 'bg-primary/10 dark:bg-primary/20' : 'bg-muted/60 dark:bg-muted/40'}`}>
                       <p className={`text-xs ${message.unread ? 'text-foreground/90' : 'text-muted-foreground'}`}>
                        {message.preview}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 