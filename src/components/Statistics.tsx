import { Product } from '../types';

interface StatisticsProps {
  products: Product[];
}

// 定义两组等价物，分别用于PC端和移动端
const equivalents = {
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
};

// 根据屏幕尺寸返回不同的等价描述
const getPriceEquivalent = (price: number): string => {
  if (price <= 0) return '';
  
  const items = window.innerWidth <= 768 ? equivalents.mobile : equivalents.desktop;
  
  for (const eq of items) {
    const count = Math.round(price / eq.value);
    if (count >= 1 && count <= 100) {
      return `约${count}${eq.item}`;
    }
  }
  
  return `约${Math.round(price / items[0].value)}${items[0].item}`;
};

function Statistics({ products }: StatisticsProps) {
  const totalPrice = products.reduce((sum, product) => sum + product.price, 0);
  const productCount = products.length;
  const averagePrice = productCount > 0 ? totalPrice / productCount : 0;
  const totalDailyCost = products.reduce((sum, product) => {
    const daysOwned = Math.max(1, Math.floor(
      (new Date().getTime() - new Date(product.purchase_date).getTime()) / (1000 * 60 * 60 * 24)
    ));
    return sum + (product.price / daysOwned);
  }, 0);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-4 mb-6 mx-2">
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-xs text-gray-500">总资产</p>
          <p className="text-base md:text-lg font-medium text-gray-900">
            ¥{totalPrice.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {getPriceEquivalent(totalPrice)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">均价</p>
          <p className="text-base md:text-lg font-medium text-gray-900">
            ¥{averagePrice.toFixed(0)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">日均</p>
          <p className="text-base md:text-lg font-medium text-gray-900">
            ¥{totalDailyCost.toFixed(1)}
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