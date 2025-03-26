
export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: {
      rate: number;
      count: number;
    };
  }
  
  export interface CartItem extends Product {
    quantity: number;
  }
  
  export type Category = 'electronics' | 'jewelery' | "men's clothing" | "women's clothing" | 'all';
  
  const BASE_URL = 'https://fakestoreapi.com';
  
  export const fetchProducts = async (): Promise<Product[]> => {
    console.log("Fetching all products...");
    try {
      const response = await fetch(`${BASE_URL}/products?limit=20`); // Ensure we get all products, not just the default limit
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log(`Successfully fetched ${data.length} products`);
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  };
  
  export const fetchProductById = async (id: number): Promise<Product | null> => {
    try {
      const response = await fetch(`${BASE_URL}/products/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch product with id ${id}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching product with id ${id}:`, error);
      return null;
    }
  };
  
  export const fetchCategories = async (): Promise<string[]> => {
    try {
      const response = await fetch(`${BASE_URL}/products/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  };
  
  export const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
    if (category === 'all') {
      return fetchProducts();
    }
    
    try {
      const response = await fetch(`${BASE_URL}/products/category/${category}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch products in category ${category}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching products in category ${category}:`, error);
      return [];
    }
  };