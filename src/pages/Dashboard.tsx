import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, ShieldCheck, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
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

      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (error) throw error;

      const hasAdminRole = roles?.some((r) => r.role === "admin");
      setIsAdmin(hasAdminRole);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-background">
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Invoice Generator
          </h1>
          <Button onClick={handleSignOut} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {isAdmin && (
            <Button
              onClick={() => navigate("/admin")}
              className="h-48 bg-gradient-primary hover:opacity-90 text-white text-xl font-semibold shadow-elegant"
            >
              <div className="flex flex-col items-center gap-4">
                <ShieldCheck className="h-16 w-16" />
                <span>Admin Panel</span>
              </div>
            </Button>
          )}
          
          <Button
            onClick={() => navigate("/invoice")}
            className="h-48 bg-gradient-accent hover:opacity-90 text-white text-xl font-semibold shadow-elegant"
          >
            <div className="flex flex-col items-center gap-4">
              <FileText className="h-16 w-16" />
              <span>Create Invoice</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
