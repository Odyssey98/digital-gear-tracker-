
export function getDeviceType() {
  const userAgent = navigator.userAgent;
  
  if (/iPhone|iPad|iPod/.test(userAgent)) {
    return {
      name: '',
      category: '手机/平板',
      purpose: '日常使用',
    };
  } else if (/Android/.test(userAgent)) {
    return {
      name: '',
      category: '手机/平板',
      purpose: '日常使用',
    };
  } else {
    return {
      name: '',
      category: '电脑',
      purpose: '工作/娱乐',
    };
  }
}