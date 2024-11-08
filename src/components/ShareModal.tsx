import  { useRef, useState, useCallback, useEffect } from 'react';
import { 
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
import html2canvas from 'html2canvas'; 
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
  const [previewImage, setPreviewImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  const calculateTotalValue = () => {
    return products.reduce((sum, product) => sum + product.price, 0);
  };

  const calculateAverageDailyCost = () => {
    const totalCost = calculateTotalValue();
    const totalDays = products.reduce((sum, product) => 
      sum + getDaysOwned(product.purchase_date), 0);
    return (totalCost / totalDays).toFixed(2);
  };

  // 生成图片
  const generateImage = useCallback(async () => {
    if (contentRef.current) {
      try {
        setIsLoading(true);
        setImageLoaded(false);
        
        // 确保内容区域有正确的尺寸
        const element = contentRef.current;
       

        const scale = window.devicePixelRatio;

        const canvas = await html2canvas(element, {
          scale: scale,
          useCORS: true,
          logging: true, // 开启日志
          backgroundColor: '#ffffff',
          width: element.offsetWidth,
          height: element.offsetHeight,
          onclone: (clonedDoc) => {
            // 确保克隆的元素可见
            const clonedElement = clonedDoc.querySelector('[data-html2canvas-clone="true"]');
            if (clonedElement) {
              (clonedElement as HTMLElement).style.display = 'block';
              (clonedElement as HTMLElement).style.visibility = 'visible';
            }
          }
        });

        
        const image = canvas.toDataURL('image/png', 1.0);
        
        
        if (image.length < 1000) {
          throw new Error('生成的图片数据异常');
        }

        setPreviewImage(image);
        
      } catch (error) {
        console.error('生成图片失败:', error);
        // 显示错误信息给用户
        alert('生成图片失败，请重试');
      } finally {
        setIsLoading(false);
      }
    } else {
      console.error('未找到内容区域');
    }
  }, []);

  // 当内容加载完成后生成片
  useEffect(() => {
    if (isOpen && contentRef.current) {
      generateImage();
    }
  }, [isOpen, generateImage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex flex-col items-center p-4 z-50 overflow-hidden">
      {/* 隐藏的内容区域，用于生成图片 */}
      <div className="absolute left-[-9999px]" style={{ width: '800px' }}>
        <div 
          ref={contentRef} 
          style={{
            padding: '32px',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            width: '800px',
            visibility: 'visible',
            position: 'relative'
          }}
        >
          {/* 添加一个渐变背景的容器 */}
          <div 
            style={{
              background: '#EEF2FF',  // 浅色背景，替代渐变
              borderRadius: '8px',
              padding: '24px'
            }}
          >
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
        </div>
      </div>

      {/* 加载状态 */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mb-4"></div>
          <p>正在生成预览图...</p>
        </div>
      )}

      {/* 生成失败时显示重试按钮 */}
      {!isLoading && !previewImage && (
        <div className="flex flex-col items-center justify-center text-white">
          <p className="mb-4">生成图片失败</p>
          <button
            onClick={generateImage}
            className="px-6 py-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            重新生成
          </button>
        </div>
      )}

      {/* 图片预览 */}
      {!isLoading && previewImage && (
        <div className="flex flex-col items-center w-full max-w-3xl h-full">
          {/* 顶部提示 */}
          <div className="w-full text-center mb-4 flex-shrink-0">
            <p className="text-white/80 text-sm">
              👇 长按或右键图片即可保存
            </p>
          </div>

          {/* 图片容器 - 添加滚动支持 */}
          <div className="relative w-full flex-1 overflow-y-auto min-h-0">
            <div className="bg-white/5 rounded-lg backdrop-blur-sm p-2">
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
                </div>
              )}
              <img 
                src={previewImage} 
                alt="预览图" 
                className={`w-full object-contain rounded ${!imageLoaded ? 'invisible' : ''}`}
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          </div>

          {/* 底部按钮 */}
          <button
            onClick={onClose}
            className="mt-6 px-8 py-2.5 bg-white/20 rounded-full text-white text-sm backdrop-blur-sm hover:bg-white/30 transition-colors flex-shrink-0"
          >
            关闭预览
          </button>
        </div>
      )}
    </div>
  );
}

export default ShareModal;