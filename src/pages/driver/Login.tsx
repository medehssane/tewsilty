
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const DriverLogin = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-blue-900">مرحباً في توصيلتي</h1>
          <h2 className="text-2xl font-semibold text-gray-700">تسجيل دخول السائق</h2>
          <p className="mt-2 text-gray-600">أدخل رقم هاتفك وكلمة المرور</p>
        </div>
        
        <form className="mt-8 space-y-6">
          <div className="space-y-4">
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
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            تسجيل الدخول
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          ليس لديك حساب؟{" "}
          <Link to="/driver/register" className="text-blue-600 hover:text-blue-700 font-medium">
            إنشاء حساب جديد
          </Link>
        </p>
      </div>
    </div>
  );
};

export default DriverLogin;
