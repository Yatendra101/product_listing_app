
import { useState, useEffect } from 'react';
import { Check, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Category } from '@/lib/api';

interface FilterMenuProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onSortChange: (sort: 'price-asc' | 'price-desc' | 'rating') => void;
  className?: string;
}

const FilterMenu = ({ 
  categories = [], 
  selectedCategory, 
  onSelectCategory,
  onSortChange,
  className 
}: FilterMenuProps) => {
  const [displayCategories, setDisplayCategories] = useState<string[]>([]);
  const [currentSort, setCurrentSort] = useState<'price-asc' | 'price-desc' | 'rating'>('rating');
  
  useEffect(() => {
    setDisplayCategories(prev => {
      if (!categories.includes('all')) {
        const updatedCategories = ['all', ...categories];
        return JSON.stringify(prev) !== JSON.stringify(updatedCategories) ? updatedCategories : prev;
      }
      return JSON.stringify(prev) !== JSON.stringify(categories) ? [...categories] : prev;
    });
  }, [categories]);
  
  const formatCategoryName = (category: string) => {
    if (category === 'all') return 'All Products';
    return category
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const handleSortChange = (sort: 'price-asc' | 'price-desc' | 'rating') => {
    setCurrentSort(sort);
    onSortChange(sort);
  };

  return (
    <div className={cn("flex flex-wrap gap-3 items-center", className)}>
      <div className="mr-2 text-sm font-medium text-muted-foreground">Filters:</div>
      
      {/* Category Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="rounded-full">
            <span className="mr-1">Category</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {displayCategories.map((category) => (
            <DropdownMenuItem
              key={category}
              className={cn(
                "flex items-center justify-between",
                selectedCategory === category ? "bg-secondary" : ""
              )}
              onClick={() => onSelectCategory(category)}
            >
              {formatCategoryName(category)}
              {selectedCategory === category && <Check className="h-4 w-4 ml-2" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Sort Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="rounded-full">
            <SlidersHorizontal className="h-4 w-4 mr-1" />
            <span className="mr-1">Sort</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuItem
            className={cn(
              "flex items-center justify-between",
              currentSort === 'rating' ? "bg-secondary" : ""
            )}
            onClick={() => handleSortChange('rating')}
          >
            Best Rating
            {currentSort === 'rating' && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
          <DropdownMenuItem
            className={cn(
              "flex items-center justify-between",
              currentSort === 'price-asc' ? "bg-secondary" : ""
            )}
            onClick={() => handleSortChange('price-asc')}
          >
            Price: Low to High
            {currentSort === 'price-asc' && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
          <DropdownMenuItem
            className={cn(
              "flex items-center justify-between",
              currentSort === 'price-desc' ? "bg-secondary" : ""
            )}
            onClick={() => handleSortChange('price-desc')}
          >
            Price: High to Low
            {currentSort === 'price-desc' && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FilterMenu;