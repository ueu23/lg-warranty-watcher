import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, User, Package, Bell } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Customer {
  id: string;
  name: string;
  phone_number: string;
  email: string | null;
  created_at: string;
}

interface WarrantyItem {
  id: string;
  customer_id: string;
  product_name: string;
  serial_number: string | null;
  purchase_date: string;
  warranty_period_months: number;
  expiry_date: string;
  customers: {
    name: string;
    phone_number: string;
  };
}

interface ReminderLog {
  id: string;
  days_before_expiry: number;
  sent_at: string;
  status: string;
  message: string | null;
  warranty_items: {
    product_name: string;
  };
  customers: {
    name: string;
  };
}

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [warrantyItems, setWarrantyItems] = useState<WarrantyItem[]>([]);
  const [reminderLogs, setReminderLogs] = useState<ReminderLog[]>([]);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isAddWarrantyOpen, setIsAddWarrantyOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");

  // Customer form state
  const [customerForm, setCustomerForm] = useState({
    name: "",
    phone_number: "",
    email: "",
  });

  // Warranty form state
  const [warrantyForm, setWarrantyForm] = useState({
    product_name: "",
    serial_number: "",
    purchase_date: "",
    warranty_period_months: 12,
  });

  useEffect(() => {
    fetchCustomers();
    fetchWarrantyItems();
    fetchReminderLogs();
  }, []);

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
  };

  const fetchWarrantyItems = async () => {
    const { data, error } = await supabase
      .from("warranty_items")
      .select(`
        *,
        customers (
          name,
          phone_number
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
  };

  const fetchReminderLogs = async () => {
    const { data, error } = await supabase
      .from("reminder_logs")
      .select(`
        *,
        warranty_items (
          product_name
        ),
        customers (
          name
        )
      `)
      .order("sent_at", { ascending: false })
      .limit(50);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch reminder logs",
        variant: "destructive",
      });
      return;
    }

    setReminderLogs(data || []);
  };

  const handleAddCustomer = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("customers").insert({
      user_id: user.id,
      name: customerForm.name,
      phone_number: customerForm.phone_number,
      email: customerForm.email || null,
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Customer added successfully",
    });

    setCustomerForm({ name: "", phone_number: "", email: "" });
    setIsAddCustomerOpen(false);
    fetchCustomers();
  };

  const handleAddWarranty = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in",
        variant: "destructive",
      });
      return;
    }

    if (!selectedCustomerId) {
      toast({
        title: "Error",
        description: "Please select a customer",
        variant: "destructive",
      });
      return;
    }

    // Calculate expiry date
    const purchaseDate = new Date(warrantyForm.purchase_date);
    const expiryDate = new Date(purchaseDate);
    expiryDate.setMonth(expiryDate.getMonth() + warrantyForm.warranty_period_months);

    const { error } = await supabase.from("warranty_items").insert({
      user_id: user.id,
      customer_id: selectedCustomerId,
      product_name: warrantyForm.product_name,
      serial_number: warrantyForm.serial_number || null,
      purchase_date: warrantyForm.purchase_date,
      warranty_period_months: warrantyForm.warranty_period_months,
      expiry_date: expiryDate.toISOString().split('T')[0],
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Warranty item added successfully",
    });

    setWarrantyForm({
      product_name: "",
      serial_number: "",
      purchase_date: "",
      warranty_period_months: 12,
    });
    setSelectedCustomerId("");
    setIsAddWarrantyOpen(false);
    fetchWarrantyItems();
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryStatus = (daysUntil: number) => {
    if (daysUntil < 0) return { text: "Expired", color: "text-red-600" };
    if (daysUntil <= 1) return { text: `${daysUntil} day left`, color: "text-red-600" };
    if (daysUntil <= 15) return { text: `${daysUntil} days left`, color: "text-orange-600" };
    return { text: `${daysUntil} days left`, color: "text-green-600" };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <p className="text-muted-foreground">Manage customers and warranty reminders</p>
        </div>
      </div>

      <Tabs defaultValue="customers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Customers
          </TabsTrigger>
          <TabsTrigger value="warranties" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Warranty Items
          </TabsTrigger>
          <TabsTrigger value="reminders" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Reminder Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Customers</CardTitle>
                  <CardDescription>View and manage your customers</CardDescription>
                </div>
                <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Customer
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Customer</DialogTitle>
                      <DialogDescription>Enter customer details below</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          value={customerForm.name}
                          onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={customerForm.phone_number}
                          onChange={(e) => setCustomerForm({ ...customerForm, phone_number: e.target.value })}
                          placeholder="+1234567890"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={customerForm.email}
                          onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <Button onClick={handleAddCustomer}>Add Customer</Button>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Added On</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.phone_number}</TableCell>
                      <TableCell>{customer.email || "—"}</TableCell>
                      <TableCell>{new Date(customer.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                  {customers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No customers yet. Add your first customer to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warranties" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Warranty Items</CardTitle>
                  <CardDescription>Track warranty expiry dates</CardDescription>
                </div>
                <Dialog open={isAddWarrantyOpen} onOpenChange={setIsAddWarrantyOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Warranty Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Warranty Item</DialogTitle>
                      <DialogDescription>Add a product warranty for a customer</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="customer">Customer *</Label>
                        <select
                          id="customer"
                          className="w-full p-2 border rounded-md"
                          value={selectedCustomerId}
                          onChange={(e) => setSelectedCustomerId(e.target.value)}
                        >
                          <option value="">Select a customer</option>
                          {customers.map((customer) => (
                            <option key={customer.id} value={customer.id}>
                              {customer.name} - {customer.phone_number}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="product">Product Name *</Label>
                        <Input
                          id="product"
                          value={warrantyForm.product_name}
                          onChange={(e) => setWarrantyForm({ ...warrantyForm, product_name: e.target.value })}
                          placeholder="LG Refrigerator"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="serial">Serial Number</Label>
                        <Input
                          id="serial"
                          value={warrantyForm.serial_number}
                          onChange={(e) => setWarrantyForm({ ...warrantyForm, serial_number: e.target.value })}
                          placeholder="SN123456"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="purchase">Purchase Date *</Label>
                        <Input
                          id="purchase"
                          type="date"
                          value={warrantyForm.purchase_date}
                          onChange={(e) => setWarrantyForm({ ...warrantyForm, purchase_date: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="period">Warranty Period (Months) *</Label>
                        <Input
                          id="period"
                          type="number"
                          min="1"
                          value={warrantyForm.warranty_period_months}
                          onChange={(e) => setWarrantyForm({ ...warrantyForm, warranty_period_months: parseInt(e.target.value) })}
                        />
                      </div>
                    </div>
                    <Button onClick={handleAddWarranty}>Add Warranty Item</Button>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Purchase Date</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {warrantyItems.map((item) => {
                    const daysUntil = getDaysUntilExpiry(item.expiry_date);
                    const status = getExpiryStatus(daysUntil);
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.product_name}</TableCell>
                        <TableCell>{item.customers.name}</TableCell>
                        <TableCell>{item.serial_number || "—"}</TableCell>
                        <TableCell>{new Date(item.purchase_date).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(item.expiry_date).toLocaleDateString()}</TableCell>
                        <TableCell className={status.color}>{status.text}</TableCell>
                      </TableRow>
                    );
                  })}
                  {warrantyItems.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No warranty items yet. Add your first warranty item to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reminders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reminder Logs</CardTitle>
              <CardDescription>View SMS reminder history</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Days Before Expiry</TableHead>
                    <TableHead>Sent At</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reminderLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.customers.name}</TableCell>
                      <TableCell>{log.warranty_items.product_name}</TableCell>
                      <TableCell>{log.days_before_expiry} days</TableCell>
                      <TableCell>{new Date(log.sent_at).toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`capitalize ${
                          log.status === 'sent' ? 'text-green-600' : 
                          log.status === 'failed' ? 'text-red-600' : 
                          'text-orange-600'
                        }`}>
                          {log.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                  {reminderLogs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No reminders sent yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Customers;