
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import ProductGrid from '@/components/ProductGrid';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  const handleAddToCart = (productId: number) => {
    const product = wishlist.find(item => item.id === productId);
    if (product) {
      addToCart(product);
    }
  };
  
  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-24 px-4 sm:px-6 lg:px-8 pb-16 container mx-auto max-w-6xl">
          <h1 className="text-3xl font-semibold mb-8">Your Wishlist</h1>
          
          <div className="glass-morphism rounded-xl p-8 text-center flex flex-col items-center animate-fade-in">
            <div className="p-4 rounded-full bg-secondary mb-4">
              <Heart className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-medium mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">Save your favorite products to your wishlist for later.</p>
            
            <Link to="/">
              <Button>Discover Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-24 px-4 sm:px-6 lg:px-8 pb-16 container mx-auto max-w-6xl">
        <h1 className="text-3xl font-semibold mb-8">Your Wishlist</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div key={product.id} className="glass-morphism rounded-xl overflow-hidden shadow-sm group animate-scale-in">
              <div className="p-4 relative">
                <div className="absolute top-2 right-2 z-10 flex gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFromWishlist(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <Link to={`/product/${product.id}`} className="block">
                  <div className="aspect-square bg-white rounded-lg p-4 mb-4 flex items-center justify-center">
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  
                  <h3 className="font-medium line-clamp-1 mb-1">{product.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1 mb-3">
                    {product.category}
                  </p>
                </Link>
                
                <div className="flex items-center justify-between">
                  <span className="font-semibold">${product.price.toFixed(2)}</span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => handleAddToCart(product.id)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Wishlist;