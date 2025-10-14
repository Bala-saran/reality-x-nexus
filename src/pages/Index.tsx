import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Shield, Calendar, Trophy, Image as ImageIcon } from "lucide-react";
import EventCard from "@/components/EventCard";
import { useQuery } from "@tanstack/react-query";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
      
      {/* Header */}
      <header className="relative z-10 border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold glow-text animate-glow-pulse">REALITY X CLUB</h1>
          {user ? (
            <Button onClick={() => navigate('/admin')} className="glow-border">
              <Shield className="mr-2 h-4 w-4" />
              Admin Dashboard
            </Button>
          ) : (
            <Button onClick={() => navigate('/auth')} className="glow-border">
              <Shield className="mr-2 h-4 w-4" />
              Admin Login
            </Button>
          )}
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
          <div className="flex flex-wrap justify-center gap-4 pt-8">
            <Button 
              size="lg" 
              onClick={() => navigate('/leaderboard')}
              className="glass-effect glow-border hover:neon-glow transition-all"
            >
              <Trophy className="mr-2 h-5 w-5" />
              View Leaderboard
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/gallery')}
              className="glass-effect glow-border hover:neon-glow transition-all"
            >
              <ImageIcon className="mr-2 h-5 w-5" />
              Gallery
            </Button>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="relative z-10 container mx-auto px-4 py-12">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Calendar className="h-8 w-8 text-primary animate-float" />
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
    </div>
  );
};

export default Index;
