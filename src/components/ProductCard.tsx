import { 
  Laptop, 
  Smartphone, 
  Tablet, 
  Headphones, 
  Camera, 
  Watch, 
  Gamepad, 
  Package,
  Trash2, 
  Edit 
} from 'lucide-react';
import { Product } from '../types';
import { useTranslation } from 'react-i18next';

interface ProductCardProps {
  product: Product;
  onDelete: () => void;
  onEdit: () => void;
}

// 添加图标映射
const categoryIcons: Record<string, React.ReactNode> = {
  '手机': <Smartphone className="h-6 w-6 text-indigo-600" />,
  '电脑': <Laptop className="h-6 w-6 text-indigo-600" />,
  '平板': <Tablet className="h-6 w-6 text-indigo-600" />,
  '耳机': <Headphones className="h-6 w-6 text-indigo-600" />,
  '相机': <Camera className="h-6 w-6 text-indigo-600" />,
  '智能手表': <Watch className="h-6 w-6 text-indigo-600" />,
  '游戏机': <Gamepad className="h-6 w-6 text-indigo-600" />,
  '其他': <Package className="h-6 w-6 text-indigo-600" />
};

function ProductCard({ product, onDelete, onEdit }: ProductCardProps) {
  const { t } = useTranslation();
  const { i18n } = useTranslation();

  const getDaysOwned = (purchaseDate: string) => {
    const purchase = new Date(purchaseDate);
    const today = new Date();
    const diff = today.getTime() - purchase.getTime();
    return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)));
  };

  const daysOwned = getDaysOwned(product.purchase_date);
  const costPerDay = daysOwned ? (product.price / daysOwned).toFixed(1) : product.price.toFixed(1);
  const expectedCostPerDay = (product.price / (product.expected_lifespan * 365)).toFixed(1);

  const calculateProgress = (purchaseDate: string, expectedLifespan: number) => {
    const startDate = new Date(purchaseDate);
    const today = new Date();
    const totalDays = expectedLifespan * 365;
    const usedDays = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const progress = Math.min(100, Math.round((usedDays / totalDays) * 100));
    
    return {
      progress,
      message: getProgressMessage(progress)
    };
  };

  const getProgressMessage = (progress: number) => {
    if (progress >= 100) return t('product.progress.status.exceeded');
    if (progress >= 80) return t('product.progress.status.nearEnd');
    if (progress >= 50) return t('product.progress.status.halfUsed');
    if (progress >= 20) return t('product.progress.status.good');
    return t('product.progress.status.new');
  };

  const { progress, message } = calculateProgress(product.purchase_date, product.expected_lifespan);

  // 格式化日期的辅助函数
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
          <div className="flex items-center space-x-2">
            {categoryIcons[product.category] || <Package className="h-6 w-6 text-indigo-600" />}
            <button
              onClick={onEdit}
              className="p-1 text-gray-400 hover:text-indigo-500 rounded-full hover:bg-gray-100"
              title={t('product.actions.edit')}
            >
              <Edit className="h-5 w-5" />
            </button>
            <button
              onClick={onDelete}
              className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
              title={t('product.actions.delete')}
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">{t('product.category')}</span>
            <span className="font-medium">{product.category}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">{t('product.purpose')}</span>
            <span className="font-medium">{product.purpose}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">{t('product.price')}</span>
            <span className="font-medium">￥{product.price.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">{t('product.purchaseDate')}</span>
            <span className="font-medium">{formatDate(product.purchase_date)}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">{t('product.expectedUse')}</span>
            <span className="font-medium">{product.expected_lifespan} {t('product.year')}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">{t('product.daysOwned')}</span>
            <span className="font-medium">{daysOwned}{t('product.day')}</span>
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">{t('product.progress.title')}</span>
              <span className="text-sm font-medium">{progress}% - {message}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  progress >= 80 ? 'bg-red-500' : 
                  progress >= 50 ? 'bg-yellow-500' : 
                  'bg-green-500'
                }`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            {progress >= 60 && (
              <div className="mt-3 p-3 bg-indigo-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <div className="text-indigo-500 shrink-0">💡</div>
                  <div>
                    <p className="text-sm text-indigo-700">
                      {t('product.upgrade.tip', { progress })}
                    </p>
                    <a 
                      href={`https://example.com/rebate?category=${product.category}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center text-xs text-indigo-600 hover:text-indigo-700"
                    >
                      {t('product.upgrade.viewDeals')}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">{t('product.costPerDay.current')}</p>
              <p className="font-semibold">
                {t('product.costPerDay.unit', { 
                  value: daysOwned === 1 ? product.price.toFixed(1) : costPerDay 
                })}
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">{t('product.costPerDay.expected')}</p>
              <p className="font-semibold">
                {t('product.costPerDay.unit', { value: expectedCostPerDay })}
              </p>
            </div>
          </div>

          {(product.notes || product.reason_to_buy) && (
            <div className="pt-4 border-t space-y-3">
              {product.notes && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t('product.notes')}</p>
                  <p className="text-sm">{product.notes}</p>
                </div>
              )}
              {product.reason_to_buy && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t('product.reasonToBuy')}</p>
                  <p className="text-sm">{product.reason_to_buy}</p>
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