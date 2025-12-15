import { useEmailStore } from '../../store/emailStore';
import dayjs from '../../utils/dayjs';
import Avatar from '../Avatar/Avatar';
import paperAirplanePlaceholder from '../../assets/paper-airplane-placeholder.jpeg';

export default function EmailDetail() {
  const {
    selectedEmailId,
    emails,
    toggleStar,
    archiveEmail,
    deleteEmail,
    setSelectedEmailId,
  } = useEmailStore();

  const email = emails.find((e) => e.id === selectedEmailId);

  const handleClose = () => {
    const detailPane = document.getElementById('email-detail-pane');
    if (detailPane) {
      detailPane.classList.add('translate-x-full');
    }
    setTimeout(() => {
      setSelectedEmailId(null);
      const contentView = document.getElementById('content-view');
      if (contentView) {
        contentView.classList.add('hidden');
      }
    }, 300);
  };

  const handleAction = async (type: 'archive' | 'delete') => {
    if (!selectedEmailId) return;
    if (type === 'delete') {
      await deleteEmail(selectedEmailId);
    } else {
      await archiveEmail(selectedEmailId);
    }
    if (window.innerWidth < 768) {
      handleClose();
    } else {
      const contentView = document.getElementById('content-view');
      if (contentView) {
        contentView.classList.add('hidden');
      }
      const emptyState = document.getElementById('empty-state');
      if (emptyState) {
        emptyState.classList.remove('hidden');
      }
    }
  };

  if (!email) {
    return (
      <div
        id="empty-state"
        className="hidden md:flex flex-col items-center justify-center h-full text-center p-8"
      >
        <img
          src={paperAirplanePlaceholder}
          className="w-64 h-64 object-contain mb-6 opacity-80"
          alt="Avión de papel"
        />
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">
          Selecciona un correo
        </h2>
        <p className="text-slate-500 max-w-sm">
          Elige un mensaje de la lista para ver sus detalles, responder o
          gestionarlo.
        </p>
      </div>
    );
  }

  return (
    <div
      id="content-view"
      className="flex flex-col h-full bg-white w-full"
    >
      {/* Detail Header Actions */}
      <div className="h-16 border-b border-slate-100 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={handleClose}
            className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-full"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex gap-1" id="detail-actions">
            <button
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full"
              title="Archivar"
              onClick={() => handleAction('archive')}
            >
              <span className="material-symbols-outlined text-[20px]">
                archive
              </span>
            </button>
            <button
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full"
              title="Marcar como spam"
            >
              <span className="material-symbols-outlined text-[20px]">
                report
              </span>
            </button>
            <button
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full"
              title="Eliminar"
              onClick={() => handleAction('delete')}
            >
              <span className="material-symbols-outlined text-[20px]">
                delete
              </span>
            </button>
          </div>
        </div>
        <div className="flex gap-1">
          <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full">
            <span className="material-symbols-outlined text-[20px]">
              mark_email_unread
            </span>
          </button>
          <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full">
            <span className="material-symbols-outlined text-[20px]">
              more_vert
            </span>
          </button>
        </div>
      </div>

      {/* Scrollable Email Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Title & Labels */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
              {email.subject}
            </h1>
            <button
              onClick={async () => await toggleStar(email.id)}
              className="mt-1 text-slate-300 hover:text-yellow-400 transition-colors"
            >
              <span
                className={`material-symbols-outlined text-[28px] ${email.starred ? 'text-yellow-400 fill-current' : ''
                  }`}
              >
                star
              </span>
            </button>
          </div>

          {/* Sender Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-8 border-b border-slate-100 gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <Avatar
                name={email.sender}
                email={email.email}
                size={48}
                imageUrl={email.avatar}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                  <span className="font-semibold text-slate-900 text-lg truncate">
                    {email.sender}
                  </span>
                  <span className="text-slate-500 text-sm truncate">
                    &lt;{email.email}&gt;
                  </span>
                </div>
                <div className="text-sm text-slate-500 flex items-center gap-1">
                  para mí{' '}
                  <span className="material-symbols-outlined text-[14px]">
                    arrow_drop_down
                  </span>
                </div>
              </div>
            </div>
            <div className="text-sm text-slate-500 shrink-0">
              {dayjs(email.time).format('D MMM YYYY, h:mm A')}
            </div>
          </div>

          {/* Body */}
          <div className="mb-8">
            {email.body && email.body.includes('<') ? (
              <div
                className="email-body"
                style={{
                  color: '#334155',
                  lineHeight: '1.6',
                }}
                dangerouslySetInnerHTML={{ __html: email.body }}
              />
            ) : (
              <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {email.body || email.preview}
              </div>
            )}
          </div>

          {/* Attachments */}
          {email.hasAttachments && (
            <div className="mb-8">
              <h4 className="text-sm font-semibold text-slate-900 mb-3">
                2 Adjuntos
              </h4>
              <div className="flex gap-4 flex-wrap">
                <div className="group relative w-48 h-32 rounded-lg overflow-hidden border border-slate-200 cursor-pointer">
                  <img
                    style={{ aspectRatio: '4/3' }}
                    src="data:image/svg+xml;base64,IDxzdmcgd2lkdGg9IjEwMjQiIGhlaWdodD0iMTAyNCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+IDxkZWZzPiA8bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSItMTAwJSIgeTE9IjAiIHgyPSIwIiB5Mj0iMCI+IDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2IwYjBiMCIvPiA8c3RvcCBvZmZzZXQ9Ii41IiBzdG9wLWNvbG9yPSIjZjBmMGYwIi8+IDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2IwYjBiMCIvPiA8YW5pbWF0ZVRyYW5zZm9ybSBpZD0iYSIgYXR0cmlidXRlTmFtZT0iZ3JhZGllbnRUcmFuc2Zvcm0iIHR5cGU9InRyYW5zbGF0ZSIgZnJvbT0iMCIgdG89IjIiIGR1cj0iMXMiIGJlZ2luPSIwcyIvPiA8YW5pbWF0ZVRyYW5zZm9ybSBpZD0iYiIgYXR0cmlidXRlTmFtZT0iZ3JhZGllbnRUcmFuc2Zvcm0iIHR5cGU9InRyYW5zbGF0ZSIgZnJvbT0iMCIgdG89IjIiIGR1cj0iMS41cyIgYmVnaW49ImEuZW5kIi8+IDxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9ImdyYWRpZW50VHJhbnNmb3JtIiB0eXBlPSJ0cmFuc2xhdGUiIGZyb209IjAiIHRvPSIyIiBkdXI9IjJzIiBiZWdpbj0iYi5lbmQiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIi8+IDwvbGluZWFyR3JhZGllbnQ+IDwvZGVmcz4gPHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9InVybCgjZykiLz4gPC9zdmc+"
                    go-data-src="/gen?prompt=modern+architectural+building+blueprint+sketch&aspect=4:3"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white">
                      download
                    </span>
                  </div>
                </div>
                <div className="group relative w-48 h-32 rounded-lg overflow-hidden border border-slate-200 cursor-pointer bg-slate-50 flex items-center justify-center">
                  <div className="text-center">
                    <span className="material-symbols-outlined text-red-500 text-4xl mb-1">
                      picture_as_pdf
                    </span>
                    <p className="text-xs font-medium text-slate-600">
                      Contrato_V2.pdf
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-black/5 bg-opacity-0 group-hover:bg-opacity-100 transition-all"></div>
                </div>
              </div>
            </div>
          )}

          {/* Reply Box */}
          <div className="flex gap-4 mt-8 pt-8 border-t border-slate-100">
            <Avatar
              name={localStorage.getItem('email') || 'Usuario'}
              email={localStorage.getItem('email') || undefined}
              size={40}
            />
            <div className="flex-1 relative group">
              <div className="absolute inset-0 border border-slate-300 rounded-lg shadow-sm pointer-events-none group-focus-within:ring-2 group-focus-within:ring-blue-100 group-focus-within:border-blue-500 transition-all"></div>
              <textarea
                className="w-full min-h-[100px] p-4 rounded-lg outline-none resize-none bg-white text-slate-700"
                placeholder="Escribe una respuesta..."
              ></textarea>
              <div className="flex items-center justify-between px-2 py-2 bg-slate-50 rounded-b-lg border-x border-b border-slate-300 -mt-1 relative z-10">
                <div className="flex gap-1 text-slate-500">
                  <button className="p-2 hover:bg-slate-200 rounded">
                    <span className="material-symbols-outlined text-[20px]">
                      format_bold
                    </span>
                  </button>
                  <button className="p-2 hover:bg-slate-200 rounded">
                    <span className="material-symbols-outlined text-[20px]">
                      attach_file
                    </span>
                  </button>
                  <button className="p-2 hover:bg-slate-200 rounded">
                    <span className="material-symbols-outlined text-[20px]">
                      image
                    </span>
                  </button>
                  <button className="p-2 hover:bg-slate-200 rounded">
                    <span className="material-symbols-outlined text-[20px]">
                      mood
                    </span>
                  </button>
                </div>
                <button
                  onClick={() => {
                    const { showToast } = useEmailStore.getState();
                    showToast('Respuesta enviada');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm"
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

