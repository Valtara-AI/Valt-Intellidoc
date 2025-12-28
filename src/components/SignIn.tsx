import { AlertCircle, ArrowLeft, Building2, Shield } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface SignInProps {
  onSignIn: (user: any) => void;
  onBack?: () => void;
}

export function SignIn({ onSignIn, onBack }: SignInProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSSO = async (provider: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Mock SSO authentication
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock user data
      const user = {
        id: '1',
        name: 'John Smith',
        email: email || 'john.smith@company.com',
        role: 'Legal Counsel',
        department: 'Legal',
        permissions: ['read', 'write', 'admin'],
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      };
      
      onSignIn(user);
    } catch (err) {
      setError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your corporate email address.');
      return;
    }
    handleSSO('email');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back button */}
        {onBack && (
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        )}

        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16">
            <Image src="/Valtara_AI_Logo.svg" alt="Valtara AI Logo" width={64} height={64} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Valt Intellidoc</h1>
            <p className="text-muted-foreground mt-2">
              Sign in to access your secure document assistant
            </p>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2">
              <Building2 className="w-5 h-5" />
              Corporate Sign-In
            </CardTitle>
            <CardDescription>
              Use your corporate credentials to access the system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Corporate Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Authenticating...' : 'Continue with Email'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Button
                variant="outline"
                onClick={() => handleSSO('microsoft')}
                disabled={isLoading}
                className="w-full"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 23 23">
                  <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                  <path fill="#f35325" d="M1 1h10v10H1z"/>
                  <path fill="#81bc06" d="M12 1h10v10H12z"/>
                  <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                  <path fill="#ffba08" d="M12 12h10v10H12z"/>
                </svg>
                Microsoft 365
              </Button>

              <Button
                variant="outline"
                onClick={() => handleSSO('saml')}
                disabled={isLoading}
                className="w-full"
              >
                <Shield className="w-5 h-5 mr-2" />
                SAML SSO
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>Secure authentication powered by Active Directory</p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground">
          <p>© 2024 Valt Intellidoc</p>
          <p>This system is for authorized users only</p>
        </div>
      </div>
    </div>
  );
}