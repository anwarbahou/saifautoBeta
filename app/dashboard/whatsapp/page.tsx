import { DashboardShell } from "@/components/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface MockMessage {
  id: string;
  sender: string;
  preview: string;
  timestamp: string;
  unread: boolean;
}

const mockMessages: MockMessage[] = [
  {
    id: "1",
    sender: "John Doe",
    preview: "Hey, are we still on for tomorrow? Let me know!",
    timestamp: "10:32 AM",
    unread: true,
  },
  {
    id: "2",
    sender: "Alice Smith",
    preview: "Just checking in on the car rental process.",
    timestamp: "Yesterday",
    unread: false,
  },
  {
    id: "3",
    sender: "Service Update",
    preview: "Your car is scheduled for maintenance on a new date, see details.",
    timestamp: "2 days ago",
    unread: false,
  },
  {
    id: "4",
    sender: "Bob Johnson",
    preview: "Thanks for the great service! The car was perfect.",
    timestamp: "3 days ago",
    unread: true,
  },
];

export default function WhatsappPage() {
  return (
    <DashboardShell>
      <Card>
        <CardHeader>
          <CardTitle>WhatsApp Messages</CardTitle>
          <CardDescription>Manage your customer conversations.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockMessages.map((message) => (
              <div
                key={message.id}
                className={`p-4 rounded-lg border ${
                  message.unread ? "bg-primary/10 border-primary/50" : "bg-card"
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">{message.sender}</h3>
                  <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 truncate">{message.preview}</p>
                {message.unread && (
                  <div className="mt-2 text-xs font-bold text-primary">New Message</div>
                )}
              </div>
            ))}
            {mockMessages.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No messages yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
} 