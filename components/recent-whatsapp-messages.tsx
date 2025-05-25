"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, MessageSquare, ArrowRight } from "lucide-react";

// Later, replace with a call to a server action: import { getRecentWhatsappMessages } from "@/lib/actions";

interface Message {
  id: string;
  sender: string;
  preview: string;
  timestamp: string; // Could be Date object for better sorting/formatting
  unread: boolean;
  link?: string; // Optional link to the full conversation
}

// Mock data similar to app/dashboard/whatsapp/page.tsx
const mockMessages: Message[] = [
  {
    id: "1",
    sender: "John Doe",
    preview: "Confirming my booking for the Toyota Camry next week.",
    timestamp: "11:45 AM",
    unread: true,
    link: "/dashboard/whatsapp?chatId=1"
  },
  {
    id: "2",
    sender: "Alice Wonderland",
    preview: "Is the Ford Explorer available from August 10th to 15th?",
    timestamp: "Yesterday",
    unread: false,
    link: "/dashboard/whatsapp?chatId=2"
  },
  {
    id: "3",
    sender: "Support Bot",
    preview: "Your payment for booking #7890 has been processed successfully.",
    timestamp: "2 days ago",
    unread: false,
  },
  {
    id: "4",
    sender: "Bob The Builder",
    preview: "Quick question about the insurance options provided.",
    timestamp: "3 days ago",
    unread: true,
    link: "/dashboard/whatsapp?chatId=4"
  },
];

export function RecentWhatsappMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true); // Simulate loading
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching data
    const timer = setTimeout(() => {
      // const fetchedMessages = await getRecentWhatsappMessages(4); // Example future action
      setMessages(mockMessages.slice(0, 4)); // Show 4 messages
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
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
              <Link href={message.link || "/dashboard/whatsapp"} key={message.id} className="block hover:bg-muted/50 p-2.5 rounded-md transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`mt-1 h-2.5 w-2.5 rounded-full ${message.unread ? 'bg-primary' : 'bg-muted-foreground/50'} flex-shrink-0`}></div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-baseline">
                        <h4 className={`font-medium truncate text-sm ${message.unread ? 'text-foreground' : 'text-muted-foreground'}`}>{message.sender}</h4>
                        <span className={`text-xs whitespace-nowrap ${message.unread ? 'text-primary font-medium' : 'text-muted-foreground'}`}>{message.timestamp}</span>
                    </div>
                    <p className={`text-xs truncate ${message.unread ? 'text-foreground/90' : 'text-muted-foreground/80'}`}>{message.preview}</p>
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