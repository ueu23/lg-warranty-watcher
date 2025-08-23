import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { Shield, Bell, Lock, Smartphone, Mail, Calendar, BarChart3, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const Home = () => {
  const features = [
    {
      icon: Bell,
      title: "Smart Reminders",
      description: "Get email and SMS alerts 30 days before your warranty expires",
      color: "text-blue-500"
    },
    {
      icon: Lock,
      title: "Secure Storage",
      description: "Your product data is safely stored in the cloud with encryption",
      color: "text-green-500"
    },
    {
      icon: Smartphone,
      title: "Multi-Channel",
      description: "Receive notifications via email, SMS, and web dashboard",
      color: "text-purple-500"
    }
  ];

  const stats = [
    { number: "1,000+", label: "Products Tracked" },
    { number: "500+", label: "Users Protected" },
    { number: "99.9%", label: "Reminder Accuracy" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Never Miss Your LG Warranty
              <span className="text-primary block">Again</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Track all your LG products and get automated reminders before your
              warranties expire. Simple, reliable, and free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  <Calendar className="mr-2 h-5 w-5" />
                  Add Your First Product
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Why Choose LG Warranty Reminder?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple, powerful features to keep your LG products protected
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elegant)] transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className={cn("w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center", feature.color)}>
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-lg-red-light text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Trusted by LG Product Owners
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-lg opacity-90">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Start Protecting Your LG Products Today
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of satisfied customers who never miss their warranty deadlines
            </p>
            <Link to="/dashboard">
              <Button size="lg" className="group">
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold">LG Warranty Manager</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Never miss your warranty expiry again. Smart reminders for all your LG products.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link to="/" className="block text-muted-foreground hover:text-primary">Home</Link>
                <Link to="/dashboard" className="block text-muted-foreground hover:text-primary">Dashboard</Link>
                <Link to="/support" className="block text-muted-foreground hover:text-primary">Support</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">support@lgwarranty.com</span>
                </div>
                <div className="text-sm">1-800-LG-WARRANTY</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-muted-foreground">
              © 2024 LG Warranty Manager. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;