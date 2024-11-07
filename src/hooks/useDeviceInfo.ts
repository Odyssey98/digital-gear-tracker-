import { useEffect } from 'react';
import { Product } from '../types';
import { useProducts } from './useProducts';

export function useDeviceInfo() {
  const { products, addProduct } = useProducts([]);

  useEffect(() => {
    // 如果已经有产品了，就不添加
    if (products.length > 0) return;

    const userAgent = navigator.userAgent;
    let deviceInfo: Partial<Product> = {
      id: Date.now().toString(),
      purchaseDate: new Date().toISOString().split('T')[0],
      usageProgress: 0,
      category: '其他',
    };

    // 检测设备类型
    if (/iPhone|iPad|iPod/.test(userAgent)) {
      deviceInfo = {
        ...deviceInfo,
        name: 'iPhone/iPad',
        category: '手机/平板',
        purpose: '日常使用',
      };
    } else if (/Android/.test(userAgent)) {
      deviceInfo = {
        ...deviceInfo,
        name: 'Android 设备',
        category: '手机/平板',
        purpose: '日常使用',
      };
    } else {
      deviceInfo = {
        ...deviceInfo,
        name: 'PC/笔记本',
        category: '电脑',
        purpose: '工作/娱乐',
      };
    }

    // 添加更多设备信息
    const finalDevice: Product = {
      ...deviceInfo,
      price: 0,
      expectedLifespan: 2,
      notes: '自动检测的设备',
      reasonToBuy: '必需品',
    } as Product;

    addProduct(finalDevice);
  }, []);
}