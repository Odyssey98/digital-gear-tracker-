import {  Laptop, Trash2, Edit } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onDelete: () => void;
  onEdit: () => void;
}

function ProductCard({ product, onDelete, onEdit }: ProductCardProps) {
  const getDaysOwned = (purchaseDate: string) => {
    const purchase = new Date(purchaseDate);
    const today = new Date();
    const diff = today.getTime() - purchase.getTime();
    return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)));
  };

  const daysOwned = getDaysOwned(product.purchaseDate);
  const costPerDay = daysOwned ? (product.price / daysOwned).toFixed(1) : product.price.toFixed(1);
  const expectedCostPerDay = (product.price / (product.expectedLifespan * 365)).toFixed(1);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
          <div className="flex items-center space-x-2">
            <Laptop className="h-6 w-6 text-indigo-600" />
            <button
              onClick={onEdit}
              className="p-1 text-gray-400 hover:text-indigo-500 rounded-full hover:bg-gray-100"
              title="编辑产品"
            >
              <Edit className="h-5 w-5" />
            </button>
            <button
              onClick={onDelete}
              className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
              title="删除产品"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">类别</span>
            <span className="font-medium">{product.category}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">用途</span>
            <span className="font-medium">{product.purpose}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">价格</span>
            <span className="font-medium">¥{product.price.toFixed(2)}</span>
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">使用进度</span>
              <span className="text-sm font-medium">{product.usageProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full"
                style={{ width: `${product.usageProgress}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">当前均值</p>
              <p className="font-semibold">
                ¥{daysOwned === 1 ? product.price.toFixed(1) : costPerDay}/天
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">期待均值</p>
              <p className="font-semibold">¥{expectedCostPerDay}/天</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm pt-4">
            <span className="text-gray-500">拥有天数</span>
            <span className="font-medium">{daysOwned}天</span>
          </div>

          {(product.notes || product.reasonToBuy) && (
            <div className="pt-4 border-t space-y-3">
              {product.notes && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">备注</p>
                  <p className="text-sm">{product.notes}</p>
                </div>
              )}
              {product.reasonToBuy && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">购买原因</p>
                  <p className="text-sm">{product.reasonToBuy}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;