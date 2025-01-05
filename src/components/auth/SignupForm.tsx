import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface SignupFormProps {
  onSuccess: (email: string) => void;
  switchToLogin: () => void;
}

export const SignupForm = ({ onSuccess, switchToLogin }: SignupFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Attempting to sign up with email:', email);
      const siteUrl = window.location.origin;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${siteUrl}/auth/callback`,
          data: {
            email: email,
          }
        }
      });

      console.log('Signup response:', { data, error });

      if (error) throw error;

      if (data?.user) {
        console.log('User created:', data.user);
        onSuccess(email);
        toast({
          title: "Verification email sent",
          description: "Please check your email (including spam folder) to verify your account. The link will expire in 1 hour.",
        });
      } else {
        console.error('No user data returned from signup');
        toast({
          title: "Error",
          description: "Failed to create account. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.message === "User already registered") {
        toast({
          title: "Account exists",
          description: "Please try logging in instead",
          variant: "destructive",
        });
        switchToLogin();
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
    <div className="space-y-4">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
        <p className="text-muted-foreground">
          Sign up to start tracking your child's nutrition
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
          {loading ? "Loading..." : "Create Account"}
        </Button>
      </form>
      <div className="text-center">
        <button
          type="button"
          onClick={switchToLogin}
          className="text-sm text-primary hover:underline"
        >
          Already have an account? Sign in
        </button>
      </div>
    </div>
  );
};