import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Home, Calendar, Trophy, Image as ImageIcon, LogOut, Menu, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EventsManager from "@/components/admin/EventsManager";
import LeaderboardManager from "@/components/admin/LeaderboardManager";
import GalleryManager from "@/components/admin/GalleryManager";
import DashboardHome from "@/components/admin/DashboardHome";
import NotificationSender from "@/components/admin/NotificationSender";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />

      {/* Sidebar */}
      <aside 
        className={`relative z-10 ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 border-r border-border/50 glass-effect`}
      >
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <h2 className="text-xl font-bold glow-text">Admin Panel</h2>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hover:bg-primary/10"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? 'default' : 'ghost'}
                className={`w-full justify-start ${
                  activeTab === item.id ? 'glow-border neon-glow' : 'hover:bg-primary/10'
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon className={`h-5 w-5 ${sidebarOpen ? 'mr-2' : ''}`} />
                {sidebarOpen && item.label}
              </Button>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-0 right-0 px-4">
          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className={`h-5 w-5 ${sidebarOpen ? 'mr-2' : ''}`} />
            {sidebarOpen && 'Logout'}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative z-10 overflow-auto">
        <div className="container mx-auto p-8">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold glow-text mb-2">
              {menuItems.find(item => item.id === activeTab)?.label}
            </h1>
            <p className="text-muted-foreground">
              Manage your Reality X Club content
            </p>
          </div>

          <div className="animate-fade-in">
            {activeTab === 'home' && <DashboardHome />}
            {activeTab === 'events' && <EventsManager />}
            {activeTab === 'leaderboard' && <LeaderboardManager />}
            {activeTab === 'gallery' && <GalleryManager />}
            {activeTab === 'notifications' && <NotificationSender />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
