import EmailList from '../EmailList/EmailList';
import { useEmailStore } from '../../store/emailStore';

export default function EmailListPane() {
  const { searchTerm, setSearchTerm } = useEmailStore();

  return (
    <div
      id="email-list-pane"
      className="w-full md:w-[400px] xl:w-[450px] border-r border-slate-200 flex flex-col bg-white overflow-hidden transition-all duration-300 absolute md:relative z-10 h-full"
    >
      {/* Mobile Search */}
      <div className="md:hidden p-3 border-b border-slate-100">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar..."
          className="w-full px-4 py-2 bg-slate-100 rounded-lg text-sm outline-none"
        />
      </div>

      {/* Filter Tabs */}
      <div className="px-4 py-2 flex items-center gap-2 border-b border-slate-50 overflow-x-auto no-scrollbar">
        <button className="px-3 py-1 text-xs font-medium bg-slate-900 text-white rounded-full whitespace-nowrap">
          Todo
        </button>
        <button className="px-3 py-1 text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-full whitespace-nowrap">
          No leídos
        </button>
        <button className="px-3 py-1 text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-full whitespace-nowrap">
          Con adjuntos
        </button>
      </div>

      {/* The List */}
      <EmailList />
    </div>
  );
}

