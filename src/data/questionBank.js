/**
 * Question Bank Data Layer & Service Engine
 * Provides scalable querying, filtering, randomized generation, and statistical metrics
 * for both Verified GATE CSE PYQs and Interactive Practice questions.
 */

import { VERIFIED_GATE_PYQS } from "./gatePyqs.js";
import { INTERACTIVE_QUESTIONS } from "./interactiveQuestions.js";

/**
 * Fisher-Yates shuffle algorithm for un-biased randomized question selections
 */
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Retrieves eligible questions matching all supplied filter criteria.
 * Strictly isolates 'gate' mode (sourceType: 'verified-gate-pyq') from
 * 'practice' mode (sourceType: 'interactive-practice').
 *
 * @param {Object} filters
 * @param {'gate' | 'practice'} filters.mode
 * @param {string} [filters.difficulty='ALL'] 'ALL' | 'Easy' | 'Medium' | 'Hard'
 * @param {string} [filters.topic='ALL']
 * @param {string} [filters.subtopic='ALL']
 * @param {string} [filters.questionType='ALL'] 'ALL' | 'MCQ' | 'MSQ' | 'NAT'
 * @param {string|number} [filters.marks='ALL'] 'ALL' | 1 | 2
 * @returns {Array} List of matching questions
 */
export function getEligibleQuestions(filters = {}) {
  const {
    mode = "gate",
    difficulty = "ALL",
    topic = "ALL",
    subtopic = "ALL",
    questionType = "ALL",
    marks = "ALL"
  } = filters;

  const basePool = mode === "gate" ? VERIFIED_GATE_PYQS : INTERACTIVE_QUESTIONS;

  return basePool.filter((q) => {
    // 1. Difficulty filter
    if (difficulty !== "ALL" && q.difficulty && q.difficulty.toLowerCase() !== difficulty.toLowerCase()) {
      return false;
    }

    // 2. Topic filter
    if (topic !== "ALL" && q.topic && q.topic.toLowerCase() !== topic.toLowerCase()) {
      return false;
    }

    // 3. Subtopic filter
    if (subtopic !== "ALL" && q.subtopic && q.subtopic.toLowerCase() !== subtopic.toLowerCase()) {
      return false;
    }

    // 4. Question Type filter (normalize 'type' and 'questionType')
    const qType = q.questionType || q.type;
    if (questionType !== "ALL" && qType && qType.toUpperCase() !== questionType.toUpperCase()) {
      return false;
    }

    // 5. Marks filter (predominantly GATE)
    if (marks !== "ALL" && q.marks !== undefined && Number(q.marks) !== Number(marks)) {
      return false;
    }

    return true;
  });
}

/**
 * Returns the exact count of eligible questions for the specified filter criteria.
 * Dynamic calculation from array length, never hardcoded.
 */
export function getQuestionCount(filters = {}) {
  return getEligibleQuestions(filters).length;
}

/**
 * Generates a randomized test without duplicates within the test.
 * Preserves all original question metadata.
 *
 * @param {Object} filters Filter parameters
 * @param {number} count Requested number of questions
 * @returns {Array} Array of selected question objects
 */
export function generateTest(filters = {}, count = 10) {
  const eligible = getEligibleQuestions(filters);
  if (!eligible || eligible.length === 0) return [];

  const shuffled = shuffleArray(eligible);
  const countToPick = Math.min(Math.max(1, count), shuffled.length);
  return shuffled.slice(0, countToPick);
}

/**
 * Returns dynamic, computed statistics for the active question bank mode.
 * Never hard-coded.
 *
 * @param {'gate' | 'practice'} mode
 * @returns {Object} Statistics breakdown
 */
export function getQuestionBankStats(mode = "gate") {
  const pool = mode === "gate" ? VERIFIED_GATE_PYQS : INTERACTIVE_QUESTIONS;
  const total = pool.length;

  let easy = 0;
  let medium = 0;
  let hard = 0;
  let mcq = 0;
  let msq = 0;
  let nat = 0;
  let marks1 = 0;
  let marks2 = 0;

  const topicsSet = new Set();

  pool.forEach((q) => {
    // Difficulty
    const diff = (q.difficulty || "").toLowerCase();
    if (diff === "easy") easy++;
    else if (diff === "medium") medium++;
    else if (diff === "hard") hard++;

    // Type
    const type = (q.questionType || q.type || "").toUpperCase();
    if (type === "MCQ") mcq++;
    else if (type === "MSQ") msq++;
    else if (type === "NAT") nat++;

    // Marks
    if (q.marks === 1) marks1++;
    else if (q.marks === 2) marks2++;

    // Topic
    if (q.topic) topicsSet.add(q.topic);
  });

  return {
    mode,
    total,
    difficulty: {
      easy,
      medium,
      hard
    },
    types: {
      mcq,
      msq,
      nat
    },
    marks: {
      marks1,
      marks2
    },
    topicsCount: topicsSet.size
  };
}

/**
 * Dynamically retrieves all unique topics available in a given bank
 */
export function getAllTopics(mode = "gate") {
  const pool = mode === "gate" ? VERIFIED_GATE_PYQS : INTERACTIVE_QUESTIONS;
  const topics = new Set();
  pool.forEach((q) => {
    if (q.topic) topics.add(q.topic);
  });
  return Array.from(topics).sort();
}

/**
 * Dynamically retrieves all unique question types available in a given bank
 */
export function getAllQuestionTypes(mode = "gate") {
  const pool = mode === "gate" ? VERIFIED_GATE_PYQS : INTERACTIVE_QUESTIONS;
  const types = new Set();
  pool.forEach((q) => {
    const t = q.questionType || q.type;
    if (t) types.add(t);
  });
  return Array.from(types).sort();
}

export { VERIFIED_GATE_PYQS, INTERACTIVE_QUESTIONS };
