import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Product, Currency, UsageStatus } from '../types';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (product: Product) => void;
  product: Product | null;
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

function EditProductModal({ isOpen, onClose, onEdit, product }: EditProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    purpose: '',
    price: '',
    currency: 'CNY' as Currency,
    status: '在用' as UsageStatus,
    purchaseDate: '',
    expectedLifespan: '',
    notes: '',
    reasonToBuy: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || '',
        purpose: product.purpose || '',
        price: product.price?.toString() || '',
        currency: product.currency || 'CNY',
        status: product.status || '在用',
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
        currency: 'CNY',
        status: '在用',
        purchaseDate: '',
        expectedLifespan: '',
        notes: '',
        reasonToBuy: '',
      });
    }
  }, [product]);

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
      currency: formData.currency,
      status: formData.status,
      purchase_date: formData.purchaseDate,   
      expected_lifespan: parseInt(formData.expectedLifespan),  
      notes: formData.notes,
      reason_to_buy: formData.reasonToBuy,  
    });
    onClose();
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">编辑产品</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">产品名称</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">类别</label>
                <select
                  required
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">请选择类别</option>
                  {CATEGORY_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">价格</label>
                <div className="flex">
                  <select
                    className="px-2 py-2 border-r-0 rounded-l-lg bg-gray-50"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value as Currency })}
                  >
                    <option value="CNY">¥</option>
                    <option value="USD">$</option>
                    <option value="EUR">€</option>
                  </select>
                  <input
                    type="number"
                    required
                    step="0.01"
                    className="flex-1 px-3 py-2 border-l-0 rounded-r-lg"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">使用状态</label>
                <select
                  required
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as UsageStatus })}
                >
                  <option value="未开封">未开封</option>
                  <option value="在用">在用</option>
                  <option value="闲置">闲置</option>
                  <option value="已出售">已出售</option>
                  <option value="已报废">已报废</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">购买日期</label>
                <input
                  type="date"
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">预期使用年限</label>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
              <textarea
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">购买原因</label>
              <textarea
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
                value={formData.reasonToBuy}
                onChange={(e) => setFormData({ ...formData, reasonToBuy: e.target.value })}
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              保存修改
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProductModal;