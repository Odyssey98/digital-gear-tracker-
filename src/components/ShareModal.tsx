import  { useRef } from 'react';
import { 
  X,
  Laptop, 
  Smartphone, 
  Tablet, 
  Headphones, 
  Camera, 
  Watch, 
  Gamepad, 
  Package 
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react'; 
import html2canvas from 'html2canvas'; // 需要安装这个包
import { Product } from '../types';

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

const getDaysOwned = (purchaseDate: string) => {
  const purchase = new Date(purchaseDate);
  const today = new Date();
  const diff = today.getTime() - purchase.getTime();
  return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)));
};

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

function ShareModal({ isOpen, onClose, products }: ShareModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const calculateTotalValue = () => {
    return products.reduce((sum, product) => sum + product.price, 0);
  };

  const calculateAverageDailyCost = () => {
    const totalCost = calculateTotalValue();
    const totalDays = products.reduce((sum, product) => 
      sum + getDaysOwned(product.purchase_date), 0);
    return (totalCost / totalDays).toFixed(2);
  };

  const generateImage = async () => {
    if (contentRef.current) {
      try {
        const canvas = await html2canvas(contentRef.current);
        const image = canvas.toDataURL('image/png');
        
        const link = document.createElement('a');
        link.download = '我的设备清单.png';
        link.href = image;
        link.click();
      } catch (error) {
        console.error('生成图片失败:', error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* 统一的顶部标题栏 */}
        <div className="sticky top-0 bg-white border-b z-10">
          <div className="p-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              分享我的设备清单
            </h2>
            <div className="flex items-center space-x-3">
              {/* PC端显示生成按钮 */}
              <button
                onClick={generateImage}
                className="hidden sm:flex px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors items-center space-x-2"
              >
                <span>生成图片</span>
              </button>
              {/* PC端显示关闭按钮 */}
              <button 
                onClick={onClose}
                className="hidden sm:flex text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* 移动端底部固定操作栏 */}
        <div className="sm:hidden fixed bottom-6 left-0 right-0 flex justify-center space-x-3 px-4 z-50">
          <button
            onClick={generateImage}
            className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition-colors max-w-[160px]"
          >
            保存为图片
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-900/80 text-white px-6 py-3 rounded-full backdrop-blur-sm max-w-[160px]"
          >
            关闭预览
          </button>
        </div>

        <div className="p-6">
          <div ref={contentRef} className="bg-gradient-to-br from-indigo-50 to-white p-4 sm:p-8 rounded-lg">
            <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
  数码消费追踪报告 📊
</h3>
<p className="text-gray-600 mb-8 max-w-xl mx-auto">
  让数据告诉你每天的数码使用成本
</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">我的装备</p>
                  <p className="text-2xl font-semibold text-indigo-600">{products.length}</p>
                  <p className="text-xs text-gray-400">精选好物</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">投资总值</p>
                  <p className="text-2xl font-semibold text-indigo-600">
                    ￥{calculateTotalValue().toLocaleString('zh-CN', { 
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    })}
                  </p>
                  <p className="text-xs text-gray-400">数码资产</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">日均投入</p>
                  <p className="text-2xl font-semibold text-indigo-600">
                    ￥{calculateAverageDailyCost()}
                  </p>
                  <p className="text-xs text-gray-400">理性消费</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-lg font-semibold text-gray-900">我的装备清单</h4>
              <p className="text-sm text-gray-500">每一件都是精心之选</p>
            </div>

            <div className="space-y-4">
              {products.map(product => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      {categoryIcons[product.category]}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{product.name}</h4>
                      <p className="text-sm text-gray-500">{product.category} · {product.status}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-indigo-600">￥{product.price.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">投资价值</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">已使用</p>
                      <p className="font-medium">{getDaysOwned(product.purchase_date)}天</p>
                    </div>
                    <div>
                      <p className="text-gray-500">每日成本</p>
                      <p className="font-medium">￥{(product.price / getDaysOwned(product.purchase_date)).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">预期使用</p>
                      <p className="font-medium">{product.expected_lifespan}年</p>
                    </div>
                  </div>
                  
                  {product.purpose && (
                    <div className="mt-3 text-sm border-t pt-3">
                      <p className="text-gray-500">选择理由</p>
                      <p className="text-gray-700 mt-1">{product.purpose}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col items-center bg-white p-6 rounded-lg">
              <div className="text-center mb-4">
                <p className="text-sm font-medium text-gray-900">想知道你的数码装备每天花费多少？</p>
                <p className="text-sm text-gray-500">扫码使用用时宝，理性分析你的数码消费</p>
              </div>
              <div className="mb-3">
                <QRCodeSVG 
                  value={window.location.href} 
                  size={128}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="mt-4 text-xs text-gray-400">
                via 用时宝 - 你的数码消费分析助手
              </p>
            </div>
          </div>
          
          {/* 移动端底部留白，避免按钮遮挡内容 */}
          <div className="h-20 sm:h-0"></div>
        </div>
      </div>
    </div>
  );
}

export default ShareModal;