import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface AuthFormProps {
  onAuthSuccess: () => void;
}

export const AuthForm = ({ onAuthSuccess }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const validateForm = () => {
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }
    if (!password || password.length < 6) {
      toast({
        title: "Invalid password",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const createProfile = async (userId: string, userEmail: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error("No session available");
      return;
    }

    try {
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: userId,
          email: userEmail,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (profileError) {
        console.error("Error creating profile:", profileError);
        throw profileError;
      }
    } catch (error) {
      console.error("Profile creation failed:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data?.user) {
          // Create/update profile after successful login
          await createProfile(data.user.id, data.user.email || '');
          
          toast({
            title: "Welcome back!",
            description: "You have successfully logged in.",
          });
          onAuthSuccess();
        }
      } else {
        // Sign up flow
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (data?.user) {
          // After successful registration, automatically log in the user
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (signInError) throw signInError;

          // Create profile after successful login
          await createProfile(data.user.id, data.user.email || '');
          
          toast({
            title: "Account created successfully!",
            description: "You have been automatically logged in.",
          });
          
          onAuthSuccess();
        }
      }
    } catch (error: any) {
      if (error.message === "User already registered") {
        toast({
          title: "Account exists",
          description: "Please try logging in instead",
          variant: "destructive",
        });
        setIsLogin(true);
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-6 space-y-6 animate-fadeIn">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {isLogin ? "Welcome Back" : "Create Parent Account"}
        </h1>
        <p className="text-muted-foreground">
          {isLogin
            ? "Enter your credentials to access your account"
            : "Sign up to start tracking your child's nutrition"}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full"
            minLength={6}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Loading..." : isLogin ? "Sign In" : "Create Account"}
        </Button>
      </form>
      <div className="text-center">
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm text-primary hover:underline"
        >
          {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </Card>
  );
};