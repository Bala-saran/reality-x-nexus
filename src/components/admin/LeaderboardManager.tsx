import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LeaderboardManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    register_number: '',
    points: 0,
    rating: '',
  });

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

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from('leaderboard').insert([{
        ...data,
        rating: data.rating ? parseFloat(data.rating) : null,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      toast({ title: "Success", description: "Entry added successfully" });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase.from('leaderboard').update({
        ...data,
        rating: data.rating ? parseFloat(data.rating) : null,
      }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      toast({ title: "Success", description: "Entry updated successfully" });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('leaderboard').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      toast({ title: "Success", description: "Entry deleted successfully" });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      register_number: '',
      points: 0,
      rating: '',
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (entry: any) => {
    setFormData({
      name: entry.name,
      register_number: entry.register_number,
      points: entry.points,
      rating: entry.rating?.toString() || '',
    });
    setEditingId(entry.id);
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass-effect glow-border">
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Entry' : 'Add New Entry'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="glass-effect glow-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register">Register Number</Label>
                <Input
                  id="register"
                  value={formData.register_number}
                  onChange={(e) => setFormData({ ...formData, register_number: e.target.value })}
                  required
                  className="glass-effect glow-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="points">Points</Label>
                <Input
                  id="points"
                  type="number"
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                  required
                  className="glass-effect glow-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating">Rating (Optional)</Label>
                <Input
                  id="rating"
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  placeholder="0.00"
                  className="glass-effect glow-border"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="glow-border hover:neon-glow">
                <Plus className="mr-2 h-4 w-4" />
                {isEditing ? 'Update Entry' : 'Add Entry'}
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="glass-effect glow-border">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="w-12">Rank</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Register Number</TableHead>
              <TableHead className="text-right">Points</TableHead>
              <TableHead className="text-right">Rating</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard.map((entry, index) => (
              <TableRow key={entry.id} className="border-border/50">
                <TableCell className="font-bold">#{index + 1}</TableCell>
                <TableCell className="font-semibold">{entry.name}</TableCell>
                <TableCell className="text-muted-foreground">{entry.register_number}</TableCell>
                <TableCell className="text-right font-bold text-primary">{entry.points}</TableCell>
                <TableCell className="text-right">
                  {entry.rating ? entry.rating.toFixed(2) : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(entry)}
                      className="glass-effect"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMutation.mutate(entry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default LeaderboardManager;
