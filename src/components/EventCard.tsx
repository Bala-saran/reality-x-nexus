import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, ExternalLink } from "lucide-react";
import { format } from "date-fns";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string | null;
    event_date: string;
    image_url: string | null;
    link: string | null;
  };
  index: number;
}

const EventCard = ({ event, index }: EventCardProps) => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Card 
        className="glass-effect glow-border hover:neon-glow transition-all duration-300 animate-fade-in overflow-hidden group cursor-pointer"
        style={{ animationDelay: `${index * 0.1}s` }}
        onClick={() => setShowDialog(true)}
      >
      {event.image_url && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={event.image_url} 
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
        </div>
      )}
      <CardHeader>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(event.event_date), 'PPP')}</span>
        </div>
        <CardTitle className="text-xl font-bold">{event.title}</CardTitle>
        {event.description && (
          <CardDescription className="text-muted-foreground">
            {event.description}
          </CardDescription>
        )}
      </CardHeader>
      {event.link && (
        <CardContent>
          <Button 
            className="w-full glow-border hover:neon-glow transition-all"
            onClick={(e) => {
              e.stopPropagation();
              window.open(event.link!, '_blank');
            }}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Learn More
          </Button>
        </CardContent>
      )}
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="glass-effect glow-border max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold glow-text">{event.title}</DialogTitle>
            <DialogDescription className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(event.event_date), 'PPP')}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {event.image_url && (
              <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-lg">
                <img 
                  src={event.image_url} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {event.description && (
              <div className="prose prose-invert max-w-none">
                <p className="text-muted-foreground whitespace-pre-wrap">{event.description}</p>
              </div>
            )}
            {event.link && (
              <Button 
                className="w-full glow-border hover:neon-glow transition-all"
                onClick={() => window.open(event.link!, '_blank')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Learn More
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventCard;
