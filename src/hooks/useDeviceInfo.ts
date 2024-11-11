import { UsageStatus } from '../types';
import i18next from 'i18next';  

interface DeviceInfo {
  name: string;
  category: string;
  purpose: string;
  price: string;
  status: UsageStatus;
  purchaseDate: string;
  expectedLifespan: string;
  notes: string;
  reasonToBuy: string;
}

export function getDeviceType(): DeviceInfo {
  const userAgent = navigator.userAgent;
  
  const baseInfo = {
    name: '',
    price: '',
    status: i18next.t('status.inUse') as UsageStatus,
    purchaseDate: new Date().toISOString().split('T')[0],
    expectedLifespan: '1',
    notes: '',
    reasonToBuy: '',
  };
  
  if (/iPhone|iPad|iPod/.test(userAgent)) {
    return {
      ...baseInfo,
      category: i18next.t('deviceType.mobileTablet'),
      purpose: i18next.t('purpose.daily'),
    };
  } else if (/Android/.test(userAgent)) {
    return {
      ...baseInfo,
      category: i18next.t('deviceType.mobileTablet'),
      purpose: i18next.t('purpose.daily'),
    };
  } else {
    return {
      ...baseInfo,
      category: i18next.t('deviceType.computer'),
      purpose: i18next.t('purpose.workEntertainment'),
    };
  }
}