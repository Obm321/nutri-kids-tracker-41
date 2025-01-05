import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface AuthFormProps {
  onAuthSuccess: () => void;
}

export const AuthForm = ({ onAuthSuccess }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { toast } = useToast();

  // Handle URL error parameters on component mount
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const error = hashParams.get('error');
    const errorDescription = hashParams.get('error_description');

    if (error === 'access_denied' && errorDescription?.includes('expired')) {
      toast({
        title: "Link Expired",
        description: "Your verification link has expired. Please request a new one.",
        variant: "destructive",
      });
      // Clear the URL hash
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [toast]);

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
    try {
      const { data: profile, error: upsertError } = await supabase
        .from("profiles")
        .upsert([
          {
            id: userId,
            email: userEmail,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ])
        .select()
        .single();

      if (upsertError) {
        console.error("Error creating/updating profile:", upsertError);
        throw upsertError;
      }

      console.log("Profile created/updated successfully:", profile);
      return profile;
    } catch (error) {
      console.error("Profile operation failed:", error);
      throw error;
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

          await createProfile(data.user.id, data.user.email || '');
          toast({
            title: "Welcome back!",
            description: "You have successfully logged in.",
          });
          onAuthSuccess();
        }
      } else {
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
          setShowConfirmation(true);
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
      }
    } catch (error: any) {
      console.error('Auth error:', error);
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

  if (showConfirmation) {
    return (
      <Card className="w-full max-w-md p-6 space-y-6 animate-fadeIn">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Check Your Email</h1>
          <p className="text-muted-foreground">
            We've sent you a verification link to {email}. Please check your email (including spam folder) to verify your account.
            The link will expire in 1 hour.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Didn't receive the email? Check your spam folder or{' '}
            <button
              onClick={async () => {
                try {
                  const { error } = await supabase.auth.resend({
                    type: 'signup',
                    email,
                  });
                  if (error) throw error;
                  toast({
                    title: "Email resent",
                    description: "Please check your inbox and spam folder. The link will expire in 1 hour.",
                  });
                } catch (error: any) {
                  toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                  });
                }
              }}
              className="text-primary hover:underline"
            >
              click here to resend
            </button>
          </p>
          <Button
            onClick={() => {
              setShowConfirmation(false);
              setIsLogin(true);
              setEmail("");
              setPassword("");
            }}
            className="mt-4"
          >
            Back to Login
          </Button>
        </div>
      </Card>
    );
  }

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
          onClick={() => {
            setIsLogin(!isLogin);
            setEmail("");
            setPassword("");
          }}
          className="text-sm text-primary hover:underline"
        >
          {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </Card>
  );
};