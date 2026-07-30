import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Sparkles, ChevronDown } from "lucide-react";
import Button from "../ui/Button";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Product", href: "#product" },
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "About", href: "#about" },
    { name: "Resources", href: "#resources", dropdown: true },
  ];

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-[var(--bg)]/95 backdrop-blur-xl"
          : "bg-[var(--bg)]/80 backdrop-blur-lg"
      }`}
    >
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Sparkles className="text-violet-400" size={22} />
          <span className="text-xl font-semibold tracking-tight text-[var(--text)]">
            FounderOS
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-9">
          {navLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="flex items-center gap-1 text-[15px] font-medium text-[var(--muted)] transition-colors duration-300 hover:text-white"
            >
              {item.name}
              {item.dropdown && <ChevronDown size={14} />}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link to="/login">
            <Button variant="secondary">Sign in</Button>
          </Link>
          <Link to="/workspace">
            <Button variant="primary">Get Started</Button>
          </Link>
        </div>

        <button className="lg:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-[var(--bg)] lg:hidden">
          <div className="flex flex-col gap-5 px-6 py-6">
            {navLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="font-medium text-[var(--text)]"
              >
                {item.name}
              </a>
            ))}
            <Link to="/login">
              <Button variant="secondary" fullWidth>
                Sign in
              </Button>
            </Link>
            <Link to="/workspace">
              <Button variant="primary" fullWidth>
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
