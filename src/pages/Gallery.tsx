import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Image as ImageIcon, ArrowLeft, Trophy, X } from "lucide-react";

const Gallery = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<any>(null);

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
            <ImageIcon className="h-10 w-10 text-[hsl(var(--primary-glow))] animate-float drop-shadow-[0_0_10px_hsl(var(--primary-glow))]" />
            <h1 className="text-5xl font-bold glow-text">Gallery</h1>
          </div>
          <p className="text-xl text-muted-foreground">Moments captured from Reality X Club</p>
        </div>

        {gallery.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {gallery.map((item, index) => (
              <Card 
                key={item.id}
                className="glass-effect glow-border overflow-hidden group animate-fade-in hover:neon-glow transition-all cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedImage(item)}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title || 'Gallery image'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/95 via-card/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white">
                    {item.title && (
                      <h3 className="font-bold text-base md:text-lg mb-1">{item.title}</h3>
                    )}
                    {item.description && (
                      <p className="text-xs md:text-sm text-white/90 mb-2 line-clamp-2">{item.description}</p>
                    )}
                    {item.event_date && (
                      <p className="text-xs text-white/80">
                        {new Date(item.event_date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    )}
                  </div>
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

      {/* Full Size Image Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden bg-black/95 border-border/50">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>
          {selectedImage && (
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <img
                src={selectedImage.image_url}
                alt={selectedImage.title || 'Gallery image'}
                className="max-w-full max-h-[90vh] object-contain"
              />
              {(selectedImage.title || selectedImage.description || selectedImage.event_date) && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 text-white">
                  {selectedImage.title && (
                    <h3 className="text-2xl font-bold mb-2">{selectedImage.title}</h3>
                  )}
                  {selectedImage.description && (
                    <p className="text-sm mb-2">{selectedImage.description}</p>
                  )}
                  {selectedImage.event_date && (
                    <p className="text-xs text-white/80">
                      {new Date(selectedImage.event_date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Gallery;
