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
  const timeoutId = setTimeout(() => controller.abort(), 180000); // 180s timeout for local LLMs (3 mins)

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

const demoNotesEn = {
  note_id: 1,
  topic_title: 'Machine Learning Basics',
  topics: [
    {
      name: 'Supervised Learning',
      summary: 'Learning from labeled data to predict future results.',
      intuition: 'Like a teacher giving you a test with answers.',
      when_to_use: ['Price prediction', 'Spam filtering'],
      common_mistake: 'Relying too much on training data (Overfitting).',
      real_world_example: 'Email spam detection.',
      key_concepts: ['Labels', 'Features', 'Training']
    }
  ],
  content_markdown: '# Intro to ML\n\n## Supervised Learning\nThis is the most common type.',
  key_highlights: ['Supervised', 'Unsupervised'],
};

const demoNotesHi = {
  note_id: 1,
  topic_title: 'मशीन लर्निंग के मूल सिद्धांत',
  topics: [
    {
      name: 'सुपरवाइज्ड लर्निंग',
      summary: 'लेबल किए गए डेटा से सीखना ताकि भविष्य के डेटा के लिए परिणाम की भविष्यवाणी की जा सके।',
      intuition: 'एक शिक्षक की तरह जो आपको उत्तर के साथ गणित का परीक्षण देता है।',
      when_to_use: ['कीमत की भविष्यवाणी', 'स्पैम फ़िल्टरिंग'],
      common_mistake: 'ट्रेनिंग डेटा पर बहुत अधिक निर्भर होना (Overfitting)।',
      real_world_example: 'ईमेल स्पैम डिटेक्शन।',
      key_concepts: ['लेबल्स', 'फीचर्स', 'ट्रेनिंग']
    }
  ],
  content_markdown: '# मशीन लर्निंग परिचय\n\n## सुपरवाइज्ड लर्निंग\nयह सबसे आम प्रकार की मशीन लर्निंग है।',
  key_highlights: ['सुपरवाइज्ड लर्निंग', 'अनसुपरवाइज्ड लर्निंग'],
};

const demoQuestionsEn = [
  { q_id: 101, question_text: 'What is the main component of Supervised Learning?', options: ['Labeled Data', 'Unlabeled Data', 'Only Images', 'None'], concept_tested: 'Supervised Learning', is_trap: false },
  { q_id: 102, question_text: 'Is Clustering a Supervised Learning technique?', options: ['Yes', 'No', 'Maybe', 'IDK'], concept_tested: 'Clustering Type', is_trap: true },
];

const demoQuestionsHi = [
  { q_id: 101, question_text: 'सुपरवाइज्ड लर्निंग का मुख्य घटक क्या है?', options: ['लेबल किया गया डेटा', 'बिना लेबल का डेटा', 'केवल इमेज', 'कोई नहीं'], concept_tested: 'Supervised Learning', is_trap: false },
  { q_id: 102, question_text: 'क्या क्लस्टरिंग एक सुपरवाइज्ड लर्निंग तकनीक है?', options: ['हाँ', 'नहीं', 'शायद', 'पता नहीं'], concept_tested: 'Clustering Type', is_trap: true },
];

const demoSubmitResponsesEn = [
  {
    is_correct: true,
    correct_index: 0,
    xp: 10, streak: 1,
    learner_state: { state_label: 'MASTERED', state_color: 'green', message: "Great! You got it.", action_label: 'Next Topic', insight_reason: 'High accuracy + optimal response' },
    explanation: { text: 'Correct! Supervised learning is based on labels.', wrong_belief: null },
    recommendation: { next_step: 'ADVANCE', label: 'Start advanced level', type: 'challenge' },
  },
  {
    is_correct: false,
    correct_index: 1,
    xp: 5, streak: 0,
    learner_state: { state_label: 'MISCONCEPTION', state_color: 'red', message: 'Wait! Misconception detected.', action_label: 'Review', insight_reason: 'High confidence + incorrect answer' },
    explanation: { 
      text: 'Wrong. Clustering is unsupervised.', 
      wrong_belief: 'You thought clustering is supervised.',
      why_wrong: 'Clustering has no labels.',
      correct_concept: 'Unsupervised learning finds patterns.',
      simple_analogy: 'Sorting coins without knowing values.'
    },
    recommendation: { next_step: 'RETEACH', label: 'Review fundamentals', type: 'reteach' },
  },
];

