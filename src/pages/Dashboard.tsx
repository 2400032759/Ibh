import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ShieldCheck, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";
import { Icon3D } from "@/components/Icon3D";

const Dashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      // Get username from profiles
      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

      if (profile) {
        setUsername(profile.username);
      }

      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Role fetch error:", error);
        throw new Error("Could not verify user role");
      }

      const hasAdminRole = roles?.role === "admin";
      setIsAdmin(hasAdminRole);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 sm:p-8">
        {/* Navigation */}
        <Navigation username={username} isAdmin={isAdmin} currentPage="dashboard" />

        {/* Welcome Message */}
        <div className="glass-card p-8 mb-8 text-center animate-fade-in">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, {username}!</h2>
          <p className="text-muted-foreground">Choose an action below to get started</p>
        </div>

        {/* Action Cards */}
        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {isAdmin && (
            <button
              onClick={() => navigate("/admin")}
              className="glass-card p-8 card-3d hover-lift cursor-pointer group animate-fade-up stagger-1"
            >
              <div className="flex flex-col items-center gap-6 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-bounce transform-3d">
                  <Icon3D icon={ShieldCheck} size={40} color="white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Admin Panel</h2>
                  <p className="text-muted-foreground">Manage business, products & sales</p>
                </div>
              </div>
            </button>
          )}
          
          <button
            onClick={() => navigate("/invoice")}
            className="glass-card p-8 card-3d hover-lift cursor-pointer group animate-fade-up stagger-2"
          >
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-accent flex items-center justify-center group-hover:scale-110 transition-bounce transform-3d">
                <Icon3D icon={FileText} size={40} color="white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Create Invoice</h2>
                <p className="text-muted-foreground">Generate professional invoices</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
