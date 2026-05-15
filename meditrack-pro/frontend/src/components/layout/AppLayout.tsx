import Sidebar from './Sidebar';
import TopBar from './TopBar';
import ChatBot from '../chat/ChatBot';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <TopBar />
      <main className="ml-64 mt-16 p-8 min-h-[calc(100vh-64px)] animate-fade-in">
        {children}
      </main>
      <ChatBot />
    </div>
  );
}
