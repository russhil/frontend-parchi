"use client";

interface TranscriptInputProps {
  value: string;
  onChange: (val: string) => void;
  isRecording: boolean;
}

const SAMPLE_TRANSCRIPT = `Dr. Reynolds: Good morning Sarah, how are you feeling today?

Sarah: Hi Doctor. The migraines have been getting worse honestly. I had three episodes this past week alone.

Dr. Reynolds: I see. Tell me more about these episodes. Where exactly is the pain?

Sarah: It's always on the right side, kind of behind my eye. It starts as a dull ache in the afternoon and then becomes this intense throbbing. Last Tuesday it was so bad I had to leave work early.

Dr. Reynolds: On a scale of 1 to 10, how would you rate the worst episode?

Sarah: The one on Tuesday was probably an 8. The others were around 6 or 7.

Dr. Reynolds: Any nausea, vomiting, or sensitivity to light?

Sarah: Nausea yes, especially with the bad ones. No vomiting though. And bright lights definitely make it worse — I've been wearing sunglasses indoors which my colleagues find amusing.

Dr. Reynolds: How's the Sumatriptan working for you?

Sarah: It helps somewhat. Takes about 45 minutes to kick in and dulls the pain to maybe a 3 or 4. But I'm worried about taking it too often. I've used it maybe 8 times this month.

Dr. Reynolds: That's a valid concern. How's your sleep been?

Sarah: Not great. Maybe 5 hours a night. Work has been really stressful — we have a big project deadline coming up.

Dr. Reynolds: Are you still taking your Levothyroxine regularly?

Sarah: Yes, every morning. No issues with that.

Dr. Reynolds: Any changes in your asthma? Using the inhaler more often?

Sarah: No, the asthma has been fine actually. Maybe once or twice this month.`;

export default function TranscriptInput({ value, onChange, isRecording }: TranscriptInputProps) {
  return (
    <div className="bg-surface rounded-2xl border border-border-light shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-5 py-4 border-b border-border-light flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">subtitles</span>
          <h3 className="text-sm font-bold text-text-primary">Transcript</h3>
        </div>
        {!value && (
          <button
            onClick={() => onChange(SAMPLE_TRANSCRIPT)}
            className="text-xs text-primary font-medium hover:text-primary-dark transition"
          >
            Paste sample transcript
          </button>
        )}
      </div>

      <div className="flex-1 relative">
        {isRecording && !value && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface/80 z-10">
            <div className="text-center">
              <div className="flex justify-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-primary rounded-full animate-pulse"
                    style={{
                      height: `${16 + Math.random() * 24}px`,
                      animationDelay: `${i * 100}ms`,
                    }}
                  />
                ))}
              </div>
              <p className="text-sm text-text-secondary">Recording in progress...</p>
              <p className="text-xs text-text-secondary mt-1">Speak naturally or paste transcript below</p>
            </div>
          </div>
        )}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Transcript will appear here during the consultation. You can also type or paste a transcript manually."
          className="w-full h-full min-h-[400px] p-5 text-sm text-text-primary leading-relaxed resize-none focus:outline-none"
        />
      </div>
    </div>
  );
}
