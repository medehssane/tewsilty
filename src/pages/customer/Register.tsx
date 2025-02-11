
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const CustomerRegister = () => {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast({
        title: "خطأ في كلمة المرور",
        description: "كلمة المرور وتأكيدها غير متطابقين",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        phone: phoneNumber,
        password,
        options: {
          data: {
            full_name: fullName,
            phone_number: phoneNumber,
            user_type: "customer",
          },
        },
      });

      if (error) throw error;

      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "مرحباً بك في توصيلتي",
      });

      navigate("/customer/dashboard");
    } catch (error: any) {
      toast({
        title: "خطأ في إنشاء الحساب",
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
          <h2 className="text-3xl font-bold text-gray-900">تسجيل حساب جديد</h2>
          <p className="mt-2 text-gray-600">أدخل بياناتك لإنشاء حساب عميل جديد</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                الاسم الكامل
              </label>
              <Input
                type="text"
                required
                className="mt-1"
                placeholder="أدخل اسمك الكامل"
                dir="rtl"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                رقم الهاتف
              </label>
              <Input
                type="tel"
                required
                className="mt-1"
                placeholder="أدخل رقم هاتفك"
                dir="rtl"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
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

            <div>
              <label className="block text-sm font-medium text-gray-700">
                تأكيد كلمة المرور
              </label>
              <Input
                type="password"
                required
                className="mt-1"
                placeholder="أعد إدخال كلمة المرور"
                dir="rtl"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          لديك حساب بالفعل؟{" "}
          <Link to="/customer/login" className="text-blue-600 hover:text-blue-500">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CustomerRegister;
