import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, TrendingUp, Shield, Sparkles, Zap, Lock } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-mesh" />
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      
      <div className="container mx-auto px-4 py-12 sm:py-20 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16 sm:mb-20 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-primary mb-6 animate-float">
            <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Insta Bill
          </h1>
          <p className="text-lg sm:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Modern, secure, and instant invoice generation with stunning design
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
          <div className="glass-card p-8 hover:scale-[1.02] transition-all group">
            <div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Professional Invoices</h3>
            <p className="text-muted-foreground">
              Generate beautiful, professional invoices with your business branding
            </p>
          </div>

          <div className="glass-card p-8 hover:scale-[1.02] transition-all group">
            <div className="w-14 h-14 rounded-full bg-gradient-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Sales Analytics</h3>
            <p className="text-muted-foreground">
              Track your sales and revenue with comprehensive dashboards
            </p>
          </div>

          <div className="glass-card p-8 hover:scale-[1.02] transition-all group">
            <div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Secure Access</h3>
            <p className="text-muted-foreground">
              Role-based access control with admin and user permissions
            </p>
          </div>

          <div className="glass-card p-8 hover:scale-[1.02] transition-all group">
            <div className="w-14 h-14 rounded-full bg-gradient-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Zap className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
            <p className="text-muted-foreground">
              Generate and download invoices in seconds with instant calculations
            </p>
          </div>

          <div className="glass-card p-8 hover:scale-[1.02] transition-all group">
            <div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Lock className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Data Privacy</h3>
            <p className="text-muted-foreground">
              Your business data is encrypted and secure with industry standards
            </p>
          </div>

          <div className="glass-card p-8 hover:scale-[1.02] transition-all group">
            <div className="w-14 h-14 rounded-full bg-gradient-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Modern Design</h3>
            <p className="text-muted-foreground">
              Beautiful glassmorphism UI that works perfectly on all devices
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            onClick={() => navigate("/auth")}
            size="lg"
            className="bg-gradient-primary hover:opacity-90 text-white text-lg px-12 py-7 shadow-glass transition-all hover:scale-105 font-semibold"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Get Started Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
