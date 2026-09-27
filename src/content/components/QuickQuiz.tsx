import React, { useState } from 'react';

interface QuickQuizProps {
  quiz: {
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string;
  };
}

export const QuickQuiz: React.FC<QuickQuizProps> = ({ quiz }) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (idx: number) => {
    setSelectedIdx(idx);
    setRevealed(true);
  };

  return (
    <div style={{ marginTop: '10px', padding: '10px 12px', background: 'rgba(37, 99, 235, 0.05)', borderRadius: '10px', border: '1px solid rgba(37, 99, 235, 0.12)' }}>
      <div style={{ fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#2563eb', marginBottom: '6px' }}>
        🧠 Quick Check
      </div>
      <div style={{ fontSize: '12.5px', fontWeight: 550, marginBottom: '8px', lineHeight: '1.45' }}>
        {quiz.question}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {quiz.options.map((opt, idx) => {
          const isSelected = selectedIdx === idx;
          const isCorrect = idx === quiz.answerIndex;
          let btnStyle: React.CSSProperties = {
            textAlign: 'left',
            padding: '6px 10px',
            fontSize: '12px',
            borderRadius: '8px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            background: 'rgba(255, 255, 255, 0.75)',
            cursor: revealed ? 'default' : 'pointer',
            transition: 'all 0.12s ease',
            color: 'inherit',
          };

          if (revealed) {
            if (isCorrect) {
              btnStyle.background = 'rgba(34, 197, 94, 0.15)';
              btnStyle.borderColor = 'rgba(34, 197, 94, 0.4)';
              btnStyle.color = '#15803d';
              btnStyle.fontWeight = 600;
            } else if (isSelected) {
              btnStyle.background = 'rgba(239, 68, 68, 0.12)';
              btnStyle.borderColor = 'rgba(239, 68, 68, 0.35)';
              btnStyle.color = '#b91c1c';
            }
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={revealed}
              onClick={() => handleSelect(idx)}
              style={btnStyle}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {revealed && (
        <div style={{ marginTop: '8px', fontSize: '11.5px', lineHeight: '1.4', color: selectedIdx === quiz.answerIndex ? '#15803d' : '#64748b' }}>
          {selectedIdx === quiz.answerIndex ? '✓ Correct! ' : 'ℹ Note: '}
          {quiz.explanation}
        </div>
      )}
    </div>
  );
};
