
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CustomerDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">إرسال طلب جديد</h1>
          
          <form className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  موقع الاستلام
                </label>
                <Input
                  type="text"
                  required
                  className="mt-1"
                  placeholder="أدخل عنوان الاستلام"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  موقع التسليم
                </label>
                <Input
                  type="text"
                  required
                  className="mt-1"
                  placeholder="أدخل عنوان التسليم"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  تفاصيل الطلب
                </label>
                <textarea
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  rows={4}
                  placeholder="اكتب تفاصيل وملاحظات الطلب"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  رقم هاتف المستلم
                </label>
                <Input
                  type="tel"
                  required
                  className="mt-1"
                  placeholder="أدخل رقم هاتف المستلم"
                  dir="rtl"
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              إرسال الطلب
            </Button>
          </form>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">طلباتي السابقة</h2>
          <div className="space-y-4">
            <p className="text-gray-600">لا توجد طلبات سابقة</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
