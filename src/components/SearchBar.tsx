
import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
  className?: string;
  placeholder?: string;
}

const SearchBar = ({ 
  onSearch, 
  initialQuery = '', 
  className,
  placeholder = 'Search for products...'
}: SearchBarProps) => {
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  
  // When initialQuery changes externally
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);
  
  const handleClear = () => {
    setQuery('');
    onSearch('');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };
  
  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn(
        "relative flex items-center transition-all duration-300 w-full",
        isFocused ? "scale-[1.02]" : "",
        className
      )}
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-10 h-11 rounded-full border-secondary-foreground/10 focus-visible:ring-2 focus-visible:ring-offset-1 bg-secondary/50"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full hover:bg-secondary-foreground/10"
            onClick={handleClear}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      <Button 
        type="submit"
        variant="default"
        size="sm"
        className="ml-2 rounded-full hover:shadow"
      >
        Search
      </Button>
    </form>
  );
};

export default SearchBar;