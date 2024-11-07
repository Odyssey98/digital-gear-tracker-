import  { useState } from 'react';
import { PenTool } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import ProductCard from './components/ProductCard';
import AddProductModal from './components/AddProductModal';
import EditProductModal from './components/EditProductModal';
import { Product } from './types';
import { useProducts } from './hooks/useProducts';
import { useDeviceInfo } from './hooks/useDeviceInfo';

function App() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { products, addProduct, updateProduct, deleteProduct } = useProducts([]);

  useDeviceInfo();

  const handleAddProduct = (product: Product) => {
    addProduct(product);
    setShowAddModal(false);
  };

  const handleEditProduct = (product: Product) => {
    updateProduct(product);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('确定要删除这个产品吗？')) {
      deleteProduct(productId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster position="top-right" />
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <PenTool className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">用时宝</h1>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              添加产品
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              onDelete={() => handleDeleteProduct(product.id)}
              onEdit={() => setEditingProduct(product)}
            />
          ))}
        </div>
      </main>

      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddProduct}
      />

      {editingProduct && (
        <EditProductModal
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          onEdit={handleEditProduct}
          product={editingProduct}
        />
      )}
    </div>
  );
}

export default App;