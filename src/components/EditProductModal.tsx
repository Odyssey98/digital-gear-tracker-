import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Product, UsageStatus } from '../types';
import { useTranslation } from 'react-i18next';
import { useCategories } from '../constants/categories';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (product: Product) => void;
  product: Product | null;
}

function EditProductModal({ isOpen, onClose, onEdit, product }: EditProductModalProps) {
  const { t, i18n } = useTranslation();
  const categories = useCategories();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    purpose: '',
    price: '',
    status: '在用' as UsageStatus,
    purchaseDate: '',
    expectedLifespan: '',
    notes: '',
    reasonToBuy: '',
  });
  const currencySymbol = i18n.language.startsWith('zh') ? '¥' : '$';

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || '',
        purpose: product.purpose || '',
        price: product.price?.toString() || '',
        status: product.status || t('status.inUse'),
        purchaseDate: product.purchase_date || '',  
        expectedLifespan: product.expected_lifespan?.toString() || '',  
        notes: product.notes || '',
        reasonToBuy: product.reason_to_buy || '',  
      });
    } else {
      // 重置表单
      setFormData({
        name: '',
        category: '',
        purpose: '',
        price: '',
        status: t('status.inUse') as UsageStatus,
        purchaseDate: '',
        expectedLifespan: '',
        notes: '',
        reasonToBuy: '',
      });
    }
  }, [product, t]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    
    // 转换数据格式以匹配数据库字段名
    onEdit({
      ...product,
      name: formData.name,
      category: formData.category,
      purpose: formData.purpose,
      price: parseFloat(formData.price),
      status: formData.status,
      purchase_date: formData.purchaseDate,   
      expected_lifespan: parseInt(formData.expectedLifespan),  
      notes: formData.notes || '',
      reason_to_buy: formData.reasonToBuy || '',
    });
    onClose();
  };

  if (!isOpen || !product) return null;

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center p-4 z-50 transition-all duration-300 ease-out
        ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
    >
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">{t('modal.edit.title')}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('modal.form.name')}
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('modal.form.category')}
                </label>
                <select
                  required
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">{t('modal.form.selectCategory')}</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('modal.form.price')}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    required
                    step="0.01"
                    className="w-full pl-8 pr-3 py-2 border rounded-lg"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('modal.form.status')}
                </label>
                <select
                  required
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as UsageStatus })}
                >
                  <option value="unused">{t('status.unused')}</option>
                  <option value="inUse">{t('status.inUse')}</option>
                  <option value="idle">{t('status.idle')}</option>
                  <option value="sold">{t('status.sold')}</option>
                  <option value="scrapped">{t('status.scrapped')}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('modal.form.purchaseDate')}
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('modal.form.expectedLifespan')}
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.expectedLifespan}
                  onChange={(e) => setFormData({ ...formData, expectedLifespan: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('modal.form.notes.label')} 
                  <span className="text-gray-400 text-xs">
                    {t('modal.form.notes.optional')}
                  </span>
                </label>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={t('modal.form.notes.placeholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('modal.form.reasonToBuy.label')}
                  <span className="text-gray-400 text-xs">
                    {t('modal.form.reasonToBuy.optional')}
                  </span>
                </label>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={2}
                  value={formData.reasonToBuy}
                  onChange={(e) => setFormData({ ...formData, reasonToBuy: e.target.value })}
                  placeholder={t('modal.form.reasonToBuy.placeholder')}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('modal.form.purpose')}
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {t('modal.edit.submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProductModal;