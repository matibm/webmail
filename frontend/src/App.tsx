import { useEffect } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import EmailListPane from './components/EmailListPane/EmailListPane';
import EmailDetailPane from './components/EmailDetailPane/EmailDetailPane';
import ComposeModal from './components/ComposeModal/ComposeModal';
import Toast from './components/Toast/Toast';
import Login from './components/Login/Login';
import { useEmailStore } from './store/emailStore';
import { authService } from './services/authService';

function App() {
  const { selectedEmailId, loadEmails } = useEmailStore();
  const isAuthenticated = authService.isAuthenticated();

  // Cargar emails cuando se autentica
  useEffect(() => {
    if (isAuthenticated) {
      loadEmails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]); // No incluir loadEmails para evitar re-renders innecesarios

  if (!isAuthenticated) {
    return <Login />;
  }

  useEffect(() => {
    // Update detail pane visibility based on selection
    const detailPane = document.getElementById('email-detail-pane');
    const contentView = document.getElementById('content-view');
    const emptyState = document.getElementById('empty-state');

    if (selectedEmailId) {
      if (contentView) contentView.classList.remove('hidden');
      if (emptyState) emptyState.classList.add('hidden');
      if (window.innerWidth < 768 && detailPane) {
        detailPane.classList.remove('translate-x-full');
      }
    } else {
      if (window.innerWidth < 768 && detailPane) {
        detailPane.classList.add('translate-x-full');
      }
      if (window.innerWidth >= 768) {
        if (contentView) contentView.classList.add('hidden');
        if (emptyState) emptyState.classList.remove('hidden');
      }
    }
  }, [selectedEmailId]);

  return (
    <div className="bg-slate-50 text-slate-800 h-screen flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-white relative">
        <Header />
        <div className="flex-1 flex overflow-hidden relative">
          <EmailListPane />
          <EmailDetailPane />
        </div>
      </main>
      <ComposeModal />
      <Toast />
    </div>
  );
}

export default App;

