import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Package, TrendingUp, Loader2 } from "lucide-react";
import { BusinessSettings } from "@/components/admin/BusinessSettings";
import { ProductManagement } from "@/components/admin/ProductManagement";
import { SalesDashboard } from "@/components/admin/SalesDashboard";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      // Get username
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
        throw new Error("Could not verify admin access");
      }

      const hasAdminRole = roles?.role === "admin";
      
      if (!hasAdminRole) {
        toast({
          title: "Access Denied",
          description: "You don't have admin permissions.",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      setIsAdmin(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !isAdmin) {
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
        <Navigation username={username} isAdmin={isAdmin} showBackButton currentPage="admin" />

        {/* Page Title */}
        <div className="glass-card p-6 mb-8 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Admin Panel
          </h2>
          <p className="text-muted-foreground mt-1">Manage your business settings, products, and sales</p>
        </div>

        <Tabs defaultValue="business" className="space-y-6">
          <TabsList className="glass grid w-full max-w-md grid-cols-3 p-1 animate-slide-in-left">
            <TabsTrigger value="business" className="data-[state=active]:bg-primary data-[state=active]:text-white transition-smooth">
              <Building2 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Business</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-primary data-[state=active]:text-white transition-smooth">
              <Package className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Products</span>
            </TabsTrigger>
            <TabsTrigger value="sales" className="data-[state=active]:bg-primary data-[state=active]:text-white transition-smooth">
              <TrendingUp className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Sales</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="business" className="animate-fade-up">
            <BusinessSettings />
          </TabsContent>

          <TabsContent value="products" className="animate-fade-up">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="sales" className="animate-fade-up">
            <SalesDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
