import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";

interface AuthFormProps {
  onAuthSuccess: () => void;
}

export const AuthForm = ({ onAuthSuccess }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState("");
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

  const handleSignupSuccess = (email: string) => {
    setConfirmationEmail(email);
    setShowConfirmation(true);
  };

  if (showConfirmation) {
    return (
      <Card className="w-full max-w-md p-6 space-y-6 animate-fadeIn">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Check Your Email</h1>
          <p className="text-muted-foreground">
            We've sent you a verification link to {confirmationEmail}. Please check your email (including spam folder) to verify your account.
            The link will expire in 1 hour.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Didn't receive the email? Check your spam folder or{' '}
            <button
              onClick={async () => {
                try {
                  const { error } = await supabase.auth.resend({
                    type: 'signup',
                    email: confirmationEmail,
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
    <Card className="w-full max-w-md p-6 animate-fadeIn">
      {isLogin ? (
        <LoginForm
          onSuccess={onAuthSuccess}
          switchToSignup={() => setIsLogin(false)}
        />
      ) : (
        <SignupForm
          onSuccess={handleSignupSuccess}
          switchToLogin={() => setIsLogin(true)}
        />
      )}
    </Card>
  );
};