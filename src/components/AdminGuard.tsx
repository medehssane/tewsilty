
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

type AdminGuardProps = {
  children: React.ReactNode;
};

const AdminGuard = ({ children }: AdminGuardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        toast({
          title: "غير مصرح",
          description: "يجب تسجيل الدخول للوصول إلى هذه الصفحة",
          variant: "destructive",
        });
        navigate("/admin/login");
        return;
      }

      // التحقق من أن المستخدم مشرف باستخدام الدالة is_admin
      const { data: isAdmin, error } = await supabase.rpc('is_admin', {
        user_id: user.id
      });

      if (error || !isAdmin) {
        toast({
          title: "غير مصرح",
          description: "هذه الصفحة مخصصة للمشرفين فقط",
          variant: "destructive",
        });
        navigate("/");
      }
    };

    checkAdminStatus();
  }, [user, navigate, toast]);

  return <>{children}</>;
};

export default AdminGuard;
