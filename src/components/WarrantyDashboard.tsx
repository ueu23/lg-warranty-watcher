import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Shield, AlertTriangle } from "lucide-react";

interface Product {
  id: string;
  productName: string;
  category: string;
  model: string;
  purchaseDate: string;
  warrantyPeriod: number;
  serialNumber: string;
}

interface WarrantyDashboardProps {
  products: Product[];
}

const getWarrantyStatus = (purchaseDate: string, warrantyPeriod: number) => {
  const purchase = new Date(purchaseDate);
  const expiry = new Date(purchase);
  expiry.setMonth(expiry.getMonth() + warrantyPeriod);
  
  const today = new Date();
  const totalDays = Math.floor((expiry.getTime() - purchase.getTime()) / (1000 * 60 * 60 * 24));
  const daysElapsed = Math.floor((today.getTime() - purchase.getTime()) / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  const progress = Math.max(0, Math.min(100, (daysElapsed / totalDays) * 100));
  
  let status: "active" | "expiring" | "expired";
  if (daysRemaining < 0) {
    status = "expired";
  } else if (daysRemaining <= 30) {
    status = "expiring";
  } else {
    status = "active";
  }
  
  return {
    status,
    daysRemaining: Math.max(0, daysRemaining),
    progress,
    expiryDate: expiry.toLocaleDateString(),
  };
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300">Active</Badge>;
    case "expiring":
      return <Badge variant="destructive" className="bg-yellow-100 text-yellow-800 border-yellow-300">Expiring Soon</Badge>;
    case "expired":
      return <Badge variant="destructive">Expired</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return <Shield className="h-5 w-5 text-green-600" />;
    case "expiring":
      return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    case "expired":
      return <Clock className="h-5 w-5 text-red-600" />;
    default:
      return <Calendar className="h-5 w-5 text-gray-600" />;
  }
};

export const WarrantyDashboard = ({ products }: WarrantyDashboardProps) => {
  if (products.length === 0) {
    return (
      <Card className="shadow-[var(--shadow-card)]">
        <CardContent className="p-12 text-center">
          <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Products Registered</h3>
          <p className="text-muted-foreground">Register your first LG product to start tracking warranties.</p>
        </CardContent>
      </Card>
    );
  }

  const activeProducts = products.filter(product => getWarrantyStatus(product.purchaseDate, product.warrantyPeriod).status === "active");
  const expiringProducts = products.filter(product => getWarrantyStatus(product.purchaseDate, product.warrantyPeriod).status === "expiring");
  const expiredProducts = products.filter(product => getWarrantyStatus(product.purchaseDate, product.warrantyPeriod).status === "expired");

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-[var(--shadow-card)] border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Warranties</p>
                <p className="text-2xl font-bold text-green-600">{activeProducts.length}</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)] border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
                <p className="text-2xl font-bold text-yellow-600">{expiringProducts.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)] border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expired</p>
                <p className="text-2xl font-bold text-red-600">{expiredProducts.length}</p>
              </div>
              <Clock className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product List */}
      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Warranty Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {products.map((product) => {
              const warranty = getWarrantyStatus(product.purchaseDate, product.warrantyPeriod);
              
              return (
                <div key={product.id} className="border rounded-lg p-4 transition-all duration-300 hover:shadow-[var(--shadow-elegant)]">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(warranty.status)}
                        <div>
                          <h4 className="font-semibold text-lg">{product.productName}</h4>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Model:</span>
                          <p className="font-medium">{product.model || "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Purchase Date:</span>
                          <p className="font-medium">{new Date(product.purchaseDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Warranty Expires:</span>
                          <p className="font-medium">{warranty.expiryDate}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(warranty.status)}
                      <span className="text-sm text-muted-foreground">
                        {warranty.status === "expired" ? "Expired" : `${warranty.daysRemaining} days left`}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Warranty Progress</span>
                      <span className="font-medium">{warranty.progress.toFixed(0)}%</span>
                    </div>
                    <Progress 
                      value={warranty.progress} 
                      className="h-2"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};