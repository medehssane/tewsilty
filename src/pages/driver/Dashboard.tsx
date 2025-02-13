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
  pickup_latitude: number | null;
  pickup_longitude: number | null;
  cancelled_reason: string | null;
  customer: {
    full_name: string;
    phone_number: string;
  } | null;
};

const DriverDashboard = () => {
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [driverLocation, setDriverLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // تحديث موقع السائق
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setDriverLocation({ latitude, longitude });
          
          // تحديث موقع السائق في قاعدة البيانات إذا كان لديه طلبات نشطة
          if (user?.id && myOrders.length > 0) {
            supabase
              .from('orders')
              .update({
                driver_latitude: latitude,
                driver_longitude: longitude
              })
              .eq('driver_id', user.id)
              .in('status', ['accepted', 'in_progress']);
          }
        },
        (error) => {
          console.error('خطأ في تحديد الموقع:', error);
          toast({
            title: "تنبيه",
            description: "يرجى تفعيل خدمة تحديد الموقع للحصول على الطلبات",
            variant: "destructive",
          });
        }
      );
    }
  }, [user?.id, myOrders.length]);

  // الاستماع إلى الإشعارات المباشرة للطلبات الجديدة
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('orders_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `status=pending OR driver_id=eq.${user.id}`
        },
        (payload) => {
          console.log('تم استلام تحديث:', payload);
          fetchOrders(); // تحديث قائمة الطلبات
          
          // إظهار إشعار للطلبات الجديدة
          if (payload.eventType === 'INSERT' && payload.new.status === 'pending') {
            toast({
              title: "طلب جديد!",
              description: `طلب جديد من ${payload.new.pickup_location}`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const processOrderData = (data: any[]): Order[] => {
    if (!Array.isArray(data)) return [];
    
    return data.map(order => ({
      id: order.id,
      pickup_location: order.pickup_location,
      delivery_location: order.delivery_location,
      details: order.details,
      recipient_phone: order.recipient_phone,
      status: order.status,
      created_at: order.created_at,
      pickup_latitude: order.pickup_latitude,
      pickup_longitude: order.pickup_longitude,
      cancelled_reason: order.cancelled_reason,
      customer: order.profiles ? {
        full_name: order.profiles.full_name,
        phone_number: order.profiles.phone_number
      } : null
    }));
  };

  const fetchOrders = async () => {
    if (!user?.id) return;

    try {
      // جلب الطلبات المتاحة
      const { data: available, error: availableError } = await supabase
        .from('orders')
        .select(`
          *,
          profiles!orders_customer_id_fkey (full_name, phone_number)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (availableError) throw availableError;
      setAvailableOrders(processOrderData(available || []));

      // جلب طلباتي النشطة
      const { data: active, error: activeError } = await supabase
        .from('orders')
        .select(`
          *,
          profiles!orders_customer_id_fkey (full_name, phone_number)
        `)
        .eq('driver_id', user.id)
        .in('status', ['accepted', 'in_progress'])
        .order('created_at', { ascending: false });

      if (activeError) throw activeError;
      setMyOrders(processOrderData(active || []));

      // جلب طلباتي المكتملة
      const { data: completed, error: completedError } = await supabase
        .from('orders')
        .select(`
          *,
          profiles!orders_customer_id_fkey (full_name, phone_number)
        `)
        .eq('driver_id', user.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false });

      if (completedError) throw completedError;
      setCompletedOrders(processOrderData(completed || []));

    } catch (error: any) {
      console.error('خطأ في جلب الطلبات:', error);
      toast({
        title: "خطأ في جلب الطلبات",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
    }
  }, [user?.id]);

  const handleAcceptOrder = async (orderId: string) => {
    if (!user?.id) {
      toast({
        title: "خطأ",
        description: "يجب تسجيل الدخول أولاً",
        variant: "destructive",
      });
      return;
    }

    if (!driverLocation) {
      toast({
        title: "تنبيه",
        description: "يجب تفعيل خدمة تحديد الموقع قبل قبول الطلبات",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          driver_id: user.id,
          status: 'accepted',
          driver_latitude: driverLocation.latitude,
          driver_longitude: driverLocation.longitude
        })
        .eq('id', orderId)
        .eq('status', 'pending')
        .select()
        .single();

      if (error) {
        if (error.message.includes('violates row-level security')) {
          toast({
            title: "عذراً",
            description: "تم قبول هذا الطلب من قبل سائق آخر",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "تم قبول الطلب بنجاح",
          description: "يمكنك الآن بدء التوصيل",
        });
        await fetchOrders();
      }
    } catch (error: any) {
      console.error('خطأ في قبول الطلب:', error);
      toast({
        title: "خطأ في قبول الطلب",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string, reason: string = "تم الإلغاء من قبل السائق") => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'cancelled',
          cancelled_reason: reason,
          driver_id: null
        })
        .eq('id', orderId)
        .eq('driver_id', user.id);

      if (error) throw error;

      toast({
        title: "تم إلغاء الطلب",
        description: "تم إعادة الطلب لقائمة الطلبات المتاحة",
      });

      await fetchOrders();
    } catch (error: any) {
      console.error('خطأ في إلغاء الطلب:', error);
      toast({
        title: "خطأ في إلغاء الطلب",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)
        .eq('driver_id', user.id);

      if (error) throw error;

      toast({
        title: "تم تحديث حالة الطلب",
        description: "تم تحديث حالة الطلب بنجاح",
      });

      await fetchOrders();
    } catch (error: any) {
      console.error('خطأ في تحديث حالة الطلب:', error);
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
            <div className="flex gap-2 w-full">
              <Button
                onClick={() => handleUpdateStatus(order.id, 'in_progress')}
                disabled={isLoading}
                className="flex-1"
              >
                بدء التوصيل
              </Button>
              <Button
                onClick={() => handleCancelOrder(order.id)}
                disabled={isLoading}
                variant="destructive"
                className="flex-1"
              >
                إلغاء
              </Button>
            </div>
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

      {order.cancelled_reason && (
        <p className="text-sm text-red-600">
          سبب الإلغاء: {order.cancelled_reason}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!driverLocation && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="mr-3">
                <p className="text-sm text-yellow-700">
                  يرجى تفعيل خدمة تحديد الموقع للحصول على الطلبات
                </p>
              </div>
            </div>
          </div>
        )}

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
