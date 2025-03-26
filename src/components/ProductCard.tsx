
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };
  
  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 border border-border/40 h-full",
        isHovered ? "shadow-md scale-[1.02]" : "shadow-sm"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="block h-full">
        <div className="relative pt-[100%] overflow-hidden bg-secondary/30">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center loading-skeleton" />
          )}
          <img
            src={product.image}
            alt={product.title}
            className={cn(
              "absolute inset-0 w-full h-full object-contain p-6 transition-opacity duration-500",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />
          
          <div className={cn(
            "absolute top-2 right-2 flex flex-col gap-2 transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full shadow-sm hover:shadow-md h-9 w-9"
              onClick={handleToggleWishlist}
            >
              <Heart 
                className={cn(
                  "h-4 w-4 transition-all", 
                  isInWishlist(product.id) ? "fill-red-500 text-red-500" : ""
                )} 
              />
            </Button>
            
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full shadow-sm hover:shadow-md h-9 w-9"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="flex flex-col h-full">
            <div className="flex items-center mb-2">
              <span className="text-xs font-medium px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full">
                {product.category}
              </span>
              <div className="ml-auto flex items-center">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="text-xs font-medium">{product.rating.rate}</span>
              </div>
            </div>
            
            <h3 className="font-medium leading-tight mb-1 line-clamp-2">{product.title}</h3>
            
            <div className="mt-auto pt-2 flex items-center justify-between">
              <span className="font-semibold">${product.price.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProductCard;