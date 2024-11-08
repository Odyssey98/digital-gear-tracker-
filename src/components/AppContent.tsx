import { useState } from 'react';
import { PenTool, LogOut } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import ProductCard from './ProductCard';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';
import LoginModal from './LoginModal';
import Statistics from './Statistics';
import { Product } from '../types';
import { useProducts } from '../hooks/useProducts';
import { useUser } from '../context/UserContext';
import { useDeviceInfo } from '../hooks/useDeviceInfo';

function AppContent() {
  const { user, logout } = useUser();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { products, loading, addProduct, updateProduct, deleteProduct } = useProducts();
  useDeviceInfo();

  if (!user) {
    return <LoginModal />;
  }

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
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.name}
              </span>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                添加产品
              </button>
              <button
                onClick={logout}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                title="退出登录"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Statistics products={products} />
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
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
        )}
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

export default AppContent;