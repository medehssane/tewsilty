
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

type AuthGuardProps = {
  children: React.ReactNode;
  userType?: "customer" | "driver";
};

const AuthGuard = ({ children, userType }: AuthGuardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      toast({
        title: "يجب تسجيل الدخول",
        description: "الرجاء تسجيل الدخول للوصول إلى هذه الصفحة",
        variant: "destructive",
      });
      navigate(userType ? `/${userType}/login` : "/");
    }
  }, [user, navigate, userType, toast]);

  if (!user) return null;

  return <>{children}</>;
};

export default AuthGuard;
