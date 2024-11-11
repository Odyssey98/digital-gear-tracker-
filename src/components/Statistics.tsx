import { Product } from '../types';
import { useTranslation } from 'react-i18next';

interface StatisticsProps {
  products: Product[];
}

// 定义不同语言的等价物
const equivalents = {
  'zh-CN': {
    desktop: [
      { value: 35, item: '杯星巴克大杯拿铁' },
      { value: 25, item: '杯瑞幸大杯生椰拿铁' },
      { value: 21, item: '份肯德基卷堡套餐' },
      { value: 15, item: '份永和大王早餐' },
    ],
    mobile: [
      { value: 35, item: '杯星巴克' },
      { value: 25, item: '杯瑞幸' },
      { value: 21, item: '份肯德基' },
      { value: 15, item: '份早餐' },
    ]
  },
  'en-US': {
    desktop: [
      { value: 5, item: 'Starbucks Grande Lattes' },
      { value: 15, item: 'Chipotle Burritos' },
      { value: 12, item: 'Subway Footlongs' },
      { value: 8, item: 'McDonald\'s Big Mac Meals' },
    ],
    mobile: [
      { value: 5, item: 'Lattes' },
      { value: 15, item: 'Burritos' },
      { value: 12, item: 'Subs' },
      { value: 8, item: 'Big Macs' },
    ]
  }
};

function Statistics({ products }: StatisticsProps) {
  const { t, i18n } = useTranslation();
  
  // 根据屏幕尺寸和语言返回不同的等价描述
  const getPriceEquivalent = (price: number): string => {
    if (price <= 0) return '';
    
    const lang = i18n.language.startsWith('zh') ? 'zh-CN' : 'en-US';
    const items = window.innerWidth <= 768 ? 
      equivalents[lang].mobile : 
      equivalents[lang].desktop;
    
    for (const eq of items) {
      const count = Math.round(price / eq.value);
      if (count >= 1 && count <= 100) {
        return t('statistics.equivalent', { count, item: eq.item });
      }
    }
    
    return t('statistics.equivalent', { 
      count: Math.round(price / items[0].value), 
      item: items[0].item 
    });
  };

  const totalPrice = products.reduce((sum, product) => sum + product.price, 0);
  const productCount = products.length;
  const averagePrice = productCount > 0 ? totalPrice / productCount : 0;
  const totalDailyCost = products.reduce((sum, product) => {
    const daysOwned = Math.max(1, Math.floor(
      (new Date().getTime() - new Date(product.purchase_date).getTime()) / (1000 * 60 * 60 * 24)
    ));
    return sum + (product.price / daysOwned);
  }, 0);

  const currencySymbol = i18n.language.startsWith('zh') ? '¥' : '$';

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-4 mb-6 mx-2">
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-xs text-gray-500">{t('statistics.totalAssets')}</p>
          <p className="text-base md:text-lg font-medium text-gray-900">
            {currencySymbol}{totalPrice.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {getPriceEquivalent(totalPrice)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">{t('statistics.averagePrice')}</p>
          <p className="text-base md:text-lg font-medium text-gray-900">
            {currencySymbol}{averagePrice.toFixed(0)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">{t('statistics.dailyAverage')}</p>
          <p className="text-base md:text-lg font-medium text-gray-900">
            {currencySymbol}{totalDailyCost.toFixed(1)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {getPriceEquivalent(totalDailyCost)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Statistics;