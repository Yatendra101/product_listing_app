
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, Search, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Header = () => {
  const { totalItems } = useCart();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Add scroll event listener to detect when the user scrolls
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Wishlist', path: '/wishlist' },
    { name: 'Cart', path: '/cart' },
  ];
  
  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 flex items-center justify-between",
        isScrolled ? "glass-morphism shadow-sm" : "bg-transparent"
      )}
    >
      <Link to="/" className="flex items-center gap-2">
        <h1 className="text-xl font-semibold">Store</h1>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8">
        {navItems.map(item => (
          <Link 
            key={item.path} 
            to={item.path}
            className={cn(
              "transition-all duration-300 hover:text-primary/80",
              location.pathname === item.path ? "font-medium" : "font-normal text-muted-foreground"
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Desktop Actions */}
      <div className="hidden md:flex items-center gap-4">
        <Link to="/search">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Search className="h-5 w-5" />
          </Button>
        </Link>
        <Link to="/wishlist">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Heart className="h-5 w-5" />
          </Button>
        </Link>
        <Link to="/cart" className="relative">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 rounded-full"
              >
                {totalItems}
              </Badge>
            )}
          </Button>
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 glass-morphism shadow-lg p-4 md:hidden animate-slide-down">
          <nav className="flex flex-col gap-4">
            {navItems.map(item => (
              <Link 
                key={item.path} 
                to={item.path}
                className={cn(
                  "flex items-center gap-2 py-2 px-4 rounded-md transition-all",
                  location.pathname === item.path 
                    ? "bg-accent text-accent-foreground" 
                    : "text-muted-foreground hover:bg-accent/50"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name === 'Home' && <Search className="h-4 w-4" />}
                {item.name === 'Wishlist' && <Heart className="h-4 w-4" />}
                {item.name === 'Cart' && (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    {totalItems > 0 && (
                      <Badge className="ml-auto">{totalItems}</Badge>
                    )}
                  </>
                )}
                {item.name}
              </Link>
            ))}
            <Link 
              to="/search"
              className="flex items-center gap-2 py-2 px-4 rounded-md text-muted-foreground hover:bg-accent/50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Search className="h-4 w-4" />
              Search
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;