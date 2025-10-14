import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Trophy, Image as ImageIcon, TrendingUp } from "lucide-react";

const DashboardHome = () => {
  const { data: eventsCount = 0 } = useQuery({
    queryKey: ['events-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const { data: leaderboardCount = 0 } = useQuery({
    queryKey: ['leaderboard-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('leaderboard')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const { data: galleryCount = 0 } = useQuery({
    queryKey: ['gallery-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('gallery')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const stats = [
    {
      title: 'Total Events',
      value: eventsCount,
      icon: Calendar,
      color: 'text-blue-400',
    },
    {
      title: 'Leaderboard Entries',
      value: leaderboardCount,
      icon: Trophy,
      color: 'text-yellow-400',
    },
    {
      title: 'Gallery Images',
      value: galleryCount,
      icon: ImageIcon,
      color: 'text-purple-400',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={stat.title}
              className="glass-effect glow-border hover:neon-glow transition-all animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold glow-text">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="glass-effect glow-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>Welcome to Admin Dashboard</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Use the sidebar to navigate between different sections:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• <span className="text-foreground">Events:</span> Create, edit, and manage upcoming events</li>
            <li>• <span className="text-foreground">Leaderboard:</span> Add and manage participant rankings</li>
            <li>• <span className="text-foreground">Gallery:</span> Upload and organize event photos</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;
