import { useEmailStore } from '../../store/emailStore';
import { authService } from '../../services/authService';

export default function Sidebar() {
  const { currentFolder, setCurrentFolder, toggleCompose, getUnreadCount, sidebarOpen, toggleSidebar } = useEmailStore();

  // Get real user email from localStorage
  const userEmail = localStorage.getItem('email') || '';
  const userName = userEmail.split('@')[0] || 'Usuario';

  const handleLogout = () => {
    authService.logout();
    window.location.reload();
  };
  const unreadCount = getUnreadCount();

  const navItems: Array<{ id: string; label: string; icon: string; count?: number }> = [
    { id: 'inbox', label: 'Recibidos', icon: 'inbox', count: unreadCount },
    { id: 'starred', label: 'Destacados', icon: 'star' },
    { id: 'sent', label: 'Enviados', icon: 'send' },
    { id: 'drafts', label: 'Borradores', icon: 'draft' },
    { id: 'trash', label: 'Papelera', icon: 'delete' },
  ];

  const labels = [
    { name: 'Trabajo', color: 'bg-emerald-400' },
    { name: 'Personal', color: 'bg-purple-400' },
    { name: 'Viajes', color: 'bg-orange-400' },
  ];

  const handleFolderChange = (folder: string) => {
    setCurrentFolder(folder as any);
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative z-30 w-64 h-full bg-white border-r border-slate-200 transform transition-transform duration-300 flex flex-col justify-between ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        <div className="p-4">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              M
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">
              ModernMail
            </span>
          </div>

          {/* Compose Button */}
          <button
            onClick={toggleCompose}
            className="w-full mb-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl shadow-lg hover:shadow-blue-200 transition-all flex items-center justify-center gap-2 group"
          >
            <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">
              edit
            </span>
            <span>Redactar</span>
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = currentFolder === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleFolderChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined fill-current">
                      {item.icon}
                    </span>
                    {item.label}
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="bg-blue-100 text-blue-700 py-0.5 px-2 rounded-full text-xs">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Labels */}
          <div className="mt-8">
            <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Etiquetas
            </h3>
            <nav className="space-y-1">
              {labels.map((label) => (
                <button
                  key={label.name}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${label.color}`}></span>
                  {label.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {userName}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {userEmail}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Cerrar sesión"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

