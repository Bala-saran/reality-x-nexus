import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Image as ImageIcon, ArrowLeft } from "lucide-react";

const Gallery = () => {
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="mb-6 glass-effect glow-border"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ImageIcon className="h-10 w-10 text-[hsl(var(--primary-glow))] animate-float drop-shadow-[0_0_10px_hsl(var(--primary-glow))]" />
            <h1 className="text-5xl font-bold glow-text">Gallery</h1>
          </div>
          <p className="text-xl text-muted-foreground">Moments captured from Reality X Club</p>
        </div>

        {gallery.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((item, index) => (
              <Card 
                key={item.id}
                className="glass-effect glow-border overflow-hidden group animate-fade-in hover:neon-glow transition-all"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title || 'Gallery image'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {item.title && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.title}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground text-lg">No images in gallery yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
