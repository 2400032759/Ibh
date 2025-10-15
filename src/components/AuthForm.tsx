import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Lock, Sparkles, ShieldCheck } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Use secure function to lookup email by username
        const { data: emailData, error: lookupError } = await supabase
          .rpc("get_email_by_username", { _username: username });

        if (lookupError) {
          console.error("Username lookup error:", lookupError);
          throw new Error("Database error. Please try again.");
        }

        if (!emailData) {
          throw new Error("Username not found. Please check your username or sign up.");
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailData,
          password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            throw new Error("Incorrect password. Please try again.");
          }
          throw error;
        }

        // Check user role and redirect accordingly
        const { data: userRoles, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id)
          .maybeSingle();

        if (roleError) {
          console.error("Role fetch error:", roleError);
          throw new Error("Database error. Please try again.");
        }

        if (!userRoles) {
          throw new Error("No role assigned. Please contact support or sign up again.");
        }

        toast({
          title: "Welcome back!",
          description: `Signed in as ${username}`,
        });
        
        // Redirect based on role
        if (userRoles?.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/invoice");
        }
      } else {
        // For signup, create a temporary email from username
        const tempEmail = `${username.toLowerCase().replace(/[^a-z0-9]/g, '')}@invoicehub.app`;
        
        // Check if username already exists
        const { data: existingProfile, error: checkError } = await supabase
          .from("profiles")
          .select("username")
          .eq("username", username)
          .maybeSingle();

        if (checkError) {
          console.error("Username check error:", checkError);
          throw new Error("Database error. Please try again.");
        }

        if (existingProfile) {
          throw new Error("Username already taken. Please choose a different username or try logging in.");
        }

        const { data, error } = await supabase.auth.signUp({
          email: tempEmail,
          password,
          options: {
            data: {
              username: username,
            },
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });

        if (error) throw error;

        // Create user role entry
        if (data.user) {
          const { error: roleError } = await supabase
            .from("user_roles")
            .insert({
              user_id: data.user.id,
              role: role,
            });

          if (roleError) {
            console.error("Error creating role:", roleError);
            throw new Error(`Failed to assign ${role} role. Please try again.`);
          }
        }

        toast({
          title: "Account created!",
          description: `You can now sign in as ${role}. Username: ${username}`,
        });
        
        setIsLogin(true);
        setPassword("");
      }
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-mesh animate-float" />
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }} />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      
      {/* Glass card */}
      <div className="glass-card w-full max-w-md p-8 relative z-10 animate-glow">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-4 animate-float">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Insta Bill
          </h1>
          <p className="text-muted-foreground">
            {isLogin ? "Welcome back" : "Create your account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              className="glass border-white/20 focus:border-primary/50 transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
              className="glass border-white/20 focus:border-primary/50 transition-all"
            />
          </div>

          {!isLogin && (
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Select Role
              </Label>
              <RadioGroup
                value={role}
                onValueChange={(value) => setRole(value as "admin" | "user")}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2 glass px-4 py-3 rounded-lg border border-white/20 flex-1 cursor-pointer hover:border-primary/50 transition-all">
                  <RadioGroupItem value="admin" id="admin" />
                  <Label htmlFor="admin" className="cursor-pointer flex-1">
                    <div className="font-semibold">Admin</div>
                    <div className="text-xs text-muted-foreground">Full access</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 glass px-4 py-3 rounded-lg border border-white/20 flex-1 cursor-pointer hover:border-accent/50 transition-all">
                  <RadioGroupItem value="user" id="user" />
                  <Label htmlFor="user" className="cursor-pointer flex-1">
                    <div className="font-semibold">User</div>
                    <div className="text-xs text-muted-foreground">Create invoices</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-primary hover:opacity-90 text-white font-semibold h-12 shadow-glass transition-all hover:scale-[1.02]"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {isLogin ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
            disabled={loading}
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};
