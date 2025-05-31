"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, AlertTriangle, Loader2, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

interface TwilioMessage {
  sid: string;
  body: string;
  status: string;
  dateSent: string;
  direction: string; // e.g., 'inbound', 'outbound-api', 'outbound-call', 'outbound-reply'
  from: string;
  to: string;
  errorCode?: string | null;
  errorMessage?: string | null;
}

const WhatsAppDashboardPage = () => {
  const [messages, setMessages] = useState<TwilioMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/twilio/messages');
        const data = await response.json();
        if (data.success) {
          setMessages(data.messages);
        } else {
          setError(data.error || 'Failed to load messages.');
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError('An unexpected error occurred while fetching messages.');
      }
      setLoading(false);
    };

    fetchMessages();
  }, []);

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case 'sent':
      case 'delivered':
      case 'read':
        return 'default';
      case 'failed':
      case 'undelivered':
        return 'destructive';
      case 'queued':
      case 'sending':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <main className="flex flex-col flex-1 p-6 md:p-8 h-full">
      <Card className="w-full flex flex-col flex-1">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <MessageCircle className="h-6 w-6 mr-3 text-primary" />
            WhatsApp Messages
          </CardTitle>
          <CardDescription>
            View recent WhatsApp conversations from Twilio.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 overflow-hidden">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
              <p className="text-muted-foreground">Loading messages...</p>
            </div>
          )}
          {error && (
            <div className="flex flex-col items-center justify-center py-12 text-destructive">
              <AlertTriangle className="h-10 w-10 mb-3" />
              <p className="text-lg font-semibold">Error loading messages</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
          {!loading && !error && messages.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No WhatsApp messages found.</p>
            </div>
          )}
          {!loading && !error && messages.length > 0 && (
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <Card key={msg.sid} className={`w-full ${msg.direction.startsWith('outbound') ? 'ml-auto bg-blue-50 dark:bg-blue-900/30' : 'mr-auto bg-gray-50 dark:bg-gray-700/30'} max-w-[85%]`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center text-sm font-medium">
                          {msg.direction.startsWith('outbound') ? 
                            <ArrowUpCircle className="h-4 w-4 mr-2 text-blue-500" /> : 
                            <ArrowDownCircle className="h-4 w-4 mr-2 text-green-500" />}
                          {msg.direction.startsWith('outbound') ? `To: ${msg.to}` : `From: ${msg.from}`}
                        </div>
                        <Badge variant={getStatusBadgeVariant(msg.status)} className="text-xs">
                          {msg.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground/90 whitespace-pre-wrap break-words">
                        {msg.body}
                      </p>
                      <div className="text-xs text-muted-foreground mt-2 text-right">
                        {new Date(msg.dateSent).toLocaleString()}
                      </div>
                      {msg.errorCode && (
                        <p className="text-xs text-destructive mt-1">
                          Error {msg.errorCode}: {msg.errorMessage}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default WhatsAppDashboardPage; 