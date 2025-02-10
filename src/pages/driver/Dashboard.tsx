
import { Button } from "@/components/ui/button";

const DriverDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">الطلبات المتاحة</h1>
          
          <div className="space-y-6">
            <div className="border rounded-lg p-4">
              <p className="text-gray-600">لا توجد طلبات متاحة حالياً</p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">طلباتي النشطة</h2>
          <div className="space-y-4">
            <p className="text-gray-600">لا توجد طلبات نشطة</p>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">طلباتي المكتملة</h2>
          <div className="space-y-4">
            <p className="text-gray-600">لا توجد طلبات مكتملة</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
