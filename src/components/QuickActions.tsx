import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Shield, Bell } from "lucide-react";

interface QuickActionsProps {
  onRegisterProduct: () => void;
  onRenewWarranty: () => void;
  onSetReminders: () => void;
}

const QuickActions = ({ onRegisterProduct, onRenewWarranty, onSetReminders }: QuickActionsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          variant="ghost" 
          className="w-full justify-start h-auto p-4 hover:bg-muted/50"
          onClick={onRegisterProduct}
        >
          <Package className="h-5 w-5 mr-3" />
          <span className="text-lg">Register New Product</span>
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start h-auto p-4 hover:bg-muted/50"
          onClick={onRenewWarranty}
        >
          <Shield className="h-5 w-5 mr-3" />
          <span className="text-lg">Renew Warranty</span>
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start h-auto p-4 hover:bg-muted/50"
          onClick={onSetReminders}
        >
          <Bell className="h-5 w-5 mr-3" />
          <span className="text-lg">Set Reminders</span>
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActions;