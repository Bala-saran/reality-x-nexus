import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Medal, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Leaderboard = () => {
  const navigate = useNavigate();

  const { data: leaderboard = [] } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('points', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-6 w-6 text-yellow-400" />;
    if (index === 1) return <Medal className="h-6 w-6 text-gray-400" />;
    if (index === 2) return <Medal className="h-6 w-6 text-amber-600" />;
    return <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>;
  };

  const getRankStyle = (index: number) => {
    if (index === 0) return "glow-border bg-gradient-to-r from-yellow-900/20 to-yellow-800/20";
    if (index === 1) return "glow-border bg-gradient-to-r from-gray-900/20 to-gray-800/20";
    if (index === 2) return "glow-border bg-gradient-to-r from-amber-900/20 to-amber-800/20";
    return "glass-effect";
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold glow-text">REALITY X CLUB</h1>
          <div className="flex items-center gap-3">
            <Button onClick={() => navigate('/')} variant="ghost" className="text-white hover:text-primary">
              <ArrowLeft className="mr-2 h-4 w-4" />
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

      <div className="relative z-10 container mx-auto px-4 py-8">

        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="h-10 w-10 text-[hsl(var(--primary-glow))] animate-float drop-shadow-[0_0_10px_hsl(var(--primary-glow))]" />
            <h1 className="text-5xl font-bold glow-text">Leaderboard</h1>
          </div>
          <p className="text-xl text-muted-foreground">Top performers of Reality X Club</p>
        </div>

        <Card className="glass-effect glow-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="w-20 text-center">Rank</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Register Number</TableHead>
                <TableHead className="text-right">Points</TableHead>
                <TableHead className="text-right">Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.length > 0 ? (
                leaderboard.map((entry, index) => (
                  <TableRow 
                    key={entry.id}
                    className={`border-border/50 ${getRankStyle(index)} animate-fade-in`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <TableCell className="text-center">
                      {getRankIcon(index)}
                    </TableCell>
                    <TableCell className="font-semibold">{entry.name}</TableCell>
                    <TableCell className="text-muted-foreground">{entry.register_number}</TableCell>
                    <TableCell className="text-right font-bold text-primary">{entry.points}</TableCell>
                    <TableCell className="text-right">
                      {entry.rating ? entry.rating.toFixed(2) : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    No entries yet. Be the first to join the leaderboard!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;
