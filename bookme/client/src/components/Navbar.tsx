import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

/**
 * Navbar Component
 * Design: Dark theme with gradient accents
 * - Logo "BookMe" on the left
 * - Navigation links (Funcionalidades, Preços, FAQ)
 * - CTA button "Comece Grátis"
 * - Mobile menu toggle
 */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            BookMe
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection("features")}
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            Funcionalidades
          </button>
          <button
            onClick={() => scrollToSection("pricing")}
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            Preços
          </button>
          <button
            onClick={() => scrollToSection("faq")}
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            FAQ
          </button>
        </div>

        {/* CTA Button */}
        <div className="hidden md:flex">
          <Button
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
            onClick={() => scrollToSection("cta")}
          >
            Comece Grátis
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="container py-4 space-y-4">
            <button
              onClick={() => scrollToSection("features")}
              className="block w-full text-left text-foreground/80 hover:text-foreground transition-colors py-2"
            >
              Funcionalidades
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="block w-full text-left text-foreground/80 hover:text-foreground transition-colors py-2"
            >
              Preços
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="block w-full text-left text-foreground/80 hover:text-foreground transition-colors py-2"
            >
              FAQ
            </button>
            <Button
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
              onClick={() => scrollToSection("cta")}
            >
              Comece Grátis
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
