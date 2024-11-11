import { useState } from 'react';
import { PenTool, LogOut, Share2 } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import ProductCard from './ProductCard';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';
import LoginModal from './LoginModal';
import Statistics from './Statistics';
import { Product } from '../types';
import { useProducts } from '../hooks/useProducts';
import { useUser } from '../context/UserContext';
import ShareModal from './ShareModal';
import { useTypedTranslation } from '../utils/i18n';

function AppContent() {
  const { t, tArray } = useTypedTranslation();
  const { user, logout } = useUser();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { products, loading, addProduct, updateProduct, deleteProduct } = useProducts();
  const [showShareModal, setShowShareModal] = useState(false);

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
    if (window.confirm(t('app.confirmDelete'))) {
      deleteProduct(productId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster position="top-right" />
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <PenTool className="h-7 w-7 sm:h-8 sm:w-8 text-indigo-600" />
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {t('app.title')}
                </h1>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={logout}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                  title={t('app.logout')}
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-t pt-4 space-y-4 sm:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <span className="text-lg text-gray-700">
                  {t('app.greeting', { name: user?.name })}
                </span>
                <span className="text-sm text-gray-500 hidden sm:inline">
                  {t('app.slogan')}
                </span>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-3">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 text-white text-sm sm:text-base rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {t('app.addProduct')}
                </button>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="flex-1 sm:flex-none px-4 py-2 border border-gray-200 text-gray-600 text-sm sm:text-base rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                  title={t('app.shareTitle')}
                >
                  <Share2 className="h-4 w-4" />
                  <span>{t('app.share')}</span>
                </button>
              </div>
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
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {t('app.welcome.title')}
              </h3>
              <p className="text-gray-600 mb-6">
                {t('app.welcome.description')}
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center space-x-2"
                >
                  <span>{t('app.welcome.addFirst')}</span>
                  <span className="text-xl">→</span>
                </button>
                <div className="text-sm text-gray-500">
                  <p>{t('app.welcome.benefits.title')}</p>
                  <ul className="mt-2 space-y-1">
                    {tArray('app.welcome.benefits.items').map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
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

      <ShareModal 
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        products={products}
      />
    </div>
  );
}

export default AppContent;