const demoSubmitResponsesHi = [
  {
    is_correct: true,
    correct_index: 0,
    xp: 10, streak: 1,
    learner_state: { state_label: 'MASTERED', state_color: 'green', message: "शानदार! आपने इसे समझ लिया।", action_label: 'अगला विषय', insight_reason: 'High accuracy + optimal response' },
    explanation: { text: 'सही! सुपरवाइज्ड लर्निंग लेबल्स पर आधारित है।', wrong_belief: null },
    recommendation: { next_step: 'ADVANCE', label: 'एडवांस लेवल शुरू करें', type: 'challenge' },
  },
  {
    is_correct: false,
    correct_index: 1,
    xp: 5, streak: 0,
    learner_state: { state_label: 'MISCONCEPTION', state_color: 'red', message: 'रुको! एक गलतफहमी है।', action_label: 'समीक्षा करें', insight_reason: 'High confidence + incorrect answer' },
    explanation: { 
      text: 'गलत। क्लस्टरिंग अनसुपरवाइज्ड है।', 
      wrong_belief: 'आपने सोचा कि क्लस्टरिंग सुपरवाइज्ड है।',
      why_wrong: 'क्लस्टरिंग में लेबल्स नहीं होते।',
      correct_concept: 'अनसुपरवाइज्ड लर्निंग पैटर्न ढूंढता है।',
      simple_analogy: 'बिना लेबल के सिक्कों को छांटना।'
    },
    recommendation: { next_step: 'RETEACH', label: 'बुनियादी बातों की समीक्षा करें', type: 'reteach' },
  },
];

let currentLang = "English";

export const uploadLecture = async (file, targetLanguage = "English") => {
  currentLang = targetLanguage;
  const endpoint = '/upload';
  const formData = new FormData();
  formData.append('file', file || new Blob(['demo'], { type: 'text/plain' }), 'demo.txt');
  formData.append('target_language', targetLanguage);

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
  return assertSuccess(wrap(currentLang === 'Hindi' ? demoNotesHi : demoNotesEn), endpoint);
};

export const getQuiz = async (sessionId) => {
  const endpoint = `/quiz/${sessionId}`;
  const payload = await request(endpoint);
  if (payload) return assertSuccess(payload, endpoint);

  console.log('[FALLBACK] Entering recovery mode for quiz.');
  await delay(400);
  return assertSuccess(wrap(currentLang === 'Hindi' ? demoQuestionsHi : demoQuestionsEn), endpoint);
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
  const responses = currentLang === 'Hindi' ? demoSubmitResponsesHi : demoSubmitResponsesEn;
  const response = responses[Math.min(demoSubmitCount, responses.length - 1)];
  demoSubmitCount += 1;
  return assertSuccess(wrap(response), endpoint);
};

export const getSessionSummary = async (sessionId) => {
  const endpoint = `/summary/${sessionId}`;
  const payload = await request(endpoint);
  if (payload) return assertSuccess(payload, endpoint);
  
  return { 
    status: 'success', 
    accuracy: 50, 
    misconceptions: 1, 
    avg_confidence: 75, 
    xp: 25, 
    streak: 1,
    topic_stats: [{ name: currentLang === 'Hindi' ? 'सुपरवाइज्ड लर्निंग' : 'Supervised Learning', accuracy: 100, state: 'MASTERED' }],
    recommendation: currentLang === 'Hindi' ? 'अभ्यास जारी रखें!' : 'Keep practicing!'
  };
};

export const getFlashcards = async (sessionId) => {
  const endpoint = `/flashcards/${sessionId}`;
  const payload = await request(endpoint);
  if (payload) return assertSuccess(payload, endpoint);
  
  return currentLang === 'Hindi' ? [
    { front: 'सुपरवाइज्ड लर्निंग', back: 'लेबल किए गए डेटा से सीखना।' },
    { front: 'अनसुपरवाइज्ड लर्निंग', back: 'बिना लेबल वाले डेटा में पैटर्न ढूंढना।' }
  ] : [
    { front: 'Supervised Learning', back: 'Learning from labeled data.' },
    { front: 'Unsupervised Learning', back: 'Finding patterns in unlabeled data.' }
  ];
};

export const getDemoConfig = async () => {
  const payload = await request('/config');
  return payload || { demo_mode: true };
};

export const setDemoConfig = async (status) => {
  const payload = await request(`/config?status=${status}`, { method: 'POST' });
  return payload || { demo_mode: status };
};
