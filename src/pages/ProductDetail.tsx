
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Heart, ShoppingCart, ArrowLeft, Star } from 'lucide-react';
import { fetchProductById } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import { cn } from '@/lib/utils';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  const productId = Number(id);
  const isValidProductId = !isNaN(productId) && productId > 0;
  
  const { 
    data: product, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProductById(productId),
    enabled: isValidProductId, // Ensures query only runs when ID is valid
  });

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
    }
  };
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-24 px-4 sm:px-6 lg:px-8 pb-16 container mx-auto max-w-6xl">
          <div className="animate-pulse">
            <div className="h-6 w-24 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="aspect-square bg-gray-200 rounded-xl"></div>
              <div>
                <div className="h-8 w-3/4 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 w-1/4 bg-gray-200 rounded mb-6"></div>
                <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded mb-6"></div>
                <div className="h-10 w-full bg-gray-200 rounded mb-4"></div>
                <div className="h-10 w-full bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-24 px-4 sm:px-6 lg:px-8 pb-16 container mx-auto max-w-6xl">
          <div className="text-center py-20">
            <h2 className="text-2xl font-medium mb-4">Product not found</h2>
            <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <Link to="/">
              <Button>Back to products</Button>
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
        {/* Back button */}
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to products
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="relative bg-secondary/30 rounded-xl p-8 flex items-center justify-center animate-fade-in">
            {!imageLoaded && (
              <div className="absolute inset-0 rounded-xl loading-skeleton" />
            )}
            <img 
              src={product.image} 
              alt={product.title}
              className={cn(
                "max-h-[400px] mx-auto object-contain image-shine",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
          
          {/* Product Info */}
          <div className="flex flex-col animate-slide-up">
            <Badge className="self-start mb-3 uppercase">{product.category}</Badge>
            
            <h1 className="text-3xl font-semibold mb-2">{product.title}</h1>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star 
                    key={index}
                    className={cn(
                      "h-4 w-4",
                      index < Math.round(product.rating.rate) 
                        ? "fill-yellow-400 text-yellow-400" 
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.rating.count} reviews)
              </span>
            </div>
            
            <p className="text-2xl font-bold mb-6">${product.price.toFixed(2)}</p>
            
            <div className="border-t border-b py-6 my-6">
              <p className="text-muted-foreground">{product.description}</p>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button 
                  className="px-3 py-2 hover:bg-secondary transition-colors"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-2 border-x">{quantity}</span>
                <button 
                  className="px-3 py-2 hover:bg-secondary transition-colors"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="flex gap-4 mt-auto">
              <Button 
                onClick={handleAddToCart}
                className="flex-1 rounded-full h-12"
                size="lg"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "h-12 w-12 rounded-full",
                  isInWishlist(product.id) ? "bg-red-50 border-red-200" : ""
                )}
                onClick={() => toggleWishlist(product)}
              >
                <Heart 
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isInWishlist(product.id) ? "fill-red-500 text-red-500" : ""
                  )} 
                />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;