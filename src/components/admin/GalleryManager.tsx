import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GalleryManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
  });

  const { data: gallery = [] } = useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: { image_url: string; title: string; description: string; event_date: string }) => {
      const { error } = await supabase.from('gallery').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      toast({ title: "Success", description: "Image added successfully" });
      setFormData({ title: '', description: '', event_date: '' });
      setImageFile(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id, imageUrl }: { id: string; imageUrl: string }) => {
      // Delete image from storage
      const imagePath = imageUrl.split('/').pop();
      if (imagePath) {
        await supabase.storage.from('gallery-images').remove([imagePath]);
      }
      // Delete record from database
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      toast({ title: "Success", description: "Image deleted successfully" });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageFile) {
      toast({ title: "Error", description: "Please select an image", variant: "destructive" });
      return;
    }

    setUploading(true);

    try {
      // Upload image to storage
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError, data } = await supabase.storage
        .from('gallery-images')
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('gallery-images')
        .getPublicUrl(fileName);

      // Create gallery entry
      await createMutation.mutateAsync({
        ...formData,
        image_url: publicUrl,
      });

    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass-effect glow-border">
        <CardHeader>
          <CardTitle>Add New Image</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image">Image File</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  required
                  className="glass-effect glow-border"
                />
                {imageFile && <Upload className="h-4 w-4 text-primary" />}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter image title"
                required
                className="glass-effect glow-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What happened at this event..."
                className="glass-effect glow-border min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Event Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.event_date}
                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                className="glass-effect glow-border"
              />
            </div>
            <Button 
              type="submit" 
              className="glow-border hover:neon-glow"
              disabled={uploading || createMutation.isPending}
            >
              <Plus className="mr-2 h-4 w-4" />
              {uploading || createMutation.isPending ? 'Uploading...' : 'Add Image'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gallery.map((item) => (
          <Card key={item.id} className="glass-effect glow-border overflow-hidden group">
            <div className="relative aspect-video">
              <img
                src={item.image_url}
                alt={item.title || 'Gallery image'}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteMutation.mutate({ id: item.id, imageUrl: item.image_url })}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
            <CardHeader className="py-3 space-y-1">
              <CardTitle className="text-sm">{item.title}</CardTitle>
              {item.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
              )}
              {item.event_date && (
                <p className="text-xs text-muted-foreground">
                  {new Date(item.event_date).toLocaleDateString()}
                </p>
              )}
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GalleryManager;
