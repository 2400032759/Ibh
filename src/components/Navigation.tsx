import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, LogOut, User, Home, FileText, ShieldCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NavigationProps {
  username?: string;
  isAdmin?: boolean;
  showBackButton?: boolean;
  currentPage?: string;
}

export const Navigation = ({ username, isAdmin, showBackButton, currentPage }: NavigationProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
      });
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="glass-card p-4 mb-6 sticky top-4 z-50">
      <div className="flex items-center justify-between gap-4">
        {/* Logo and Title */}
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Button 
              onClick={() => navigate("/dashboard")} 
              variant="outline" 
              size="icon"
              className="glass border-white/20 hover:border-primary/50 transition-glass"
            >
              <Home className="h-4 w-4" />
            </Button>
          )}
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Insta Bill
            </h1>
          </div>
        </div>

        {/* Right Side - Navigation and Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {username && (
            <>
              {/* Quick Navigation Buttons - Hidden on mobile */}
              <div className="hidden md:flex items-center gap-2">
                {currentPage !== 'dashboard' && (
                  <Button
                    onClick={() => navigate("/dashboard")}
                    variant="ghost"
                    size="sm"
                    className="glass border-white/10 hover:border-primary/30 transition-glass"
                  >
                    <Home className="h-4 w-4 mr-1" />
                    Dashboard
                  </Button>
                )}
                {isAdmin && currentPage !== 'admin' && (
                  <Button
                    onClick={() => navigate("/admin")}
                    variant="ghost"
                    size="sm"
                    className="glass border-white/10 hover:border-primary/30 transition-glass"
                  >
                    <ShieldCheck className="h-4 w-4 mr-1" />
                    Admin
                  </Button>
                )}
                {currentPage !== 'invoice' && (
                  <Button
                    onClick={() => navigate("/invoice")}
                    variant="ghost"
                    size="sm"
                    className="glass border-white/10 hover:border-accent/30 transition-glass"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Invoice
                  </Button>
                )}
              </div>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="glass border-white/20 hover:border-primary/50 rounded-full transition-glass"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass border-white/20 w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-semibold">{username}</span>
                      <span className="text-xs text-muted-foreground">
                        {isAdmin ? 'Admin' : 'User'}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  
                  {/* Mobile Navigation Links */}
                  <div className="md:hidden">
                    {currentPage !== 'dashboard' && (
                      <DropdownMenuItem 
                        onClick={() => navigate("/dashboard")}
                        className="cursor-pointer hover:bg-white/10"
                      >
                        <Home className="mr-2 h-4 w-4" />
                        Dashboard
                      </DropdownMenuItem>
                    )}
                    {isAdmin && currentPage !== 'admin' && (
                      <DropdownMenuItem 
                        onClick={() => navigate("/admin")}
                        className="cursor-pointer hover:bg-white/10"
                      >
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Admin Panel
                      </DropdownMenuItem>
                    )}
                    {currentPage !== 'invoice' && (
                      <DropdownMenuItem 
                        onClick={() => navigate("/invoice")}
                        className="cursor-pointer hover:bg-white/10"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Create Invoice
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-white/10" />
                  </div>
                  
                  <DropdownMenuItem 
                    onClick={handleSignOut} 
                    className="cursor-pointer hover:bg-white/10 text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
