import { useEffect, useState } from "react";
import { AdminConsole } from "./components/AdminConsole";
import { AdvancedSearch } from "./components/AdvancedSearch";
import { AppShell } from "./components/AppShell";
import { AuditLogs } from "./components/AuditLogs";
import { ChatInterface } from "./components/ChatInterface";
import { Dashboard } from "./components/Dashboard";
import { DocumentViewer } from "./components/DocumentViewer";
import { Homepage } from "./components/Homepage";
import { ModelOps } from "./components/ModelOps";
import { Profile } from "./components/Profile";
import { RBACMatrix } from "./components/RBACMatrix";
import { Settings } from "./components/Settings";
import { SignIn } from "./components/SignIn";
import { SignOut } from "./components/SignOut";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  permissions: string[];
  avatar?: string;
}

export default function App() {
  const [activeView, setActiveView] = useState("homepage");
  const [selectedDocument, setSelectedDocument] =
    useState(null);
  const [user, setUser] = useState<User | null>(null);
  const [showSignOut, setShowSignOut] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Mock session check - in real app, this would validate with backend
        const storedUser = localStorage.getItem("valtIntellodocUser");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Session check failed:", error);
        localStorage.removeItem("valtIntellodocUser");
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleSignIn = (userData: User) => {
    setUser(userData);
    // Store user session - in real app, this would be handled by secure session management
    localStorage.setItem(
      "valtIntellodocUser",
      JSON.stringify(userData),
    );
    setActiveView("dashboard");
    setShowSignIn(false);
  };

  const handleGetStarted = () => {
    setShowSignIn(true);
  };

  const handleBackToHome = () => {
    setShowSignIn(false);
    setActiveView("homepage");
  };

  const handleSignOut = () => {
    setShowSignOut(true);
  };

  const handleConfirmSignOut = () => {
    setUser(null);
    setActiveView("homepage");
    setShowSignOut(false);
    setShowSignIn(false);
    localStorage.removeItem("valtIntellodocUser");
  };

  const handleCancelSignOut = () => {
    setShowSignOut(false);
  };

  const renderContent = () => {
    switch (activeView) {
      case "homepage":
        return <Homepage onGetStarted={handleGetStarted} />;
      case "dashboard":
        return <Dashboard onNavigate={setActiveView} />;
      case "chat":
        return (
          <ChatInterface onViewDocument={setSelectedDocument} />
        );
      case "documents":
        return (
          <DocumentViewer selectedDocument={selectedDocument} />
        );
      case "search":
        return (
          <AdvancedSearch
            onViewDocument={setSelectedDocument}
          />
        );
      case "rbac":
        return <RBACMatrix />;
      case "audit":
        return <AuditLogs />;
      case "admin":
        return <AdminConsole />;
      case "model-ops":
        return <ModelOps />;
      case "settings":
        return <Settings />;
      case "profile":
        return (
          <Profile user={user!} onSignOut={handleSignOut} />
        );
      default:
        return <Homepage onGetStarted={handleGetStarted} />;
    }
  };

  // Show loading spinner while checking session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show sign-in page if requested and not authenticated
  if (!user && showSignIn) {
    return <SignIn onSignIn={handleSignIn} onBack={handleBackToHome} />;
  }

  // Show homepage if not authenticated and sign-in not requested
  if (!user) {
    return <Homepage onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <AppShell
        activeView={activeView}
        onNavigate={setActiveView}
        user={user}
        onSignOut={handleSignOut}
      >
        {renderContent()}
      </AppShell>

      {/* Sign-out confirmation modal */}
      {showSignOut && (
        <SignOut
          onConfirmSignOut={handleConfirmSignOut}
          onCancel={handleCancelSignOut}
        />
      )}
    </div>
  );
}