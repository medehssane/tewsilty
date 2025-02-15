
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. التحقق من أن هناك مشرف في النظام
      const { data: adminExists, error: adminCheckError } = await supabase.rpc('check_admin_exists');
      
      if (adminCheckError) throw adminCheckError;
      
      if (!adminExists) {
        throw new Error("لم يتم العثور على أي حساب مشرف في النظام");
      }

      // 2. محاولة تسجيل الدخول
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (signInError.message === "Invalid login credentials") {
          throw new Error("بيانات الدخول غير صحيحة");
        }
        throw signInError;
      }
      
      if (!user) throw new Error("لم يتم العثور على المستخدم");

      // 3. التحقق من أن المستخدم هو مشرف
      const { data: isAdmin, error: adminRoleError } = await supabase.rpc('is_admin', {
        user_id: user.id
      });

      if (adminRoleError) throw adminRoleError;

      if (!isAdmin) {
        // إذا لم يكن مشرفاً، قم بتسجيل الخروج وإظهار رسالة خطأ
        await supabase.auth.signOut();
        throw new Error("غير مصرح لك بالدخول كمشرف");
      }

      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في لوحة التحكم",
      });

      navigate("/admin/dashboard");
    } catch (error: any) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error.message,
        variant: "destructive",
      });
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            تسجيل دخول المشرف
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                البريد الإلكتروني
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                كلمة المرور
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
