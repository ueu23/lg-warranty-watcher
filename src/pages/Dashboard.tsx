import { useState } from "react";
import { ProductRegistrationForm } from "@/components/ProductRegistrationForm";
import { WarrantyDashboard } from "@/components/WarrantyDashboard";
import ReminderSettings from "@/components/ReminderSettings";
import QuickActions from "@/components/QuickActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Bell, Settings } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  productName: string;
  category: string;
  model: string;
  purchaseDate: string;
  warrantyPeriod: number;
  serialNumber: string;
  email: string;
}

const Dashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();

  const handleProductAdded = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const handleRegisterProduct = () => {
    setActiveTab("register");
  };

  const handleRenewWarranty = () => {
    toast({
      title: "Renew Warranty",
      description: "Warranty renewal feature coming soon!",
    });
  };

  const handleSetReminders = () => {
    setActiveTab("reminders");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      <Navbar />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Quick Actions - Left sidebar */}
          <div className="lg:col-span-1">
            <QuickActions 
              onRegisterProduct={handleRegisterProduct}
              onRenewWarranty={handleRenewWarranty}
              onSetReminders={handleSetReminders}
            />
          </div>

          {/* Main content area */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 max-w-lg">
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="register" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Register Product
                </TabsTrigger>
                <TabsTrigger value="reminders" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Reminders
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard">
                <WarrantyDashboard products={products} />
              </TabsContent>

              <TabsContent value="register">
                <ProductRegistrationForm onProductAdded={handleProductAdded} />
              </TabsContent>

              <TabsContent value="reminders">
                <ReminderSettings />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
