import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, LogOut, Sparkles, Crown } from 'lucide-react';

const Index = () => {
  const { user, profile, userRole, loading, signOut } = useAuth();
  const navigate = useNavigate();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to /auth
  }

  const isPremium = userRole === 'premium';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">WriteWiz</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {profile?.display_name || profile?.email}
              </span>
              <Badge variant={isPremium ? "default" : "secondary"}>
                {isPremium ? (
                  <>
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </>
                ) : (
                  'Free'
                )}
              </Badge>
            </div>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">
              Welcome back, {profile?.display_name || 'there'}!
            </h2>
            <p className="text-muted-foreground">
              Generate professional messages with AI-powered assistance
            </p>
          </div>

          {/* Usage Info */}
          {!isPremium && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Daily Usage</CardTitle>
                <CardDescription>
                  You have 3 free messages per day. Upgrade to Premium for unlimited access.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-primary">0/3</div>
                  <Button size="sm">
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade to Premium
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Message Generator Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>AI Message Generator</CardTitle>
              <CardDescription>
                Coming soon - Generate professional emails, chat messages, and more with AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Message generation interface will be implemented next</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
