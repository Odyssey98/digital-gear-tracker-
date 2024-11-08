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

// 添加进度条计算函数
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
  if (progress >= 100) return '已超出预期使用时间';
  if (progress >= 80) return '接近预期使用期限';
  if (progress >= 50) return '使用过半';
  if (progress >= 20) return '使用良好';
  return '刚开始使用';
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
      <div className="absolute left-[-9999px]">
        <div 
          ref={contentRef} 
          style={{
            padding: window.innerWidth <= 768 ? '48px 36px' : '64px',
            backgroundColor: '#F8FAFF',
            width: window.innerWidth <= 768 ? '390px' : '1000px',
            visibility: 'visible',
            position: 'relative',
            borderRadius: window.innerWidth <= 768 ? '0' : '24px', // PC端添加圆角
          }}
        >
          {/* 头部区域 */}
          <div className="mb-16 md:mb-20">
            <h3 className="text-xl md:text-3xl font-bold text-gray-900 mb-3 text-center">
              数码消费追踪报告 📊
            </h3>
            <p className="text-sm md:text-base text-gray-500 text-center">
              让数据告诉你每天的数码使用成本
            </p>
          </div>

          {/* 数据概览 - 优化PC端样式 */}
          <div className="grid grid-cols-3 mb-20 md:mb-24">
            <div className="text-center md:px-8">
              <p className="text-indigo-600 text-2xl md:text-4xl font-medium mb-2">{products.length}</p>
              <p className="text-xs md:text-sm text-gray-500">我的装备</p>
            </div>
            <div className="text-center md:px-8 md:border-x border-gray-100">
              <p className="text-indigo-600 text-2xl md:text-4xl font-medium mb-2">
                ¥{calculateTotalValue().toLocaleString('zh-CN')}
              </p>
              <p className="text-xs md:text-sm text-gray-500">总值</p>
            </div>
            <div className="text-center md:px-8">
              <p className="text-indigo-600 text-2xl md:text-4xl font-medium mb-2">
                ¥{calculateAverageDailyCost()}
              </p>
              <p className="text-xs md:text-sm text-gray-500">日均投入</p>
            </div>
          </div>

          {/* 装备列表标题 */}
          <div className="mb-6 md:mb-10">
            <h4 className="text-base md:text-xl font-medium text-gray-900">我的装备清单</h4>
            <p className="text-xs md:text-sm text-gray-500 mt-1">每一件都是精心之选</p>
          </div>

          {/* 装备列表 - 优化PC端卡片样式 */}
          <div className="space-y-6 md:space-y-8">
            {products.map(product => (
              <div key={product.id} className="bg-white/50 hover:bg-white/80 transition-colors rounded-xl px-3 md:px-8 py-5 md:py-6">
                {/* 装备列表项 */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start">
                    <div className="bg-indigo-50 p-2 rounded-lg">
                      <div className="text-indigo-600 w-5 h-5">
                        {categoryIcons[product.category]}
                      </div>
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium text-gray-900">{product.name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{product.category} · {product.status}</p>
                    </div>
                  </div>
                  
                  {/* 价格信息 */}
                  <div className="text-right">
                    <p className="text-lg font-medium text-indigo-600">¥{product.price}</p>
                    <p className="text-xs text-gray-500">
                      {product.price >= 10000 ? '买都买了 💸' : 
                       product.price >= 5000 ? '大件消费 💰' :
                       product.price >= 1000 ? '小小投资 💵' :
                       '随手买的 🫰'}
                    </p>
                  </div>
                </div>

                {/* 移动端详细信息 */}
                <div className="md:hidden grid grid-cols-3 gap-2 mb-6 mx-[-12px] px-3">
                  <div className="text-center p-3 bg-gray-50/50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-2">已使用</p>
                    <p className="font-medium text-base">{getDaysOwned(product.purchase_date)}天</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50/50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-2">每日成本</p>
                    <p className="font-medium text-base">¥{(product.price / getDaysOwned(product.purchase_date)).toFixed(2)}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50/50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-2">预期使用</p>
                    <p className="font-medium text-base">{product.expected_lifespan}年</p>
                  </div>
                </div>

                {/* PC端详细信息 */}
                <div className="hidden md:flex items-center divide-x divide-gray-100">
                  <div className="text-center px-8">
                    <p className="text-sm text-gray-500 mb-1">已使用</p>
                    <p className="font-medium">{getDaysOwned(product.purchase_date)}天</p>
                  </div>
                  <div className="text-center px-8">
                    <p className="text-sm text-gray-500 mb-1">每日成本</p>
                    <p className="font-medium">¥{(product.price / getDaysOwned(product.purchase_date)).toFixed(2)}</p>
                  </div>
                  <div className="text-center px-8">
                    <p className="text-sm text-gray-500 mb-1">预期使用</p>
                    <p className="font-medium">{product.expected_lifespan}年</p>
                  </div>
                </div>

                {/* 进度条区域 */}
                <div className="mt-6 md:mt-8 mb-0">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">使用进度</span>
                      {(() => {
                        const { progress } = calculateProgress(product.purchase_date, product.expected_lifespan);
                        return (
                          <span className="text-xs font-medium text-gray-900">{progress}%</span>
                        );
                      })()}
                    </div>
                    {(() => {
                      const { message } = calculateProgress(product.purchase_date, product.expected_lifespan);
                      return (
                        <span className="text-xs text-gray-500">{message}</span>
                      );
                    })()}
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        (() => {
                          const { progress } = calculateProgress(product.purchase_date, product.expected_lifespan);
                          return progress >= 80 ? 'bg-red-500' : 
                                 progress >= 50 ? 'bg-yellow-500' : 
                                 'bg-green-500';
                        })()
                      }`}
                      style={{ 
                        width: `${calculateProgress(product.purchase_date, product.expected_lifespan).progress}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 底部二维码区域 - PC端更大的间距和尺寸 */}
          <div className="mt-16 md:mt-20 text-center">
            <p className="text-sm md:text-base text-gray-900 mb-2">想知道你的数码装备每天花费多少？</p>
            <p className="text-xs md:text-sm text-gray-500 mb-6 md:mb-8">扫码使用用时宝，理性分析你的数码消费</p>
            <div className="flex justify-center mb-4">
              <QRCodeSVG 
                value={window.location.href} 
                size={window.innerWidth <= 768 ? 96 : 120}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="text-xs md:text-sm text-gray-400">
              via 用时宝 - 你的数码消费分析助手
            </p>
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