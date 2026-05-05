const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '';
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

const assertSuccess = (payload, endpoint) => {
  if (!payload || payload.status !== 'success' || !('data' in payload)) {
    throw new Error(`Unexpected API response from ${endpoint}`);
  }

  return payload.data;
};

const request = async (endpoint, options = {}) => {
  if (!API_BASE_URL) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
      console.warn(`API request failed: ${response.status} ${response.statusText}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.warn('Network or API error, falling back to demo:', error);
    return null;
  }
};

const demoNotes = {
  note_id: 1,
  topic_title: 'Neural Networks',
  content_markdown: [
    '# Introduction to Neural Networks',
    '',
    'This lecture covers the fundamental concepts of artificial neural networks, focusing on structure, forward propagation, and the role of activation functions.',
    '',
    '## Biological Inspiration',
    'Neural networks are loosely inspired by the human brain. Artificial neurons take inputs, apply weights, and pass the result through an activation function.',
    '',
    '## Network Architecture',
    '- Input Layer: receives raw data features.',
    '- Hidden Layers: transform signals and extract patterns.',
    '- Output Layer: produces the prediction or classification.',
  ].join('\n'),
  key_highlights: ['Activation Functions', 'Forward Propagation', 'Hidden Layers'],
};

const demoQuestions = [
  {
    q_id: 101,
    question_text: 'What is the primary function of an activation function in a neural network?',
    options: [
      'To initialize weights',
      'To introduce non-linearity into the network',
      'To calculate the loss',
      'To normalize the input data',
    ],
  },
  {
    q_id: 102,
    question_text: 'Which algorithm is commonly used to update weights during training?',
    options: [
      'K-Means Clustering',
      'Principal Component Analysis',
      'Gradient Descent',
      'Support Vector Machines',
    ],
  },
];

const demoSubmitResponses = [
  {
    is_correct: true,
    correct_index: 1,
    learner_state: {
      state_label: 'MASTERED',
      state_color: 'green',
      message: "You're a concept pro!",
      action_label: 'Next Topic',
    },
    explanation: {
      text: 'Activation functions introduce non-linearity, which lets neural networks learn complex patterns.',
      misconception_warning: null,
    },
    recommendation: {
      next_step: 'ADVANCE',
      label: 'Start Advanced Level',
      type: 'challenge',
    },
  },
  {
    is_correct: false,
    correct_index: 2,
    learner_state: {
      state_label: 'MISCONCEPTION',
      state_color: 'red',
      message: 'High confidence on a wrong answer means this concept needs a careful reset.',
      action_label: 'Review Concept',
    },
    explanation: {
      text: 'Gradient descent is the algorithm commonly used to update weights during training.',
      misconception_warning: 'PCA can reduce dimensionality, but it does not train neural network weights.',
    },
    recommendation: {
      next_step: 'RETEACH',
      label: 'Review Backpropagation Basics',
      type: 'reteach',
    },
  },
];

export const uploadLecture = async (file) => {
  const endpoint = '/upload';
  const formData = new FormData();
  if (file) {
    formData.append('file', file);
  } else {
    formData.append('file', new Blob(['demo text'], { type: 'text/plain' }), 'demo.txt');
  }

  const payload = await request(endpoint, {
    method: 'POST',
    body: formData,
  });

  if (payload) {
    return assertSuccess(payload, endpoint);
  }

  await delay(1200);
  demoSubmitCount = 0;

  return assertSuccess(
    wrap({
      session_id: crypto.randomUUID(),
      transcript_text: 'This is a demo transcript covering neural networks, activation functions, forward propagation, and gradient descent.',
      processing_time_ms: 1200,
    }),
    endpoint,
  );
};

export const getNotes = async (sessionId) => {
  const endpoint = `/notes/${sessionId}`;
  const payload = await request(endpoint);

  if (payload) {
    return assertSuccess(payload, endpoint);
  }

  await delay(400);
  return assertSuccess(wrap(demoNotes), endpoint);
};

export const getQuiz = async (sessionId) => {
  const endpoint = `/quiz/${sessionId}`;
  const payload = await request(endpoint);

  if (payload) {
    return assertSuccess(payload, endpoint);
  }

  await delay(400);
  return assertSuccess(wrap(demoQuestions), endpoint);
};

export const submitAnswer = async (sessionId, answer) => {
  const endpoint = `/submit/${sessionId}`;
  const payload = await request(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(answer),
  });

  if (payload) {
    return assertSuccess(payload, endpoint);
  }

  await delay(350);
  const response = demoSubmitResponses[Math.min(demoSubmitCount, demoSubmitResponses.length - 1)];
  demoSubmitCount += 1;
  return assertSuccess(wrap(response), endpoint);
};
