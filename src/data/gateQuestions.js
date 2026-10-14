/**
 * Bridge module maintaining backward-compatibility with gateQuestions imports
 * Re-exports from dedicated questionBank, gatePyqs, and interactiveQuestions modules.
 */

export { VERIFIED_GATE_PYQS } from "./gatePyqs.js";
export { INTERACTIVE_QUESTIONS, INTERACTIVE_QUESTIONS as DYNAMIC_PRACTICE_QUESTIONS } from "./interactiveQuestions.js";
export * from "./questionBank.js";
