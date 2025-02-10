
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const CustomerRegister = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">تسجيل حساب جديد</h2>
          <p className="mt-2 text-gray-600">أدخل بياناتك لإنشاء حساب عميل جديد</p>
        </div>
        
        <form className="mt-8 space-y-6">
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
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            إنشاء حساب
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
