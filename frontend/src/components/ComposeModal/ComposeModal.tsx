import { useState } from 'react';
import { useEmailStore } from '../../store/emailStore';
import { emailService } from '../../services/api';

export default function ComposeModal() {
  const { composeOpen, toggleCompose, showToast, loadEmails } = useEmailStore();
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!to || !subject || !body) {
      showToast('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      await emailService.sendEmail({ to, subject, body });
      toggleCompose();
      showToast('Mensaje enviado');
      setTo('');
      setSubject('');
      setBody('');
      // Recargar emails si es necesario
      if (loadEmails) {
        await loadEmails();
      }
    } catch (error) {
      console.error('Error sending email:', error);
      showToast('Error al enviar mensaje');
    } finally {
      setLoading(false);
    }
  };

  if (!composeOpen) return null;

  return (
    <dialog
      id="compose-modal"
      open={composeOpen}
      className="bg-transparent p-0 w-full max-w-2xl h-[600px] shadow-2xl rounded-t-xl md:rounded-xl backdrop:bg-black/40 fixed bottom-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 m-0 z-50"
    >
      <div className="bg-white h-full flex flex-col rounded-t-xl md:rounded-xl overflow-hidden border border-slate-200 shadow-2xl">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
          <span className="font-medium">Mensaje Nuevo</span>
          <div className="flex gap-2">
            <button className="hover:bg-white/20 p-1 rounded">
              <span className="material-symbols-outlined text-[18px]">
                minimize
              </span>
            </button>
            <button className="hover:bg-white/20 p-1 rounded">
              <span className="material-symbols-outlined text-[18px]">
                open_in_full
              </span>
            </button>
            <button
              onClick={toggleCompose}
              className="hover:bg-white/20 p-1 rounded"
            >
              <span className="material-symbols-outlined text-[18px]">
                close
              </span>
            </button>
          </div>
        </div>
        {/* Modal Form */}
        <div className="flex-1 flex flex-col">
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="Para"
            className="px-4 py-3 border-b border-slate-100 outline-none focus:bg-slate-50 transition-colors"
          />
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Asunto"
            className="px-4 py-3 border-b border-slate-100 outline-none font-medium focus:bg-slate-50 transition-colors"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="flex-1 p-4 outline-none resize-none text-slate-700"
            placeholder="Escribe tu mensaje aquí..."
          ></textarea>
        </div>
        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex gap-2">
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando...' : 'Enviar'}
            </button>
            <button className="p-2 text-slate-500 hover:bg-slate-200 rounded-lg">
              <span className="material-symbols-outlined">attach_file</span>
            </button>
          </div>
          <button
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
            onClick={toggleCompose}
          >
            <span className="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>
    </dialog>
  );
}

