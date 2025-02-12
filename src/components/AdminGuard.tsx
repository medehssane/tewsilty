
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

type AdminGuardProps = {
  children: React.ReactNode;
};

const AdminGuard = ({ children }: AdminGuardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      toast({
        title: "غير مصرح",
        description: "يجب تسجيل الدخول للوصول إلى هذه الصفحة",
        variant: "destructive",
      });
      navigate("/admin/login");
      return;
    }

    // التحقق من أن المستخدم مشرف
    if (user.user_metadata.user_type !== 'admin') {
      toast({
        title: "غير مصرح",
        description: "هذه الصفحة مخصصة للمشرفين فقط",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [user, navigate, toast]);

  if (!user || user.user_metadata.user_type !== 'admin') return null;

  return <>{children}</>;
};

export default AdminGuard;
