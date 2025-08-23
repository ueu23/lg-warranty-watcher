import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";
import { 
  Phone, 
  MessageCircle, 
  Mail, 
  Search, 
  BookOpen, 
  Settings, 
  AlertCircle, 
  HelpCircle, 
  User, 
  Wrench,
  FileText
} from "lucide-react";

const Support = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const supportOptions = [
    {
      icon: Phone,
      title: "LG Official Support",
      description: "Get direct support from LG for product warranties, repairs, and technical issues.",
      action: "1-800-243-0000",
      detail: "Available 24/7",
      buttonText: "Visit LG Support →",
      color: "text-red-500"
    },
    {
      icon: MessageCircle,
      title: "Live Chat Support",
      description: "Chat with our support team for help with your Warranty Manager account.",
      action: "Start Chat",
      detail: "Usually responds within minutes",
      buttonText: "Start Chat",
      color: "text-blue-500"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message about your issue and we'll get back to you.",
      action: "Send Email",
      detail: "Response within 24 hours",
      buttonText: "Send Email",
      color: "text-green-500"
    }
  ];

  const faqItems = [
    {
      question: "How do I register my LG product for warranty reminders?",
      answer: "Go to the Dashboard page and click 'Register Product'. Fill in your product details including name, model, purchase date, and warranty period. We'll automatically calculate your warranty expiry date and set up reminders."
    },
    {
      question: "What types of notifications will I receive?",
      answer: "You'll receive email and SMS alerts 30 days before your warranty expires. You can also view all your warranties and their status on your dashboard at any time."
    },
    {
      question: "Is my data secure and private?",
      answer: "Yes, your product data is safely stored with encryption. We only use your information to provide warranty reminders and never share it with third parties."
    },
    {
      question: "What should I do if my warranty is about to expire?",
      answer: "When you receive a reminder, contact LG customer service or visit an authorized service center before the warranty expires. Keep your purchase receipt and product information handy."
    },
    {
      question: "Can I manage multiple LG products?",
      answer: "Absolutely! You can add as many LG products as you want to your account. Each product will be tracked separately with its own warranty timeline."
    },
    {
      question: "What if I need to update my product information?",
      answer: "You can edit or delete any product from your dashboard. Click on the product card and use the edit or delete options to update the information."
    }
  ];

  const helpTopics = [
    {
      icon: BookOpen,
      title: "Getting Started",
      description: "Learn how to set up your account and register your first LG product.",
      topics: ["Creating your account", "Registering products", "Understanding notifications", "Dashboard overview"]
    },
    {
      icon: AlertCircle,
      title: "Warranty Information",
      description: "Everything you need to know about LG warranties and coverage.",
      topics: ["Understanding warranty periods", "What's covered vs. not covered", "Extended warranty options", "Warranty claim process"]
    },
    {
      icon: Settings,
      title: "Notifications & Alerts",
      description: "Managing your warranty reminder notifications and preferences.",
      topics: ["Email notification settings", "SMS alert configuration", "Notification timing", "Troubleshooting delivery"]
    },
    {
      icon: User,
      title: "Account Management",
      description: "Managing your account settings, data, and privacy preferences.",
      topics: ["Updating contact information", "Data export/import", "Privacy settings", "Account deletion"]
    },
    {
      icon: Wrench,
      title: "Technical Support",
      description: "Troubleshooting technical issues and getting help with problems.",
      topics: ["Login problems", "Missing notifications", "Data sync issues", "Browser compatibility"]
    },
    {
      icon: FileText,
      title: "LG Product Support",
      description: "Direct links and resources for getting help with your LG products.",
      topics: ["LG customer service", "Service center locator", "Product manuals", "Troubleshooting guides"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      <Navbar />
      
      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-primary to-lg-red-light text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            How can we help you?
          </h1>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Get support for your LG Warranty Manager account and LG products
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for help articles, FAQs, or enter your question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg bg-card text-foreground"
            />
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {supportOptions.map((option, index) => (
              <Card key={index} className="text-center hover:shadow-[var(--shadow-elegant)] transition-all duration-300">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center ${option.color}`}>
                    <option.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{option.title}</h3>
                  <p className="text-muted-foreground mb-4">{option.description}</p>
                  <div className="mb-4">
                    <div className="font-medium text-foreground">{option.action}</div>
                    <div className="text-sm text-muted-foreground">{option.detail}</div>
                  </div>
                  <Button variant={index === 0 ? "destructive" : index === 1 ? "default" : "secondary"} className="w-full">
                    {option.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">
              Find quick answers to common questions about LG Warranty Manager
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg px-6">
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="flex items-center gap-3">
                      <HelpCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="font-medium">{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 pl-8">
                    <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Help Topics */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse Help Topics</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {helpTopics.map((topic, index) => (
              <Card key={index} className="hover:shadow-[var(--shadow-card)] transition-all duration-300 cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <topic.icon className="h-6 w-6 text-primary" />
                    <CardTitle className="text-lg">{topic.title}</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">{topic.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {topic.topics.map((item, topicIndex) => (
                      <li key={topicIndex} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Still Need Help?</CardTitle>
                <p className="text-muted-foreground">
                  Can't find what you're looking for? Send us a message and we'll get back to you.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Your Name</Label>
                    <Input id="name" placeholder="Enter your name" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="Enter your email" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="account">Account Issues</SelectItem>
                      <SelectItem value="technical">Technical Problems</SelectItem>
                      <SelectItem value="warranty">Warranty Questions</SelectItem>
                      <SelectItem value="feature">Feature Request</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Please describe your issue or question in detail..."
                    rows={5}
                  />
                </div>
                <Button className="w-full" size="lg">
                  <Mail className="mr-2 h-5 w-5" />
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <HelpCircle className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold">LG Warranty Manager</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Never miss your warranty expiry again. Smart reminders for all your LG products.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <a href="/" className="block text-muted-foreground hover:text-primary">Home</a>
                <a href="/dashboard" className="block text-muted-foreground hover:text-primary">Dashboard</a>
                <a href="/support" className="block text-muted-foreground hover:text-primary">Support</a>
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

export default Support;