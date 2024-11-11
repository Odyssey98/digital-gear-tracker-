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
import { useTranslation } from 'react-i18next';

// 添加图标映射
const categoryIcons: Record<string, React.ReactNode> = {
  'Phone': <Smartphone className="h-6 w-6 text-zinc-100" />,
  'Computer': <Laptop className="h-6 w-6 text-zinc-100" />,
  'Tablet': <Tablet className="h-6 w-6 text-zinc-100" />,
  'Headphones': <Headphones className="h-6 w-6 text-zinc-100" />,
  'Camera': <Camera className="h-6 w-6 text-zinc-100" />,
  'Smartwatch': <Watch className="h-6 w-6 text-zinc-100" />,
  'Gamepad': <Gamepad className="h-6 w-6 text-zinc-100" />,
  'Other': <Package className="h-6 w-6 text-zinc-100" />
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
  const { t, i18n } = useTranslation();
  const currencySymbol = i18n.language.startsWith('zh') ? '¥' : '$';

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

  const calculateProgress = useCallback((purchaseDate: string, expectedLifespan: number) => {
    const startDate = new Date(purchaseDate);
    const today = new Date();
    const totalDays = expectedLifespan * 365;
    const usedDays = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const progress = Math.min(100, Math.round((usedDays / totalDays) * 100));
    
    // 进度消息直接在这里处理
    const getMessage = (p: number) => {
      if (p >= 100) return t('product.progress.status.exceeded');
      if (p >= 80) return t('product.progress.status.nearEnd');
      if (p >= 50) return t('product.progress.status.halfUsed');
      if (p >= 20) return t('product.progress.status.good');
      return t('product.progress.status.new');
    };
    
    return {
      progress,
      message: getMessage(progress)
    };
  }, [t]); // 添加 t 作为依赖

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex flex-col items-center p-4 z-50 overflow-hidden">
      {/* 隐藏的内容区域，用于生成图片 */}
      <div className="absolute left-[-9999px]">
        <div 
          ref={contentRef} 
          style={{
            padding: '24px',
            backgroundColor: '#09090b', // zinc-950
            width: window.innerWidth <= 768 ? '390px' : '768px',
            visibility: 'visible',
            position: 'relative',
          }}
          className="min-h-screen bg-zinc-950 p-4"
        >
          <div className="mx-auto max-w-3xl space-y-6">
            {/* 头部区域 */}
            <div className="text-center">
              <h1 className="mb-2 flex items-center justify-center gap-2 text-xl font-bold text-zinc-100">
                {t('share.title')}
                <span className="inline-block">📊</span>
              </h1>
              <p className="text-sm text-zinc-400">{t('share.subtitle')}</p>
            </div>

            {/* 数据概览 */}
            <div className="grid grid-cols-3 gap-4 rounded-2xl bg-zinc-900/50 p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-zinc-100">{products.length}</div>
                <div className="text-sm text-zinc-400">{t('share.overview.devices')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-zinc-100">
                  {currencySymbol}{calculateTotalValue().toLocaleString()}
                </div>
                <div className="text-sm text-zinc-400">{t('share.overview.totalValue')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-zinc-100">
                  {currencySymbol}{calculateAverageDailyCost()}
                </div>
                <div className="text-sm text-zinc-400">{t('share.overview.dailyCost')}</div>
              </div>
            </div>

            {/* 装备列表标题 */}
            <div className="px-1">
              <h2 className="text-lg font-bold text-zinc-100">{t('share.deviceList.title')}</h2>
              <p className="text-sm text-zinc-400">{t('share.deviceList.subtitle')}</p>
            </div>

            {/* 装备列表 */}
            <div className="space-y-4">
              {products.map(product => (
                <div key={product.id} className="rounded-2xl bg-zinc-900/50 p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-zinc-800 p-2 text-zinc-100">
                        {categoryIcons[product.category]}
                      </div>
                      <div>
                        <h3 className="font-medium text-zinc-100">{product.name}</h3>
                        <p className="text-sm text-zinc-400">
                        {t(product.category)} · {t(product.status)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-zinc-100">{currencySymbol}{product.price}</div>
                      <div className="text-sm text-zinc-400">
                        {product.price >= 10000 ? t('share.priceComment.veryHigh') : 
                         product.price >= 5000 ? t('share.priceComment.high') :
                         product.price >= 1000 ? t('share.priceComment.medium') :
                         t('share.priceComment.low')}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 grid grid-cols-3 gap-4">
                    <div className="rounded-lg bg-zinc-800/50 p-3 text-center">
                      <div className="text-sm text-zinc-100">
                        {getDaysOwned(product.purchase_date)}{t('share.deviceCard.days')}
                      </div>
                      <div className="text-xs text-zinc-400">{t('share.deviceCard.daysUsed')}</div>
                    </div>
                    <div className="rounded-lg bg-zinc-800/50 p-3 text-center">
                      <div className="text-sm text-zinc-100">
                        {currencySymbol}{(product.price / getDaysOwned(product.purchase_date)).toFixed(2)}
                      </div>
                      <div className="text-xs text-zinc-400">{t('share.deviceCard.dailyCost')}</div>
                    </div>
                    <div className="rounded-lg bg-zinc-800/50 p-3 text-center">
                      <div className="text-sm text-zinc-100">
                        {product.expected_lifespan}{t('share.deviceCard.years')}
                      </div>
                      <div className="text-xs text-zinc-400">{t('share.deviceCard.expectedUse')}</div>
                    </div>
                  </div>

                  {/* 进度条区域 */}
                  {(() => {
                    const { progress, message } = calculateProgress(product.purchase_date, product.expected_lifespan);
                    return (
                      <div>
                        <div className="mb-2 flex justify-between text-sm">
                          <span className="text-zinc-400">{t('product.progress.title')}</span>
                          <span className="text-zinc-400">{progress}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-zinc-800">
                          <div
                            className={`h-1.5 rounded-full transition-all ${
                              progress >= 80 ? 'bg-red-500' : 
                              progress >= 50 ? 'bg-yellow-500' : 
                              'bg-emerald-500'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="mt-1 text-right text-sm text-zinc-400">
                          {message}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ))}
            </div>

            {/* 底部二维码区域 */}
            <div className="rounded-2xl bg-zinc-900/50 p-6 text-center">
              <p className="mb-4 text-zinc-100">{t('share.qrCode.title')}</p>
              <p className="mb-6 text-sm text-zinc-400">{t('share.qrCode.subtitle')}</p>
              <div className="flex justify-center mb-4">
                <QRCodeSVG 
                  value={window.location.href} 
                  size={120}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="text-sm text-zinc-500">
                {t('share.qrCode.via')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 加载状态 */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mb-4"></div>
          <p>{t('share.loading')}</p>
        </div>
      )}

      {/* 生成失败时显示重试按钮 */}
      {!isLoading && !previewImage && (
        <div className="flex flex-col items-center justify-center text-white">
          <p className="mb-4">{t('share.error')}</p>
          <button
            onClick={generateImage}
            className="px-6 py-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            {t('share.retry')}
          </button>
        </div>
      )}

      {/* 图片预览 */}
      {!isLoading && previewImage && (
        <div className="flex flex-col items-center w-full max-w-3xl h-full">
          {/* 顶部提示 */}
          <div className="w-full text-center mb-4 flex-shrink-0">
            <p className="text-white/80 text-sm">
              {t('share.preview.saveHint')}
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
            {t('share.preview.close')}
          </button>
        </div>
      )}
    </div>
  );
}

export default ShareModal;