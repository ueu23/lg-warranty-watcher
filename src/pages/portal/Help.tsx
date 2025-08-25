import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Phone, 
  Search,
  Book,
  Video,
  FileText,
  ExternalLink
} from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: ""
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Your support request has been submitted. We'll get back to you soon!",
    });
    setContactForm({ subject: "", message: "" });
  };

  const faqItems = [
    {
      question: "How do I register my LG product?",
      answer: "To register your LG product, go to the 'Product Details' section and click 'Add Product'. Fill in all required information including product name, category, model, purchase date, and warranty period."
    },
    {
      question: "When will I receive warranty expiration notifications?",
      answer: "You can set custom notification preferences in your product registration. By default, we send reminders 60 days, 30 days, and 7 days before your warranty expires."
    },
    {
      question: "Can I extend my warranty period?",
      answer: "Yes, LG offers warranty extension options for most products. Contact LG customer service or visit an authorized service center to learn about extension plans available for your specific product."
    },
    {
      question: "What should I do if my warranty has expired?",
      answer: "If your warranty has expired, you can still get service from LG authorized service centers. You may be eligible for paid repairs or extended warranty plans depending on your product."
    },
    {
      question: "How do I update my contact information?",
      answer: "You can update your contact information in the 'User Details' section. Click 'Edit Profile' to modify your name, email, phone number, or address."
    }
  ];

  const helpCategories = [
    {
      title: "Getting Started",
      icon: Book,
      description: "Learn the basics of using LG Warranty Manager",
      articles: 5
    },
    {
      title: "Product Registration",
      icon: FileText,
      description: "Step-by-step guide to register your products",
      articles: 8
    },
    {
      title: "Warranty Information",
      icon: HelpCircle,
      description: "Understanding your warranty coverage",
      articles: 12
    },
    {
      title: "Video Tutorials",
      icon: Video,
      description: "Watch helpful video guides",
      articles: 6
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Help & Support</h1>
        <p className="text-muted-foreground mt-2">
          Find answers, get support, and learn how to make the most of your LG products
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for help articles, FAQs, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Help Categories */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Help Categories</CardTitle>
              <CardDescription>Browse topics to find the help you need</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {helpCategories.map((category, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="flex items-start gap-3">
                      <category.icon className="h-5 w-5 text-primary mt-1" />
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{category.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                        <Badge variant="secondary">{category.articles} articles</Badge>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Quick answers to common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Contact Support */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>Get in touch with our support team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Live Chat
                  <Badge className="ml-auto bg-green-100 text-green-800">Online</Badge>
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Support
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Support
                  <span className="ml-auto text-xs text-muted-foreground">24/7</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>Describe your issue and we'll help</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="Subject"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Describe your issue..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    rows={4}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start p-0 h-auto">
                <ExternalLink className="h-3 w-3 mr-2" />
                LG Official Support
              </Button>
              <Button variant="ghost" className="w-full justify-start p-0 h-auto">
                <ExternalLink className="h-3 w-3 mr-2" />
                Warranty Terms & Conditions
              </Button>
              <Button variant="ghost" className="w-full justify-start p-0 h-auto">
                <ExternalLink className="h-3 w-3 mr-2" />
                Service Center Locator
              </Button>
              <Button variant="ghost" className="w-full justify-start p-0 h-auto">
                <ExternalLink className="h-3 w-3 mr-2" />
                Product Manuals
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Help;