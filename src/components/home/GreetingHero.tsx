"use client";

export default function GreetingHero() {
  return (
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-text-primary mb-2">
        Hi Dr. Prerna, how can I help you today?
      </h2>
      <p className="text-text-secondary text-base">
        Your AI assistant is ready to help with patient records, diagnoses, and documentation.
      </p>

      <div className="flex items-center justify-center gap-4 mt-6">
        <button className="flex items-center gap-3 px-6 py-3.5 bg-primary text-white rounded-2xl font-semibold text-sm hover:bg-primary-dark transition shadow-md">
          <span className="material-symbols-outlined text-[22px]">mic</span>
          Talk to Me
        </button>
        <button className="flex items-center gap-3 px-6 py-3.5 bg-surface text-text-primary border border-border-light rounded-2xl font-semibold text-sm hover:bg-gray-50 transition">
          <span className="material-symbols-outlined text-[22px]">chat</span>
          Chat with AI
        </button>
      </div>
    </div>
  );
}
