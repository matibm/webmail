import { useEmailStore } from '../../store/emailStore';
import dayjs from '../../utils/dayjs';

export default function EmailList() {
  const {
    getFilteredEmails,
    selectedEmailId,
    setSelectedEmailId,
    toggleStar,
  } = useEmailStore();

  const emails = getFilteredEmails();

  const handleEmailClick = async (id: number) => {
    await setSelectedEmailId(id);
    // On mobile, the detail view will handle the transition
    if (window.innerWidth < 768) {
      const detailPane = document.getElementById('email-detail-pane');
      if (detailPane) {
        detailPane.classList.remove('translate-x-full');
      }
    }
  };

  if (emails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <span className="material-symbols-outlined text-4xl mb-2">inbox</span>
        <p>No hay correos aquí</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-1">
      {emails.map((email) => {
        const isSelected = email.id === selectedEmailId;
        const timeStr = dayjs(email.time).fromNow(true);

        return (
          <div
            key={email.id}
            onClick={() => handleEmailClick(email.id)}
            className={`email-list-item cursor-pointer p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors border-l-4 ${isSelected
                ? 'active border-l-blue-500 bg-blue-50/50'
                : 'border-l-transparent bg-white'
              }`}
          >
            <div className="flex justify-between items-start mb-1">
              <div className="flex items-center gap-2">
                {!email.read && (
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                )}
                <h3
                  className={`text-sm truncate max-w-[120px] sm:max-w-[180px] ${!email.read
                      ? 'font-bold text-slate-900'
                      : 'font-medium text-slate-700'
                    }`}
                >
                  {email.sender}
                </h3>
              </div>
              <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                {timeStr}
              </span>
            </div>
            <h4
              className={`text-sm mb-1 truncate ${!email.read ? 'font-bold text-slate-800' : 'text-slate-600'
                }`}
            >
              {email.subject}
            </h4>
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {email.preview}
            </p>
            <div className="flex items-center justify-between mt-3">
              {email.hasAttachments ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                  <span className="material-symbols-outlined text-[12px] mr-1">
                    attachment
                  </span>
                  Adjunto
                </span>
              ) : (
                <span></span>
              )}
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  await toggleStar(email.id);
                }}
                className="text-slate-300 hover:text-yellow-400 transition-colors"
              >
                <span
                  className={`material-symbols-outlined text-[18px] ${email.starred ? 'text-yellow-400 fill-current' : ''
                    }`}
                >
                  star
                </span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

