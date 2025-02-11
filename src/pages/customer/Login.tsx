
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const CustomerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في توصيلتي",
      });

      navigate("/customer/dashboard");
    } catch (error: any) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">تسجيل دخول العميل</h2>
          <p className="mt-2 text-gray-600">أدخل بريدك الإلكتروني وكلمة المرور</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                البريد الإلكتروني
              </label>
              <Input
                type="email"
                required
                className="mt-1"
                placeholder="أدخل بريدك الإلكتروني"
                dir="rtl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                كلمة المرور
              </label>
              <Input
                type="password"
                required
                className="mt-1"
                placeholder="أدخل كلمة المرور"
                dir="rtl"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          ليس لديك حساب؟{" "}
          <Link to="/customer/register" className="text-blue-600 hover:text-blue-500">
            إنشاء حساب جديد
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CustomerLogin;
