import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useUser } from '../context/UserContext';
import { Product } from '../types';

export function useProducts() {
  const { user } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // 加载产品
  useEffect(() => {
    if (user) {
      loadProducts();
    }
  }, [user]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product: Omit<Product, 'id' | 'user_id'>) => {
    try {
      if (!user?.id) throw new Error('User ID is required');
      
      const newProduct = {
        name: product.name,
        category: product.category,
        purpose: product.purpose,
        price: product.price,
        currency: product.currency,
        status: product.status,
        notes: product.notes,
        id: crypto.randomUUID(),
        user_id: user.id,
        created_at: new Date().toISOString(),
        purchase_date: product.purchaseDate,
        expected_lifespan: product.expectedLifespan
      };

      const { error } = await supabase
        .from('products')
        .insert(newProduct);

      if (error) throw error;
      
      const frontendProduct = {
        ...newProduct,
        purchaseDate: newProduct.purchase_date,
        expectedLifespan: newProduct.expected_lifespan,
        purchase_date: undefined,
        expected_lifespan: undefined
      };
      
      setProducts(prev => [frontendProduct, ...prev]);
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const updateProduct = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update(product)
        .eq('id', product.id)
        .eq('user_id', user?.id);

      if (error) throw error;
      setProducts(prev => 
        prev.map(p => p.id === product.id ? product : p)
      );
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)
        .eq('user_id', user?.id);

      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  return { 
    products, 
    loading, 
    addProduct, 
    updateProduct, 
    deleteProduct 
  };
}