import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface LoginFormProps {
  onSuccess: () => void;
  switchToSignup: () => void;
}

export const LoginForm = ({ onSuccess, switchToSignup }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data?.user) {
        if (!data.user.email_confirmed_at) {
          const { error: resendError } = await supabase.auth.resend({
            type: 'signup',
            email,
          });

          if (resendError) {
            console.error('Error resending verification email:', resendError);
            toast({
              title: "Error resending verification email",
              description: resendError.message,
              variant: "destructive",
            });
          } else {
            toast({
              title: "Email not verified",
              description: "We've sent a new verification email. Please check your inbox and spam folder.",
              variant: "destructive",
            });
          }
          setLoading(false);
          return;
        }

        // Set session in localStorage to persist it
        localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
        
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        onSuccess();
      }
    } catch (error: any) {
      console.error('Login error:', error);
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
    <div className="space-y-4">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
        <p className="text-muted-foreground">
          Enter your credentials to access your account
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
          {loading ? "Loading..." : "Sign In"}
        </Button>
      </form>
      <div className="text-center">
        <button
          type="button"
          onClick={switchToSignup}
          className="text-sm text-primary hover:underline"
        >
          Need an account? Sign up
        </button>
      </div>
    </div>
  );
};