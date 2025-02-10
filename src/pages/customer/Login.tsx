
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const CustomerLogin = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">تسجيل دخول العميل</h2>
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

          <Button type="submit" className="w-full">
            تسجيل الدخول
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
