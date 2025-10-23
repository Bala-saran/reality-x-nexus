import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bell, X } from "lucide-react";
import { subscribeToNotifications, isNotificationsEnabled } from "@/lib/notifications";
import { useToast } from "@/hooks/use-toast";

const NotificationPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user hasn't been prompted before and notifications aren't enabled
    const hasBeenPrompted = localStorage.getItem('notificationPromptShown');
    const notificationsEnabled = isNotificationsEnabled();
    
    if (!hasBeenPrompted && !notificationsEnabled && 'Notification' in window) {
      // Show prompt after 3 seconds
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleEnable = async () => {
    const success = await subscribeToNotifications();
    if (success) {
      toast({
        title: "Notifications Enabled",
        description: "You'll now receive updates about events and announcements!",
      });
    } else {
      toast({
        title: "Permission Denied",
        description: "You can enable notifications later in your browser settings.",
        variant: "destructive",
      });
    }
    localStorage.setItem('notificationPromptShown', 'true');
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('notificationPromptShown', 'true');
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <Card className="max-w-md w-full p-6 glass-effect glow-border relative">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 rounded-full bg-primary/10">
            <Bell className="h-12 w-12 text-primary animate-pulse" />
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-2">Stay Updated!</h3>
            <p className="text-muted-foreground">
              Enable notifications to get instant updates about Reality X Club events, announcements, and more.
            </p>
          </div>

          <div className="flex gap-3 w-full">
            <Button
              onClick={handleDismiss}
              variant="outline"
              className="flex-1"
            >
              Maybe Later
            </Button>
            <Button
              onClick={handleEnable}
              className="flex-1"
            >
              Enable Notifications
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NotificationPrompt;
