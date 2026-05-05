const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:8000';
const API_VERSION = '1.0.0';

let demoSubmitCount = 0;

const wrap = (data) => ({
  status: 'success',
  data,
  meta: {
    timestamp: new Date().toISOString(),
    version: API_VERSION,
  },
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'fallback-' + Math.random().toString(36).substring(2, 11);
};

const logTiming = (endpoint, startTime) => {
  const duration = (performance.now() - startTime).toFixed(2);
  console.log(`[UI_TIMING] ${endpoint} took ${duration}ms`);
  return duration;
};

const assertSuccess = (payload, endpoint) => {
  if (!payload || payload.status !== 'success' || !('data' in payload)) {
    console.error(`[API_CONTRACT_VIOLATION] ${endpoint}`, payload);
    throw new Error(`Unexpected API response from ${endpoint}`);
  }
  return payload.data;
};

const request = async (endpoint, options = {}) => {
  if (!API_BASE_URL) {
    console.warn(`[API_CONFIG] No base URL found, using fallback logic.`);
    return null;
  }

  const startTime = performance.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    console.log(`[API_START] ${endpoint}`, options.method || 'GET');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    logTiming(endpoint, startTime);
    
    if (!response.ok) {
      console.error(`[API_ERROR] ${endpoint} status: ${response.status}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.error(`[API_TIMEOUT] ${endpoint} timed out after 10s`);
    } else {
      console.warn(`[NETWORK_FAILURE] ${endpoint} falling back to demo:`, error);
    }
    return null;
  }
};

const demoNotes = {
  note_id: 1,
  topic_title: 'Neural Networks (Fallback)',
  content_markdown: [
    '# Introduction to Neural Networks',
    '',
    '## Biological Inspiration',
    'Neural networks are loosely inspired by the human brain.',
    '',
    '## Network Architecture',
    '- Input Layer: receives raw data features.',
    '- Hidden Layers: transform signals.',
    '- Output Layer: produces predictions.',
  ].join('\n'),
  key_highlights: ['Activation Functions', 'Forward Propagation', 'Hidden Layers'],
};

const demoQuestions = [
  { q_id: 101, question_text: 'What is the primary function of an activation function?', options: ['Introduce non-linearity', 'Store data', 'Clean noise', 'Reduce size'] },
  { q_id: 102, question_text: 'Which algorithm updates weights?', options: ['K-Means', 'Gradient Descent', 'PCA', 'Dijkstra'] },
  { q_id: 103, question_text: 'What is backpropagation used for?', options: ['Error calculation', 'Data storage', 'Weight updates', 'Input reading'] },
];

const demoSubmitResponses = [
  {
    is_correct: true,
    correct_index: 0,
    learner_state: { state_label: 'MASTERED', state_color: 'green', message: "You're a concept pro!", action_label: 'Next Topic' },
    explanation: { text: 'Correct! Non-linearity is essential.', misconception_warning: null },
    recommendation: { next_step: 'ADVANCE', label: 'Start Advanced Level', type: 'challenge' },
  },
  {
    is_correct: false,
    correct_index: 1,
    learner_state: { state_label: 'MISCONCEPTION', state_color: 'red', message: 'Wait! Let\'s clear something up.', action_label: 'Review Concept' },
    explanation: { text: 'Gradient descent updates weights.', misconception_warning: 'High confidence on a wrong answer.' },
    recommendation: { next_step: 'RETEACH', label: 'Review Basics', type: 'reteach' },
  },
];

export const uploadLecture = async (file) => {
  const endpoint = '/upload';
  const formData = new FormData();
  formData.append('file', file || new Blob(['demo'], { type: 'text/plain' }), 'demo.txt');

  const payload = await request(endpoint, { method: 'POST', body: formData });
  if (payload) return assertSuccess(payload, endpoint);

  console.log('[FALLBACK] Entering recovery mode for upload.');
  await delay(1200);
  demoSubmitCount = 0;
  return assertSuccess(wrap({ session_id: generateUUID(), transcript_text: 'Demo transcript...', processing_time_ms: 1200 }), endpoint);
};

export const getNotes = async (sessionId) => {
  const endpoint = `/notes/${sessionId}`;
  const payload = await request(endpoint);
  if (payload) return assertSuccess(payload, endpoint);

  console.log('[FALLBACK] Entering recovery mode for notes.');
  await delay(400);
  return assertSuccess(wrap(demoNotes), endpoint);
};

export const getQuiz = async (sessionId) => {
  const endpoint = `/quiz/${sessionId}`;
  const payload = await request(endpoint);
  if (payload) return assertSuccess(payload, endpoint);

  console.log('[FALLBACK] Entering recovery mode for quiz.');
  await delay(400);
  return assertSuccess(wrap(demoQuestions), endpoint);
};

export const submitAnswer = async (sessionId, answer) => {
  const endpoint = `/submit/${sessionId}`;
  const payload = await request(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(answer),
  });

  if (payload) return assertSuccess(payload, endpoint);

  console.log('[FALLBACK] Entering recovery mode for submission.');
  await delay(350);
  const response = demoSubmitResponses[Math.min(demoSubmitCount, demoSubmitResponses.length - 1)];
  demoSubmitCount += 1;
  return assertSuccess(wrap(response), endpoint);
};
