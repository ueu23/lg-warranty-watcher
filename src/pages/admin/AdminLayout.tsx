import { Outlet, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col w-full bg-gradient-to-br from-background via-background to-secondary">
      {/* Header */}
      <header className="h-16 bg-card/95 backdrop-blur-sm border-b border-border flex items-center justify-between px-6">
        <Link to="/admin" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">LG Warranty Manager - Admin</span>
        </Link>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </header>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;