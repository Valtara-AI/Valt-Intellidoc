"use client";

import {
    Activity,
    ArrowRight,
    Building2,
    CheckCircle,
    Database,
    Eye,
    Lock,
    MessageSquare,
    Search,
    Shield,
    Zap
} from "lucide-react";
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface HomepageProps {
  onGetStarted: () => void;
}

export function Homepage({ onGetStarted }: HomepageProps) {
  const features = [
    {
      icon: MessageSquare,
      title: "Intelligent Q&A",
      description: "Natural language queries with RAG-powered responses and source citations",
      highlight: "RAG-Enabled"
    },
    {
      icon: Building2,
      title: "SharePoint Integration",
      description: "Seamless access to your enterprise document repositories",
      highlight: "Enterprise Ready"
    },
    {
      icon: Shield,
      title: "Role-Based Access",
      description: "Granular permissions aligned with Active Directory and compliance requirements",
      highlight: "RBAC/AD"
    },
    {
      icon: Eye,
      title: "Full Audit Trail",
      description: "Complete logging and monitoring for regulatory compliance",
      highlight: "Audit Ready"
    },
    {
      icon: Search,
      title: "Advanced Search",
      description: "Sophisticated document discovery with semantic understanding",
      highlight: "AI-Powered"
    },
    {
      icon: Database,
      title: "On-Premises Secure",
      description: "Private deployment ensuring data sovereignty and security",
      highlight: "Enterprise Security"
    }
  ];

  const benefits = [
    {
      role: "Legal Professionals",
      benefits: [
        "Rapid case research and precedent discovery",
        "Contract analysis with citation tracking",
        "Compliance document review automation"
      ]
    },
    {
      role: "Compliance Officers",
      benefits: [
        "Regulatory requirement mapping",
        "Policy document analysis",
        "Risk assessment documentation"
      ]
    },
    {
      role: "Consultants",
      benefits: [
        "Client document intelligence",
        "Knowledge base synthesis",
        "Report generation assistance"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div>
                <Image src="/Valtara_AI_Logo.svg" alt="Valtara AI Logo" width={32} height={32} />
              </div>
              <div>
                <h1 className="font-medium text-foreground">Valt Intellidoc</h1>
                <p className="text-xs text-muted-foreground">Enterprise Document Intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button onClick={onGetStarted} variant="outline">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6">
            Private On-Premises LLM
          </Badge>
          <h1 className="text-4xl font-medium text-foreground mb-6">
            Enterprise Document Intelligence
            <br />
            <span className="text-muted-foreground">Powered by Advanced AI</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Transform your organization&apos;s document workflows with secure, compliant AI assistance. 
            Built for legal professionals, compliance officers, and consultants who demand 
            enterprise-grade security and intelligent document analysis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={onGetStarted} size="lg" className="flex items-center gap-2">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="lg" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Enterprise Security
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-medium text-foreground mb-4">
              Enterprise-Grade Capabilities
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive document intelligence with the security and compliance features 
              your organization requires.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <feature.icon className="w-8 h-8 text-primary" />
                    <Badge variant="secondary" className="text-xs">
                      {feature.highlight}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits by Role */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-medium text-foreground mb-4">
              Built for Knowledge Workers
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tailored capabilities for the professionals who drive organizational intelligence.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl text-center">{category.role}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {category.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-medium text-foreground mb-4">
              Security & Compliance First
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built with enterprise security standards and regulatory compliance in mind.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-6 h-6 text-primary" />
                  <CardTitle>Data Security</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• On-premises deployment</li>
                  <li>• End-to-end encryption</li>
                  <li>• Active Directory integration</li>
                  <li>• Zero data leakage</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-6 h-6 text-primary" />
                  <CardTitle>Audit & Compliance</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Complete audit trails</li>
                  <li>• Regulatory compliance controls</li>
                  <li>• User activity monitoring</li>
                  <li>• Data governance tools</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-medium text-foreground mb-4">
            Ready to Transform Your Document Workflows?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience the power of enterprise-grade document intelligence with 
            the security and compliance your organization demands.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={onGetStarted} size="lg" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Access Your Assistant
            </Button>
            <Button variant="outline" size="lg">
              Contact Enterprise Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <Image src="/Valtara_AI_Logo.svg" alt="Valtara AI Logo" width={24} height={24} />
                <span className="font-medium text-foreground">Valt Intellidoc</span>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <span>© 2025 Valt Intellidoc</span>
              <span>•</span>
              <span>Private & Secure</span>
              <span>•</span>
              <span>On-Premises</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}