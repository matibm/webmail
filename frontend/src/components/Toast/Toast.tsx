import { useEmailStore } from '../../store/emailStore';

export default function Toast() {
  const { toastMessage } = useEmailStore();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 transform transition-transform duration-300 z-50 translate-y-0">
      <span className="material-symbols-outlined text-green-400">
        check_circle
      </span>
      <span>{toastMessage}</span>
    </div>
  );
}

