import { CheckCircle, Shield } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface SignOutProps {
  onConfirmSignOut: () => void;
  onCancel: () => void;
}

export function SignOut({ onConfirmSignOut, onCancel }: SignOutProps) {
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    
    // Mock sign-out process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onConfirmSignOut();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 mb-4">
            <Image src="/Valtara_AI_Logo.svg" alt="Valtara AI Logo" width={48} height={48} />
          </div>
          <CardTitle>Sign Out</CardTitle>
          <CardDescription>
            Are you sure you want to sign out of your session?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Your session will be securely terminated and any unsaved work may be lost.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-green-600" />
              All document access will be revoked
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Session activity will be logged for audit
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-green-600" />
              You can sign back in anytime
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={onCancel}
              disabled={isSigningOut}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex-1"
            >
              {isSigningOut ? 'Signing Out...' : 'Sign Out'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}