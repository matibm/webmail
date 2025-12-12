import { useEmailStore } from '../../store/emailStore';

export default function Header() {
  const { searchTerm, setSearchTerm, toggleSidebar } = useEmailStore();

  return (
    <header className="h-16 border-b border-slate-100 flex items-center justify-between px-4 lg:px-6 bg-white z-10">
      <div className="flex items-center gap-3 lg:hidden">
        <button
          onClick={toggleSidebar}
          className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-full"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <span className="font-bold text-lg">Bandeja</span>
      </div>

      {/* Search Bar */}
      <div className="hidden md:flex flex-1 max-w-2xl mx-4">
        <div className="relative w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar correos..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all placeholder-slate-400 text-slate-700 outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </div>
    </header>
  );
}

