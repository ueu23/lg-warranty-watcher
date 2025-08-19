import { useState } from "react";
import { ProductRegistrationForm } from "@/components/ProductRegistrationForm";
import { WarrantyDashboard } from "@/components/WarrantyDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Package, Bell } from "lucide-react";

interface Product {
  id: string;
  productName: string;
  category: string;
  model: string;
  purchaseDate: string;
  warrantyPeriod: number;
  serialNumber: string;
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const handleProductAdded = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-lg-red-light text-primary-foreground shadow-[var(--shadow-elegant)]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">LG Warranty Tracker</h1>
              <p className="text-primary-foreground/80">Keep track of your LG product warranties</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="register" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Register Product
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <WarrantyDashboard products={products} />
          </TabsContent>

          <TabsContent value="register">
            <ProductRegistrationForm onProductAdded={handleProductAdded} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-muted mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">
            © 2024 LG Warranty Tracker. Stay protected with timely warranty reminders.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
