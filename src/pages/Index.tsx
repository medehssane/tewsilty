
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="text-center space-y-8 p-8">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">مرحباً بك في خدمة التوصيل</h1>
        <p className="text-xl text-gray-600 mb-8">اختر نوع الحساب الذي تريد استخدامه</p>
        
        <div className="space-y-4">
          <Button 
            onClick={() => navigate('/customer/login')}
            className="w-full max-w-xs text-lg py-6"
          >
            دخول كعميل
          </Button>
          
          <Button 
            onClick={() => navigate('/driver/login')}
            variant="outline"
            className="w-full max-w-xs text-lg py-6"
          >
            دخول كسائق توصيل
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
