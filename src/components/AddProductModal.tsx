import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Product, Currency, UsageStatus } from '../types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: Product) => void;
}

// 预设的类别选项
const CATEGORY_OPTIONS = [
  '手机',
  '电脑',
  '平板',
  '耳机',
  '相机',
  '智能手表',
  '游戏机',
  '其他'
];

// 预设值和类型
const initialFormData = {
  name: '',
  category: '',
  purpose: '',
  price: '',
  currency: 'CNY' as Currency,
  status: '在用' as UsageStatus,
  purchaseDate: new Date().toISOString().split('T')[0], // 默认今天
  expectedLifespan: '1',  // 默认1年
  notes: '',
  reasonToBuy: '',
};

function AddProductModal({ isOpen, onClose, onAdd }: AddProductModalProps) {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (parseFloat(formData.price) <= 0) {
      newErrors.price = '价格必须大于0';
    }
    
    if (parseInt(formData.expectedLifespan) <= 0) {
      newErrors.expectedLifespan = '预期使用年限必须大于0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    onAdd({
      id: Date.now().toString(),
      ...formData,
      price: parseFloat(formData.price) || 0,
      expectedLifespan: parseInt(formData.expectedLifespan) || 1,
      tags
    });
    setFormData(initialFormData);
    setTags([]);
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

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setTags(prev => [...new Set([...prev, tagInput.trim()])]);
      setTagInput('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">添加新产品</h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700"
              aria-label="关闭"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 基本信息组 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">产品名称</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">类别</label>
                <select
                  name="category"
                  required
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="">请选择类别</option>
                  {CATEGORY_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 价格和货币组 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">价格</label>
                <div className="flex">
                  <select
                    name="currency"
                    className="px-2 py-2 border-r-0 rounded-l-lg bg-gray-50"
                    value={formData.currency}
                    onChange={handleInputChange}
                  >
                    <option value="CNY">¥</option>
                    <option value="USD">$</option>
                    <option value="EUR">€</option>
                  </select>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    className={`flex-1 px-3 py-2 border-l-0 rounded-r-lg ${
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
                <label className="block text-sm font-medium text-gray-700 mb-1">购买日期</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">使用状态</label>
                <select
                  name="status"
                  required
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="未开封">未开封</option>
                  <option value="在用">在用</option>
                  <option value="闲置">闲置</option>
                  <option value="已出售">已出售</option>
                  <option value="已报废">已报废</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">预期使用年限</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">用途</label>
              <input
                type="text"
                name="purpose"
                required
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.purpose}
                onChange={handleInputChange}
              />
            </div>

            {/* 标签 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">标签</label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="输入标签后按回车添加"
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => setTags(prev => prev.filter(t => t !== tag))}
                        className="ml-1 text-indigo-600 hover:text-indigo-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 备注信息组 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
                <textarea
                  name="notes"
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={2}
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">购买原因</label>
                <textarea
                  name="reasonToBuy"
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={2}
                  value={formData.reasonToBuy}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              添加产品
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProductModal;