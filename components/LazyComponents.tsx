import dynamic from 'next/dynamic';

// Lazy load heavy components
const ChatModal = dynamic(() => import('@/components/chat/ChatModal'), {
  loading: () => <div>Loading...</div>
});

const NotificationBell = dynamic(() => import('@/components/navbar/NotificationBell'), {
  ssr: false
});

export { ChatModal, NotificationBell };