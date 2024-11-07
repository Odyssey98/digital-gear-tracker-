
import { toast } from 'react-hot-toast';
import { Product } from '../types';
import { useLocalStorage } from './useLocalStorage';

export function useProducts(initialProducts: Product[] = []) {
  const [products, setProducts] = useLocalStorage<Product[]>('products', initialProducts);

  const addProduct = async (product: Product) => {
    try {
      const newProduct = {
        ...product,
        id: Date.now().toString(),
      };
      setProducts(prev => [...prev, newProduct]);
      toast.success('产品添加成功');
    } catch (error) {
      toast.error('添加产品失败');
      console.error('Error adding product:', error);
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    try {
      setProducts(prev => 
        prev.map(p => p.id === updatedProduct.id ? updatedProduct : p)
      );
      toast.success('产品更新成功');
    } catch (error) {
      toast.error('更新产品失败');
      console.error('Error updating product:', error);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast.success('产品删除成功');
    } catch (error) {
      toast.error('删除产品失败');
      console.error('Error deleting product:', error);
    }
  };

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}