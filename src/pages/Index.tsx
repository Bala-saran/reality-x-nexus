import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Calendar, Trophy, Image as ImageIcon } from "lucide-react";
import EventCard from "@/components/EventCard";
import { useQuery } from "@tanstack/react-query";
import logo from "@/assets/reality-x-logo.jpg";
import NotificationPrompt from "@/components/NotificationPrompt";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <NotificationPrompt />
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
      
      {/* Header */}
      <header className="relative z-10 border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <img 
            src={logo} 
            alt="Reality X Club" 
            className="h-16 w-16 object-contain cursor-pointer hover:opacity-80 transition-opacity select-none" 
            onMouseDown={() => {
              const timer = setTimeout(() => {
                navigate('/admin');
              }, 5000);
              setPressTimer(timer);
            }}
            onMouseUp={() => {
              if (pressTimer) clearTimeout(pressTimer);
            }}
            onMouseLeave={() => {
              if (pressTimer) clearTimeout(pressTimer);
            }}
            onTouchStart={() => {
              const timer = setTimeout(() => {
                navigate('/admin');
              }, 5000);
              setPressTimer(timer);
            }}
            onTouchEnd={() => {
              if (pressTimer) clearTimeout(pressTimer);
            }}
          />
          <div className="flex items-center gap-3">
            <Button onClick={() => navigate('/')} variant="ghost" className="text-white hover:text-primary">
              <Calendar className="mr-2 h-4 w-4" />
              Events
            </Button>
            <Button onClick={() => navigate('/leaderboard')} variant="ghost" className="text-white hover:text-primary">
              <Trophy className="mr-2 h-4 w-4" />
              Leaderboard
            </Button>
            <Button onClick={() => navigate('/gallery')} variant="ghost" className="text-white hover:text-primary">
              <ImageIcon className="mr-2 h-4 w-4" />
              Gallery
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          <h2 className="text-6xl md:text-7xl font-black glow-text">
            REALITY X CLUB
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground font-light">
            ✨ Innovate • Create • Dominate — The Reality X Way! ✨
          </p>
        </div>
      </section>

      {/* Events Section */}
      <section className="relative z-10 container mx-auto px-4 py-12">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Calendar className="h-8 w-8 text-[hsl(var(--primary-glow))] animate-float drop-shadow-[0_0_10px_hsl(var(--primary-glow))]" />
          <h3 className="text-3xl font-bold glow-text">Upcoming Events</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.length > 0 ? (
            events.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">No events scheduled yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Floating particles effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold text-foreground">
              Powered by V.BALASARAN
            </p>
            <p className="text-sm text-muted-foreground">
              Staff Members : Mrs.K.Srisathya & Mrs.G.Geetha
            </p>
            <p className="text-sm text-muted-foreground">
              Club Chairman : S.Vignesh
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
