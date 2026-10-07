import React, { useState } from "react";
import { CheckCircle2, XCircle, Award, RotateCcw, ArrowRight, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Given Table A has 4 rows and Table B has 3 rows. How many rows will a CROSS JOIN always produce?",
    options: [
      { text: "7 rows (4 + 3)", isCorrect: false },
      { text: "12 rows (4 × 3)", isCorrect: true },
      { text: "At most 4 rows", isCorrect: false },
      { text: "Depends on whether keys match", isCorrect: false }
    ],
    explanation: "A CROSS JOIN evaluates the Cartesian product of two relations without any predicate filter. Therefore, the resulting cardinality is strictly |A| × |B| = 4 × 3 = 12."
  },
  {
    id: 2,
    question: "If an Employee row has a department_id of NULL, will it appear in an INNER JOIN on department_id?",
    options: [
      { text: "Yes, matched with NULL departments in the right table", isCorrect: false },
      { text: "No, because NULL = NULL evaluates to UNKNOWN/FALSE in SQL three-valued logic", isCorrect: true },
      { text: "Yes, because all employees must be shown", isCorrect: false },
      { text: "Only if department_id is defined as a primary key", isCorrect: false }
    ],
    explanation: "In SQL, comparisons involving NULL evaluate to UNKNOWN. An INNER JOIN predicate requires the join condition to evaluate strictly to TRUE. Hence, NULL keys never match."
  },
  {
    id: 3,
    question: "Which JOIN operation guarantees that NO tuples from Table A will ever be omitted, regardless of matches in Table B?",
    options: [
      { text: "INNER JOIN", isCorrect: false },
      { text: "RIGHT OUTER JOIN", isCorrect: false },
      { text: "LEFT OUTER JOIN (and FULL OUTER JOIN)", isCorrect: true },
      { text: "NATURAL JOIN", isCorrect: false }
    ],
    explanation: "LEFT OUTER JOIN preserves every tuple from the left relation (Table A). Tuples lacking a match in Table B have their Table B attributes filled with NULL."
  },
  {
    id: 4,
    question: "How does a NATURAL JOIN differ from an explicit equijoin (INNER JOIN with ON condition)?",
    options: [
      { text: "NATURAL JOIN is much slower than INNER JOIN", isCorrect: false },
      { text: "NATURAL JOIN automatically joins on all columns with identical names and does NOT duplicate the join column in the output schema", isCorrect: true },
      { text: "NATURAL JOIN only works with numerical primary keys", isCorrect: false },
      { text: "NATURAL JOIN produces a Cartesian product", isCorrect: false }
    ],
    explanation: "NATURAL JOIN inspects schemas of both relations, matches all identically named columns, and projects the common join attributes only once in the final relation."
  },
  {
    id: 5,
    question: "In relational algebra, what does the symbol R ⟕ S represent?",
    options: [
      { text: "Cartesian product", isCorrect: false },
      { text: "Natural Join", isCorrect: false },
      { text: "Left Outer Join", isCorrect: true },
      { text: "Full Outer Join", isCorrect: false }
    ],
    explanation: "The bow-tie symbol with two open prongs on the left (⟕) denotes the Left Outer Join operator in Codd's Extended Relational Algebra."
  }
];

export function PracticeQuizPage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (currentQ.options[index].isCorrect) {
      setScore((prev) => prev + 1);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const handleNext = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.6 }
      });
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Quiz Header */}
      <div className="text-center space-y-2">
        <div 
          className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider"
          style={{
            backgroundColor: "var(--bg-elevated)",
            color: "var(--color-accent)",
            border: "1px solid var(--border-subtle)"
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Knowledge Assessment</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black" style={{ color: "var(--text-main)" }}>
          Predict the Result: JOIN Quiz Challenge
        </h2>
        <p className="text-xs sm:text-sm" style={{ color: "var(--text-muted)" }}>
          Test your relational database theory and join operation mechanics.
        </p>
      </div>

      {!quizFinished ? (
        <div 
          className="border rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 transition-colors"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-subtle)"
          }}
        >
          {/* Progress bar */}
          <div className="flex items-center justify-between text-xs font-bold" style={{ color: "var(--text-muted)" }}>
            <span>Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}</span>
            <span>Current Score: {score} / {QUIZ_QUESTIONS.length}</span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-elevated)" }}>
            <div 
              className="h-full transition-all duration-300"
              style={{ 
                width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%`,
                background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))"
              }}
            />
          </div>

          {/* Question Text */}
          <h3 className="text-base sm:text-lg font-bold leading-relaxed" style={{ color: "var(--text-main)" }}>
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, oIdx) => {
              let isSelected = selectedOption === oIdx;
              return (
                <button
                  key={oIdx}
                  onClick={() => handleSelectOption(oIdx)}
                  disabled={isAnswered}
                  className="w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between"
                  style={{
                    backgroundColor: isAnswered && opt.isCorrect 
                      ? "rgba(16, 185, 129, 0.1)" 
                      : isAnswered && isSelected && !opt.isCorrect 
                      ? "rgba(239, 68, 68, 0.1)" 
                      : "var(--bg-elevated)",
                    borderColor: isAnswered && opt.isCorrect 
                      ? "var(--semantic-success)" 
                      : isAnswered && isSelected && !opt.isCorrect 
                      ? "var(--semantic-error)" 
                      : "var(--border-subtle)",
                    color: "var(--text-main)",
                    opacity: isAnswered && !opt.isCorrect && !isSelected ? 0.5 : 1
                  }}
                >
                  <span>{opt.text}</span>
                  {isAnswered && opt.isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                  )}
                  {isAnswered && isSelected && !opt.isCorrect && (
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {isAnswered && (
            <div 
              className="p-4 rounded-2xl border text-xs space-y-1"
              style={{
                backgroundColor: "var(--bg-elevated)",
                borderColor: "var(--border-subtle)",
                color: "var(--text-main)"
              }}
            >
              <span className="font-bold uppercase tracking-wider block text-[10px]" style={{ color: "var(--color-primary)" }}>
                Theoretical Explanation
              </span>
              <p className="leading-relaxed" style={{ color: "var(--text-muted)" }}>{currentQ.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="flex items-center space-x-1.5 px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}
              >
                <span>{currentIdx < QUIZ_QUESTIONS.length - 1 ? "Next Question" : "Complete Challenge"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Completion Score Card */
        <div 
          className="border rounded-3xl p-8 sm:p-12 shadow-xs text-center space-y-6 transition-colors"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-subtle)"
          }}
        >
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
            style={{ backgroundColor: "rgba(139, 92, 246, 0.15)", color: "var(--color-accent)" }}
          >
            <Award className="w-8 h-8" />
          </div>

          <h3 className="text-2xl font-black" style={{ color: "var(--text-main)" }}>
            Quiz Assessment Completed!
          </h3>

          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            You scored <strong className="text-lg" style={{ color: "var(--color-primary)" }}>{score}</strong> out of <strong>{QUIZ_QUESTIONS.length}</strong> questions correctly ({Math.round((score / QUIZ_QUESTIONS.length) * 100)}%).
          </p>

          <button
            onClick={handleRestart}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl text-white font-bold text-xs shadow-md transition-transform hover:scale-105"
            style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Challenge</span>
          </button>
        </div>
      )}
    </div>
  );
}
