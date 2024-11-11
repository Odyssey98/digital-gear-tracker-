import { useTranslation } from 'react-i18next';

export const useCategories = () => {
  const { t } = useTranslation();
  
  return [
    t('categories.phone'),
    t('categories.computer'),
    t('categories.tablet'),
    t('categories.headphones'),
    t('categories.camera'),
    t('categories.smartwatch'),
    t('categories.gaming'),
    t('categories.other')
  ];
}; 