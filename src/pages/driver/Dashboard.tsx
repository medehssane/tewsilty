
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type Order = {
  id: string;
  pickup_location: string;
  delivery_location: string;
  details: string | null;
  recipient_phone: string;
  status: string;
  created_at: string;
  customer: {
    full_name: string;
    phone_number: string;
  } | null;
};

const DriverDashboard = () => {
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchOrders = async () => {
    try {
      // جلب الطلبات المتاحة
      const { data: available, error: availableError } = await supabase
        .from('orders')
        .select(`
          *,
          customer:profiles(full_name, phone_number)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (availableError) throw availableError;
      setAvailableOrders(available || []);

      // جلب طلباتي النشطة
      const { data: active, error: activeError } = await supabase
        .from('orders')
        .select(`
          *,
          customer:profiles(full_name, phone_number)
        `)
        .eq('driver_id', user?.id)
        .in('status', ['accepted', 'in_progress'])
        .order('created_at', { ascending: false });

      if (activeError) throw activeError;
      setMyOrders(active || []);

      // جلب طلباتي المكتملة
      const { data: completed, error: completedError } = await supabase
        .from('orders')
        .select(`
          *,
          customer:profiles(full_name, phone_number)
        `)
        .eq('driver_id', user?.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false });

      if (completedError) throw completedError;
      setCompletedOrders(completed || []);

    } catch (error: any) {
      toast({
        title: "خطأ في جلب الطلبات",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user?.id]);

  const handleAcceptOrder = async (orderId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          driver_id: user?.id,
          status: 'accepted'
        })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "تم قبول الطلب بنجاح",
        description: "يمكنك الآن بدء التوصيل",
      });

      fetchOrders();
    } catch (error: any) {
      toast({
        title: "خطأ في قبول الطلب",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "تم تحديث حالة الطلب",
        description: "تم تحديث حالة الطلب بنجاح",
      });

      fetchOrders();
    } catch (error: any) {
      toast({
        title: "خطأ في تحديث حالة الطلب",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const OrderCard = ({ order, showActions = false }: { order: Order, showActions?: boolean }) => (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-sm font-medium">من: {order.pickup_location}</p>
          <p className="text-sm font-medium">إلى: {order.delivery_location}</p>
        </div>
        <div className="text-sm text-gray-500">
          {new Date(order.created_at).toLocaleDateString('ar-SA')}
        </div>
      </div>
      
      {order.details && (
        <p className="text-sm text-gray-600">
          تفاصيل: {order.details}
        </p>
      )}
      
      <div className="text-sm">
        <p>العميل: {order.customer?.full_name}</p>
        <p>هاتف المستلم: {order.recipient_phone}</p>
      </div>

      {showActions && (
        <div className="flex gap-2 pt-2">
          {order.status === 'pending' ? (
            <Button
              onClick={() => handleAcceptOrder(order.id)}
              disabled={isLoading}
              className="w-full"
            >
              قبول الطلب
            </Button>
          ) : order.status === 'accepted' ? (
            <Button
              onClick={() => handleUpdateStatus(order.id, 'in_progress')}
              disabled={isLoading}
              className="w-full"
            >
              بدء التوصيل
            </Button>
          ) : order.status === 'in_progress' ? (
            <Button
              onClick={() => handleUpdateStatus(order.id, 'completed')}
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              إكمال التوصيل
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">الطلبات المتاحة</h1>
          
          <div className="space-y-6">
            {availableOrders.length === 0 ? (
              <p className="text-gray-600">لا توجد طلبات متاحة حالياً</p>
            ) : (
              availableOrders.map(order => (
                <OrderCard key={order.id} order={order} showActions />
              ))
            )}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">طلباتي النشطة</h2>
          <div className="space-y-4">
            {myOrders.length === 0 ? (
              <p className="text-gray-600">لا توجد طلبات نشطة</p>
            ) : (
              myOrders.map(order => (
                <OrderCard key={order.id} order={order} showActions />
              ))
            )}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">طلباتي المكتملة</h2>
          <div className="space-y-4">
            {completedOrders.length === 0 ? (
              <p className="text-gray-600">لا توجد طلبات مكتملة</p>
            ) : (
              completedOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
