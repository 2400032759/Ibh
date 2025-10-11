import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, TrendingUp, Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-accent/10 to-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Invoice Generator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Modern, secure, and instant invoice generation for your business
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <div className="p-6 bg-card rounded-lg shadow-soft border border-border/50 animate-fade-in hover:shadow-elegant transition-all">
            <FileText className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Professional Invoices</h3>
            <p className="text-muted-foreground">
              Generate beautiful, professional invoices with your business branding
            </p>
          </div>

          <div className="p-6 bg-card rounded-lg shadow-soft border border-border/50 animate-fade-in hover:shadow-elegant transition-all">
            <TrendingUp className="h-12 w-12 text-accent mb-4" />
            <h3 className="text-xl font-semibold mb-2">Sales Analytics</h3>
            <p className="text-muted-foreground">
              Track your sales and revenue with comprehensive dashboards
            </p>
          </div>

          <div className="p-6 bg-card rounded-lg shadow-soft border border-border/50 animate-fade-in hover:shadow-elegant transition-all">
            <Shield className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure Access</h3>
            <p className="text-muted-foreground">
              Role-based access control with admin and user permissions
            </p>
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={() => navigate("/auth")}
            size="lg"
            className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-6 shadow-elegant"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
