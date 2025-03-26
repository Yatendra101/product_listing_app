
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ShoppingBag } from 'lucide-react';
import { 
  fetchProducts, 
  fetchCategories, 
  fetchProductsByCategory,
  Product
} from '@/lib/api';
import Header from '@/components/Header';
import ProductGrid from '@/components/ProductGrid';
import SearchBar from '@/components/SearchBar';
import FilterMenu from '@/components/FilterMenu';

const Index = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || 'all';

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentSort, setCurrentSort] = useState<'price-asc' | 'price-desc' | 'rating'>('rating');

  // Fetch all products with proper error handling
  const { 
    data: products = [], 
    isLoading: isLoadingProducts,
    error: productsError
  } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  // Fetch all categories
  const { 
    data: categories = [],
    isLoading: isLoadingCategories
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // Fetch products by category if a specific category is selected
  const { 
    data: categoryProducts = [],
    isLoading: isLoadingCategoryProducts
  } = useQuery({
    queryKey: ['products', categoryParam],
    queryFn: () => fetchProductsByCategory(categoryParam),
    enabled: categoryParam !== 'all',
  });

  // Filter and sort products based on search query, category, and sort option
  useEffect(() => {
    // Debug info to track what's happening
    console.log("Filter effect running:", {
      productsCount: products.length,
      categoryProductsCount: categoryProducts.length,
      currentSort,
      categoryParam
    });
    
    const productsToFilter = categoryParam === 'all' ? products : categoryProducts;
    
    // Filter by search query
    let filtered = productsToFilter;
    if (queryParam) {
      const searchTerms = queryParam.toLowerCase();
      filtered = productsToFilter.filter(product => 
        product.title.toLowerCase().includes(searchTerms) ||
        product.description.toLowerCase().includes(searchTerms) ||
        product.category.toLowerCase().includes(searchTerms)
      );
    }
    
    // Sort products
    let sorted = [...filtered];
    if (currentSort === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'rating') {
      sorted.sort((a, b) => b.rating.rate - a.rating.rate);
    }
    
    setFilteredProducts(prev => {
      if (JSON.stringify(prev) !== JSON.stringify(sorted)) {
        console.log(`Updating filtered products: ${sorted.length} items`);
        return sorted;
      }
      return prev;
    });
  }, [products, categoryProducts, queryParam, categoryParam, currentSort]);

  const handleSearch = (query: string) => {
    navigate({
      pathname: '/',
      search: `?q=${query}${categoryParam !== 'all' ? `&category=${categoryParam}` : ''}`,
    });
  };

  const handleCategoryChange = (category: string) => {
    navigate({
      pathname: '/',
      search: `?${queryParam ? `q=${queryParam}&` : ''}category=${category}`,
    });
  };

  const isLoading = isLoadingProducts || 
    (categoryParam !== 'all' && isLoadingCategoryProducts) || 
    isLoadingCategories;

  // Debug info
  if (productsError) {
    console.error("Error fetching products:", productsError);
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-24 px-4 sm:px-6 lg:px-8 pb-16 container mx-auto max-w-7xl">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-semibold mb-4 animate-slide-up">
            Discover Quality Products
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Browse our curated collection of premium products designed for your lifestyle
          </p>
        </section>
        
        {/* Search and Filter Section */}
        <section className="mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="glass-morphism rounded-xl p-4 md:p-6 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 md:items-center">
              <SearchBar 
                onSearch={handleSearch} 
                initialQuery={queryParam} 
                className="md:flex-1" 
              />
              
              <div className="flex-shrink-0">
                <FilterMenu 
                  categories={categories}
                  selectedCategory={categoryParam}
                  onSelectCategory={handleCategoryChange}
                  onSortChange={setCurrentSort}
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Products Section */}
        <section>
          <header className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-medium flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              <span>
                {categoryParam !== 'all' 
                  ? categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1) 
                  : 'All Products'}
              </span>
            </h2>
            <p className="text-sm text-muted-foreground">
              {!isLoading && (
                <span>{filteredProducts.length} products</span>
              )}
            </p>
          </header>
          
          <ProductGrid 
            products={filteredProducts} 
            isLoading={isLoading} 
          />
        </section>
      </main>
    </div>
  );
};

export default Index;