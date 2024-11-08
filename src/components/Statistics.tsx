import { Product } from '../types';

interface StatisticsProps {
  products: Product[];
}

function Statistics({ products }: StatisticsProps) {
  const totalPrice = products.reduce((sum, product) => sum + product.price, 0);
  const productCount = products.length;
  const averagePrice = productCount > 0 ? totalPrice / productCount : 0;
  const totalDailyCost = products.reduce((sum, product) => {
    const daysOwned = Math.max(1, Math.floor(
      (new Date().getTime() - new Date(product.purchaseDate).getTime()) / (1000 * 60 * 60 * 24)
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
        </div>
      </div>
    </div>
  );
}

export default Statistics;