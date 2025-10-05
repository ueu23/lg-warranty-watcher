import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Users, Package, Bell, TrendingUp } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  phone_number: string;
  email: string | null;
  created_at: string;
}

interface WarrantyItem {
  id: string;
  product_name: string;
  purchase_date: string;
  expiry_date: string;
  customers: {
    name: string;
  };
}

interface ReminderLog {
  id: string;
  sent_at: string;
  status: string;
}

const AdminDashboard = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [warrantyItems, setWarrantyItems] = useState<WarrantyItem[]>([]);
  const [reminderLogs, setReminderLogs] = useState<ReminderLog[]>([]);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalWarranties: 0,
    expiringWithin15Days: 0,
    remindersSent: 0,
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    await Promise.all([
      fetchCustomers(),
      fetchWarrantyItems(),
      fetchReminderLogs(),
    ]);
  };

  const fetchCustomers = async () => {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch customers",
        variant: "destructive",
      });
      return;
    }

    setCustomers(data || []);
    setStats(prev => ({ ...prev, totalCustomers: data?.length || 0 }));
  };

  const fetchWarrantyItems = async () => {
    const { data, error } = await supabase
      .from("warranty_items")
      .select(`
        *,
        customers (
          name
        )
      `)
      .order("expiry_date", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch warranty items",
        variant: "destructive",
      });
      return;
    }

    setWarrantyItems(data || []);
    
    // Calculate expiring within 15 days
    const today = new Date();
    const fifteenDaysLater = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000);
    const expiringCount = data?.filter(item => {
      const expiryDate = new Date(item.expiry_date);
      return expiryDate >= today && expiryDate <= fifteenDaysLater;
    }).length || 0;

    setStats(prev => ({
      ...prev,
      totalWarranties: data?.length || 0,
      expiringWithin15Days: expiringCount,
    }));
  };

  const fetchReminderLogs = async () => {
    const { data, error } = await supabase
      .from("reminder_logs")
      .select("*")
      .order("sent_at", { ascending: false })
      .limit(10);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch reminder logs",
        variant: "destructive",
      });
      return;
    }

    setReminderLogs(data || []);
    setStats(prev => ({ ...prev, remindersSent: data?.length || 0 }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of all customers and warranty data</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Warranties</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWarranties}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.expiringWithin15Days}</div>
            <p className="text-xs text-muted-foreground">Within 15 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recent Reminders</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.remindersSent}</div>
            <p className="text-xs text-muted-foreground">Last 10 sent</p>
          </CardContent>
        </Card>
      </div>

      {/* All Customers */}
      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
          <CardDescription>Complete list of registered customers</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Registered</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.phone_number}</TableCell>
                  <TableCell>{customer.email || "—"}</TableCell>
                  <TableCell>{formatDate(customer.created_at)}</TableCell>
                </TableRow>
              ))}
              {customers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No customers found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Warranty Items */}
      <Card>
        <CardHeader>
          <CardTitle>All Warranty Items</CardTitle>
          <CardDescription>Overview of all registered warranty items</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Purchase Date</TableHead>
                <TableHead>Expiry Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {warrantyItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.product_name}</TableCell>
                  <TableCell>{item.customers.name}</TableCell>
                  <TableCell>{formatDate(item.purchase_date)}</TableCell>
                  <TableCell>{formatDate(item.expiry_date)}</TableCell>
                </TableRow>
              ))}
              {warrantyItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No warranty items found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Reminders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reminder Logs</CardTitle>
          <CardDescription>Last 10 reminder notifications sent</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sent At</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reminderLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{formatDateTime(log.sent_at)}</TableCell>
                  <TableCell>
                    <span className={log.status === 'sent' ? 'text-green-600' : 'text-red-600'}>
                      {log.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {reminderLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">
                    No reminder logs found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;