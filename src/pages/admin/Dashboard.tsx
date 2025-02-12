
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

type DriverDetail = {
  id: string;
  id_number: string;
  verification_status: string;
  profile: {
    full_name: string;
    phone_number: string;
    email?: string;
  } | null;
};

const AdminDashboard = () => {
  const [drivers, setDrivers] = useState<DriverDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchDrivers = async () => {
    try {
      const { data, error } = await supabase
        .from('driver_details')
        .select(`
          *,
          profile:profiles(
            full_name,
            phone_number
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setDrivers(data || []);
    } catch (error: any) {
      toast({
        title: "خطأ في جلب بيانات السائقين",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateDriverStatus = async (driverId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('driver_details')
        .update({ verification_status: status })
        .eq('id', driverId);

      if (error) throw error;

      toast({
        title: "تم تحديث الحالة بنجاح",
        description: "تم تحديث حالة السائق بنجاح",
      });

      // تحديث القائمة
      fetchDrivers();
    } catch (error: any) {
      toast({
        title: "خطأ في تحديث الحالة",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">لوحة تحكم المشرف</h1>
            <div className="text-sm text-gray-600">
              مرحباً بك {user?.user_metadata.full_name}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">قائمة السائقين</h2>
            
            {isLoading ? (
              <div className="text-center py-4">جاري التحميل...</div>
            ) : drivers.length === 0 ? (
              <div className="text-center py-4 text-gray-600">لا يوجد سائقين مسجلين</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الاسم
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        رقم الهوية
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        رقم الهاتف
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الحالة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {drivers.map((driver) => (
                      <tr key={driver.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{driver.profile?.full_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{driver.id_number}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{driver.profile?.phone_number}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            driver.verification_status === 'verified' 
                              ? 'bg-green-100 text-green-800'
                              : driver.verification_status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {driver.verification_status === 'verified' ? 'تم التحقق'
                              : driver.verification_status === 'rejected' ? 'مرفوض'
                              : 'قيد المراجعة'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium space-x-2 space-x-reverse">
                          {driver.verification_status !== 'verified' && (
                            <Button
                              onClick={() => updateDriverStatus(driver.id, 'verified')}
                              variant="outline"
                              className="ml-2"
                            >
                              قبول
                            </Button>
                          )}
                          {driver.verification_status !== 'rejected' && (
                            <Button
                              onClick={() => updateDriverStatus(driver.id, 'rejected')}
                              variant="destructive"
                            >
                              رفض
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
