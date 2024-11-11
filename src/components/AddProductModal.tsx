import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Product, UsageStatus } from '../types';
import { useUser } from '../context/UserContext';  // 导入用户上下文
import { getDeviceType } from '../hooks/useDeviceInfo';
import { useTranslation } from 'react-i18next';
import { useCategories } from '../constants/categories';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: Product) => void;
}


// 预设值和类型
const initialFormData = {
  ...getDeviceType(),  // 只预填设备类型相关信息
  price: '',
  status: '在用' as UsageStatus,
  purchaseDate: new Date().toISOString().split('T')[0],
  expectedLifespan: '1',
  notes: '',
  reasonToBuy: '',
};

function AddProductModal({ isOpen, onClose, onAdd }: AddProductModalProps) {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { user } = useUser();  // 获取当前用户信息
  const { t, i18n } = useTranslation();
  const categories = useCategories();

  // 添加货币符号判断
  const currencySymbol = i18n.language.startsWith('zh') ? '¥' : '$';

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (parseFloat(formData.price) <= 0) {
      newErrors.price = t('modal.add.errors.priceRequired');
    }
    
    if (parseInt(formData.expectedLifespan) <= 0) {
      newErrors.expectedLifespan = t('modal.add.errors.lifespanRequired');
    }
    
    if (!formData.purchaseDate) {
      newErrors.purchaseDate = t('modal.add.errors.dateRequired');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !user) return;
    
    // 确保所有必需字段都包含在提交数据中
    const newProduct = {
      id: Date.now().toString(),
      user_id: user.id,
      name: formData.name,
      category: formData.category,
      purpose: formData.purpose,
      price: parseFloat(formData.price) || 0,
      status: formData.status,
      purchase_date: formData.purchaseDate,  // 必需字段
      expected_lifespan: parseInt(formData.expectedLifespan) || 1,  // 必需字段
      notes: formData.notes || '',
      reason_to_buy: formData.reasonToBuy || '',
      created_at: new Date().toISOString(),
    };
  
    onAdd(newProduct);
    setFormData(initialFormData);
    onClose();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">{t('modal.add.title')}</h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700"
              aria-label={t('modal.add.close')}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 基本信息组 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('product.name')}
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('product.category')}
                </label>
                <select
                  name="category"
                  required
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="">{t('modal.form.selectCategory')}</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 价格和货币组 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('product.price')}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">{currencySymbol}</span>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    className={`w-full pl-8 pr-3 py-2 border rounded-lg ${
                      errors.price ? 'border-red-500' : ''
                    }`}
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('product.purchaseDate')}
                </label>
                <input
                  type="date"
                  name="purchaseDate"
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.purchaseDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* 使用状态和进度组 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('modal.form.status')}
                </label>
                <select
                  name="status"
                  required
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="unused">{t('status.unused')}</option>
                  <option value="inUse">{t('status.inUse')}</option>
                  <option value="idle">{t('status.idle')}</option>
                  <option value="sold">{t('status.sold')}</option>
                  <option value="scrapped">{t('status.scrapped')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('product.expectedLifespan')}
                </label>
                <input
                  type="number"
                  name="expectedLifespan"
                  required
                  min="1"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.expectedLifespan}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* 用途 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('product.purpose')}
              </label>
              <input
                type="text"
                name="purpose"
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.purpose}
                onChange={handleInputChange}
              />
            </div>

            {/* 备注信息组 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('product.notes')} <span className="text-gray-400 text-xs">{t('modal.form.notes.optional')}</span>
                </label>
                <textarea
                  name="notes"
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={2}
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder={t('modal.form.notes.placeholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('product.reasonToBuy')} <span className="text-gray-400 text-xs">{t('modal.form.reasonToBuy.optional')}</span>
                </label>
                <textarea
                  name="reasonToBuy"
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={2}
                  value={formData.reasonToBuy}
                  onChange={handleInputChange}
                  placeholder={t('modal.form.reasonToBuy.placeholder')}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {t('modal.add.submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProductModal;