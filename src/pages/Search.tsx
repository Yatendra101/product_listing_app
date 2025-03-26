
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { X, Search as SearchIcon } from 'lucide-react';
import { fetchProducts, Product } from '@/lib/api';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import ProductGrid from '@/components/ProductGrid';

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryParam = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  const { 
    data: products = [], 
    isLoading 
  } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
  
  useEffect(() => {
    if (!isLoading && queryParam) {
      const searchTerms = queryParam.toLowerCase();
      const filtered = products.filter(product => 
        product.title.toLowerCase().includes(searchTerms) ||
        product.description.toLowerCase().includes(searchTerms) ||
        product.category.toLowerCase().includes(searchTerms)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [products, queryParam, isLoading]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    navigate({
      pathname: '/search',
      search: query ? `?q=${query}` : '',
    });
  };
  
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-24 px-4 sm:px-6 lg:px-8 pb-16 container mx-auto max-w-6xl">
        <div className="mb-8 max-w-2xl mx-auto">
          <SearchBar 
            onSearch={handleSearch} 
            initialQuery={queryParam} 
            placeholder="Search for products by name, description, or category..."
          />
        </div>
        
        {queryParam ? (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium flex items-center gap-2">
                <SearchIcon className="h-5 w-5" />
                Search Results for "{queryParam}"
              </h2>
              {!isLoading && (
                <span className="text-sm text-muted-foreground">
                  {filteredProducts.length} results
                </span>
              )}
            </div>
            
            {filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} isLoading={isLoading} />
            ) : !isLoading && (
              <div className="text-center py-16">
                <div className="p-4 rounded-full bg-secondary inline-flex mb-4">
                  <X className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  We couldn't find any products matching "{queryParam}".
                  Try using different keywords or browse our categories.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 animate-fade-in">
            <div className="p-4 rounded-full bg-secondary inline-flex mb-4">
              <SearchIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-medium mb-2">Search for products</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Type in the search box above to find products by name, description, or category.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Search;