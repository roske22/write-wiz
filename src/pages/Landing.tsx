import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Crown, Mail, MessageCircle, Zap, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AuthModal from '@/components/AuthModal';

const Landing = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">WriteWiz</h1>
          </div>
          
          <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Mail className="h-4 w-4 mr-2" />
                Login / Sign Up
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <AuthModal onSuccess={handleAuthSuccess} />
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Generate Professional Messages with{' '}
            <span className="text-primary">AI</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Create perfect emails, chat messages, and professional communications in seconds. 
            Let AI help you communicate better and save time.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <MessageCircle className="h-8 w-8 text-primary" />
            <Zap className="h-8 w-8 text-primary" />
            <Mail className="h-8 w-8 text-primary" />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Choose Your Plan</h3>
          <p className="text-muted-foreground">Start for free, upgrade when you need more</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="text-2xl">Free Plan</CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
              <div className="text-3xl font-bold">$0<span className="text-base font-normal">/month</span></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>3 messages per day</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Basic AI assistance</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Email & chat generation</span>
                </li>
              </ul>
              
              <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full mt-6" size="lg">
                    Start for Free
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <AuthModal onSuccess={handleAuthSuccess} />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="relative border-primary">
            <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              Most Popular
            </Badge>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Crown className="h-6 w-6 text-primary" />
                Premium Plan
              </CardTitle>
              <CardDescription>For power users and professionals</CardDescription>
              <div className="text-3xl font-bold">$4.99<span className="text-base font-normal">/month</span></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Unlimited messages</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Advanced AI models</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Custom templates</span>
                </li>
              </ul>
              
              <Button className="w-full mt-6" size="lg" variant="outline" disabled>
                Buy Premium - Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 bg-muted/30">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Why Choose WriteWiz?</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center space-y-4">
            <MessageCircle className="h-12 w-12 text-primary mx-auto" />
            <h4 className="text-xl font-semibold">Smart Chat Messages</h4>
            <p className="text-muted-foreground">Generate contextual chat responses that sound natural and professional</p>
          </div>
          
          <div className="text-center space-y-4">
            <Mail className="h-12 w-12 text-primary mx-auto" />
            <h4 className="text-xl font-semibold">Professional Emails</h4>
            <p className="text-muted-foreground">Create compelling business emails that get results and save you time</p>
          </div>
          
          <div className="text-center space-y-4">
            <Zap className="h-12 w-12 text-primary mx-auto" />
            <h4 className="text-xl font-semibold">Lightning Fast</h4>
            <p className="text-muted-foreground">Get your messages generated in seconds, not minutes</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;