import { useEffect, useState } from 'react';
import { Currency, UsageStatus } from '../types';
import { useProducts } from './useProducts';
import { useUser } from '../context/UserContext';

export function useDeviceInfo() {
  const { user } = useUser();
  const { products, addProduct, loading } = useProducts();
  const [isDeviceAdded, setIsDeviceAdded] = useState(false);

  useEffect(() => {
    const addDeviceInfo = async () => {
      try {
        // 确保用户已登录且产品数据已加载完成
        if (!user || loading || products.length > 0 || isDeviceAdded) return;

        console.log('Adding device info...'); // 调试日志

        const userAgent = navigator.userAgent;
        
        const baseDevice = {
          name: 'Unknown Device',
          category: '其他',
          purpose: '日常使用',
          price: 6666,
          currency: 'CNY' as Currency,
          status: '在用' as UsageStatus,
          purchaseDate: new Date().toISOString().split('T')[0],
          expectedLifespan: 2,
          notes: '自动检测的设备',
          reasonToBuy: '必需品',
        };

        let deviceInfo: typeof baseDevice;
        
        if (/iPhone|iPad|iPod/.test(userAgent)) {
          deviceInfo = {
            ...baseDevice,
            name: 'iPhone/iPad',
            category: '手机/平板',
            purpose: '日常使用',
          };
        } else if (/Android/.test(userAgent)) {
          deviceInfo = {
            ...baseDevice,
            name: 'Android 设备',
            category: '手机/平板',
            purpose: '日常使用',
          };
        } else {
          deviceInfo = {
            ...baseDevice,
            name: 'PC/笔记本',
            category: '电脑',
            purpose: '工作/娱乐',
          };
        }

        console.log('Device info to add:', deviceInfo); // 调试日志
        await addProduct(deviceInfo);
        setIsDeviceAdded(true);
        console.log('Device added successfully'); // 调试日志
      } catch (error) {
        console.error('Error adding device info:', error);
      }
    };

    addDeviceInfo();
  }, [user, products.length, loading, isDeviceAdded, addProduct]);

  return { isDeviceAdded };
}