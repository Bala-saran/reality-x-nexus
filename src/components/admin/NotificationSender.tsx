import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Bell } from "lucide-react";
import { sendBrowserNotification } from "@/lib/notifications";
import { useToast } from "@/hooks/use-toast";

const NotificationSender = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleSendNotification = () => {
    if (!title || !message) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and message",
        variant: "destructive",
      });
      return;
    }

    // Send browser notification
    sendBrowserNotification(title, {
      body: message,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'reality-x-notification',
      requireInteraction: false,
    });

    toast({
      title: "Notification Sent",
      description: "Push notification has been sent to all subscribed users",
    });

    // Clear form
    setTitle("");
    setMessage("");
  };

  return (
    <Card className="glass-effect glow-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Send Push Notification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Notification Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., New Event Announced!"
            className="glass-effect"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Message</label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your notification message..."
            className="glass-effect min-h-[100px]"
          />
        </div>

        <Button 
          onClick={handleSendNotification}
          className="w-full"
        >
          <Bell className="mr-2 h-4 w-4" />
          Send to All Users
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Note: Only users who have enabled browser notifications will receive this.
        </p>
      </CardContent>
    </Card>
  );
};

export default NotificationSender;
