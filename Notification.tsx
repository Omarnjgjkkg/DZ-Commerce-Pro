import React from 'react';
import { useStore } from '../context/StoreContext';

const Notification: React.FC = () => {
  const { notification } = useStore();
  if (!notification) return null;
  const bg = { success: 'bg-green-500', error: 'bg-red-500', info: 'bg-blue-500' }[notification.type];
  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[100] animate-slideUp">
      <div className={`${bg} text-white px-5 py-2.5 rounded-xl shadow-xl font-semibold text-xs flex items-center gap-2 min-w-[200px] justify-center`}>
        {notification.type === 'success' && '✓'}
        {notification.type === 'error' && '✕'}
        {notification.type === 'info' && 'ℹ'}
        {notification.message}
      </div>
    </div>
  );
};
export default Notification;
