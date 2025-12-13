import EmailDetail from '../EmailDetail/EmailDetail';

export default function EmailDetailPane() {
  return (
    <div
      id="email-detail-pane"
      className="flex-1 bg-slate-50 overflow-hidden flex flex-col absolute inset-0 md:relative transform transition-transform duration-300 z-20 md:z-auto translate-x-full md:translate-x-0"
    >
      <EmailDetail />
    </div>
  );
}

