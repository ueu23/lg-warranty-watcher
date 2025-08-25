import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Package, 
  Shield, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  Bell,
  CheckCircle
} from "lucide-react";

const PortalDashboard = () => {
  // Mock data - would come from backend/database
  const stats = {
    totalProducts: 5,
    activeWarranties: 3,
    expiringSoon: 1,
    expired: 1,
  };

  const recentProducts = [
    {
      id: "1",
      name: "LG OLED TV 55\"",
      category: "TVs & Audio",
      purchaseDate: "2024-01-15",
      warrantyExpiry: "2027-01-15",
      status: "active",
      daysLeft: 730
    },
    {
      id: "2", 
      name: "LG Refrigerator",
      category: "Refrigerators",
      purchaseDate: "2023-06-10",
      warrantyExpiry: "2025-06-10",
      status: "expiring",
      daysLeft: 45
    },
    {
      id: "3",
      name: "LG Washing Machine",
      category: "Washing Machines", 
      purchaseDate: "2022-03-20",
      warrantyExpiry: "2024-03-20",
      status: "expired",
      daysLeft: -30
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "expiring":
        return <Badge className="bg-orange-100 text-orange-800">Expiring Soon</Badge>;
      case "expired":
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's an overview of your LG products and warranties.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Registered LG products
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Warranties</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeWarranties}</div>
            <p className="text-xs text-muted-foreground">
              Currently protected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.expiringSoon}</div>
            <p className="text-xs text-muted-foreground">
              Within 60 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
            <p className="text-xs text-muted-foreground">
              Need renewal
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recent Products
          </CardTitle>
          <CardDescription>
            Your recently registered LG products and their warranty status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold">{product.name}</h4>
                    {getStatusBadge(product.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      {product.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Purchased: {new Date(product.purchaseDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      Expires: {new Date(product.warrantyExpiry).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  {product.daysLeft > 0 ? (
                    <p className="text-sm">
                      <span className="font-medium">{product.daysLeft}</span> days left
                    </p>
                  ) : (
                    <p className="text-sm text-red-600 font-medium">
                      Expired {Math.abs(product.daysLeft)} days ago
                    </p>
                  )}
                  <Progress 
                    value={product.daysLeft > 0 ? Math.max(0, (product.daysLeft / 365) * 100) : 0} 
                    className="w-20 mt-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Warranty Expiring Soon</p>
                <p className="text-muted-foreground">LG Refrigerator warranty expires in 45 days</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Product Registered</p>
                <p className="text-muted-foreground">LG OLED TV successfully registered</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Package className="h-4 w-4 mr-2" />
              Register New Product
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Shield className="h-4 w-4 mr-2" />
              Renew Warranty
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Bell className="h-4 w-4 mr-2" />
              Set Reminders
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PortalDashboard;