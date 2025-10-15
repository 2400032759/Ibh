import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, TrendingUp, Shield, Sparkles, Zap, Lock } from "lucide-react";
import { Icon3D } from "@/components/Icon3D";

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
      
      <div className="container mx-auto px-4 py-4 sm:py-6 relative z-10">
        {/* Header Navigation */}
        <nav className="glass-card p-4 mb-8 sm:mb-12 sticky top-4 z-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                Insta Bill
              </h1>
            </div>
            <Button
              onClick={() => navigate("/auth")}
              variant="outline"
              className="glass border-white/20 hover:border-primary/50 transition-glass"
            >
              Sign In
            </Button>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-16 sm:mb-20 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-primary mb-6 animate-float-3d transform-3d">
            <Icon3D icon={Sparkles} size={48} color="white" />
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold mb-6 text-foreground animate-scale-in">
            Insta Bill
          </h1>
          <p className="text-lg sm:text-2xl text-muted-foreground max-w-3xl mx-auto animate-fade-up">
            Modern, secure, and instant invoice generation with stunning design
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
          <div className="glass-card p-8 card-3d hover-lift group animate-fade-up stagger-1">
            <div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-bounce transform-3d">
              <Icon3D icon={FileText} size={28} color="white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Professional Invoices</h3>
            <p className="text-muted-foreground">
              Generate beautiful, professional invoices with your business branding
            </p>
          </div>

          <div className="glass-card p-8 card-3d hover-lift group animate-fade-up stagger-2">
            <div className="w-14 h-14 rounded-full bg-gradient-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-bounce transform-3d">
              <Icon3D icon={TrendingUp} size={28} color="white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Sales Analytics</h3>
            <p className="text-muted-foreground">
              Track your sales and revenue with comprehensive dashboards
            </p>
          </div>

          <div className="glass-card p-8 card-3d hover-lift group animate-fade-up stagger-3">
            <div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-bounce transform-3d">
              <Icon3D icon={Shield} size={28} color="white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Secure Access</h3>
            <p className="text-muted-foreground">
              Role-based access control with admin and user permissions
            </p>
          </div>

          <div className="glass-card p-8 card-3d hover-lift group animate-fade-up stagger-4">
            <div className="w-14 h-14 rounded-full bg-gradient-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-bounce transform-3d">
              <Icon3D icon={Zap} size={28} color="white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
            <p className="text-muted-foreground">
              Generate and download invoices in seconds with instant calculations
            </p>
          </div>

          <div className="glass-card p-8 card-3d hover-lift group animate-fade-up stagger-5">
            <div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-bounce transform-3d">
              <Icon3D icon={Lock} size={28} color="white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Data Privacy</h3>
            <p className="text-muted-foreground">
              Your business data is encrypted and secure with industry standards
            </p>
          </div>

          <div className="glass-card p-8 card-3d hover-lift group animate-fade-up stagger-6">
            <div className="w-14 h-14 rounded-full bg-gradient-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-bounce transform-3d">
              <Icon3D icon={Sparkles} size={28} color="white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Modern Design</h3>
            <p className="text-muted-foreground">
              Beautiful glassmorphism UI that works perfectly on all devices
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center animate-bounce-in">
          <Button
            onClick={() => navigate("/auth")}
            size="lg"
            className="btn-interactive bg-gradient-primary hover:opacity-90 text-white text-lg px-12 py-7 shadow-glass font-semibold"
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
