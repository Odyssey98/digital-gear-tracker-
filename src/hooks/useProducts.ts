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

  const addProduct = async (product: Omit<Product, 'id' | 'user_id' | 'created_at'>) => {
    try {
      if (!user?.id) throw new Error('User ID is required');
      
      const dbProduct = {
        id: crypto.randomUUID(),
        user_id: user.id,
        name: product.name,
        category: product.category,
        purpose: product.purpose,
        price: product.price,
        currency: product.currency,
        status: product.status,
        purchase_date: product.purchase_date,
        expected_lifespan: product.expected_lifespan,
        notes: product.notes || '',
        reason_to_buy: product.reason_to_buy || '',
        created_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from('products')
        .insert(dbProduct);

      if (error) throw error;
      
      const frontendProduct = {
        ...dbProduct,
        purchaseDate: dbProduct.purchase_date,
        expectedLifespan: dbProduct.expected_lifespan,
        reasonToBuy: dbProduct.reason_to_buy,
      };
      
      setProducts(prev => [frontendProduct, ...prev]);
      return frontendProduct;
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