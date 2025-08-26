import { useState } from "react";
import { ProductRegistrationForm } from "@/components/ProductRegistrationForm";
import { WarrantyDashboard } from "@/components/WarrantyDashboard";
import ReminderSettings from "@/components/ReminderSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Plus, Bell } from "lucide-react";

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

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const handleProductAdded = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Product Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage your LG products and track warranty information
        </p>
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-lg">
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            My Products
          </TabsTrigger>
          <TabsTrigger value="register" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </TabsTrigger>
          <TabsTrigger value="reminders" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Reminders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products">
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
  );
};

export default Products;