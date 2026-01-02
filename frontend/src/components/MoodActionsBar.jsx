export default function MoodActionsBar({ onHistory, onAnalytics, onReco, onExport }) {
  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-5xl mx-auto flex gap-4 py-4 px-4 justify-center">
        {[
          ["Mood History", onHistory],
          ["Mood Analytics", onAnalytics],
          ["Recommendations", onReco],
          ["Export Data", onExport],
        ].map(([label, cb]) => (
          <button
            key={label}
            onClick={cb}
            className="px-5 py-2 rounded-full border border-[#EEA727] text-[#4D2B8C] hover:bg-[#FFEF5F] transition font-medium"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
