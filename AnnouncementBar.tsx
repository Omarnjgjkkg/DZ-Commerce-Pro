import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

const AnnouncementBar: React.FC = () => {
  const { t } = useStore();
  const [idx, setIdx] = useState(0);
  const items = [t('announcement1'), t('announcement2'), t('announcement3')];
  useEffect(() => { const i = setInterval(() => setIdx(p => (p + 1) % items.length), 4000); return () => clearInterval(i); }, [items.length]);

  return (
    <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700 text-white py-1.5 text-center">
      <span className="text-[11px] font-medium animate-fadeIn" key={idx}>{items[idx]}</span>
    </div>
  );
};
export default AnnouncementBar;
