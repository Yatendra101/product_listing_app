
import { useEffect, useState, useRef } from 'react';
import { Product } from '@/lib/api';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

const ProductGrid = ({ products, isLoading = false }: ProductGridProps) => {
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const animationRef = useRef<boolean>(false);
  
  useEffect(() => {
    // Reset visible products when products array changes or loading state changes
    if (isLoading) {
      setVisibleProducts([]);
      animationRef.current = false;
      return;
    }
    
    // If products are available and animation hasn't run yet
    if (products.length > 0 && !animationRef.current) {
      animationRef.current = true; // Mark animation as started
      
      // Simulate staggered animation by releasing products in batches
      const displayProducts = async () => {
        const batchSize = 4;
        let currentBatch = 0;
        
        while (currentBatch * batchSize < products.length) {
          const endIndex = Math.min((currentBatch + 1) * batchSize, products.length);
          setVisibleProducts(products.slice(0, endIndex));
          currentBatch++;
          
          // Wait before showing next batch
          if (endIndex < products.length) {
            await new Promise(resolve => setTimeout(resolve, 150));
          }
        }
      };
      
      displayProducts();
    } else if (products.length === 0) {
      setVisibleProducts([]);
      animationRef.current = false;
    }
  }, [products, isLoading]);
  
  // Check if we need to immediately show all products (e.g., if products change after animation already ran)
  useEffect(() => {
    if (animationRef.current && visibleProducts.length !== products.length && products.length > 0) {
      setVisibleProducts(products);
    }
  }, [products, visibleProducts.length]);
  
  if (isLoading) {
    // Display skeleton loading state
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-[350px] rounded-lg loading-skeleton" />
        ))}
      </div>
    );
  }
  
  if (visibleProducts.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-medium text-muted-foreground">No products found</h3>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {visibleProducts.map((product, index) => (
        <div 
          key={product.id} 
          className="animate-scale-in"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;