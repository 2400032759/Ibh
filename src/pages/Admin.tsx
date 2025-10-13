import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Building2, Package, TrendingUp } from "lucide-react";
import { BusinessSettings } from "@/components/admin/BusinessSettings";
import { ProductManagement } from "@/components/admin/ProductManagement";
import { SalesDashboard } from "@/components/admin/SalesDashboard";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
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
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-mesh" />
      
      {/* Floating orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      
      <div className="container mx-auto p-4 sm:p-8 relative z-10">
        <div className="glass-card p-6 mb-8 flex items-center gap-4">
          <Button 
            onClick={() => navigate("/dashboard")} 
            variant="outline" 
            size="icon"
            className="glass border-white/20 hover:border-primary/50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Admin Panel
          </h1>
        </div>

        <Tabs defaultValue="business" className="space-y-6">
          <TabsList className="glass grid w-full max-w-md grid-cols-3 p-1">
            <TabsTrigger value="business" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Building2 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Business</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Package className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Products</span>
            </TabsTrigger>
            <TabsTrigger value="sales" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <TrendingUp className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Sales</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="business">
            <BusinessSettings />
          </TabsContent>

          <TabsContent value="products">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="sales">
            <SalesDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
