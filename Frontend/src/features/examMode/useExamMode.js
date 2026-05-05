import { useState, useEffect } from 'react';
import { getExamData, getNotes, getQuiz } from '../../services/zeroFrictionApi';
import { useAppContext } from '../../context/AppContext';

export const useExamMode = (sessionId) => {
  const { notes, setNotes, quizQuestions, setQuizQuestions } = useAppContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let pollInterval;
    
    const generatePackage = async () => {
      // 1. If we have notes, transform and finish
      if (notes && notes.topics && notes.topics.length > 0) {
        const transformedData = {
          topic_title: notes.topic_title || "Exam Revision Package",
          key_concepts: notes.key_highlights || notes.topics.map(t => t.name),
          definitions: notes.topics.map(t => ({
            term: t.name,
            definition: t.summary
          })),
          memory_shortcuts: notes.topics.map(t => ({
            concept: t.name,
            trick: t.intuition || "Connect this concept to a real-world scenario."
          })).filter(t => t.trick !== null),
          exam_questions: quizQuestions?.slice(0, 5).map(q => ({
            question: q.question_text || q.question,
            answer_hint: (q.source_text || q.answer_hint || "").substring(0, 100) + "..."
          })) || [],
          last_minute_tips: notes.topics.map(t => t.common_mistake).filter(t => t),
          formulas: []
        };
        
        setData(transformedData);
        setLoading(false);
        if (pollInterval) clearInterval(pollInterval);
        return;
      }

      // 2. If no notes in context, try to fetch them from API
      if (sessionId && !notes) {
        try {
          const notesData = await getNotes(sessionId);
          if (notesData) {
            setNotes(notesData);
            const quizData = await getQuiz(sessionId);
            setQuizQuestions(quizData);
          }
        } catch (err) {
          console.log("Exam Mode: Still waiting for AI analysis...");
        }
      }
    };

    // Initial check
    generatePackage();

    // Setup polling for the "Processing" state
    pollInterval = setInterval(generatePackage, 3000);

    return () => clearInterval(pollInterval);
  }, [sessionId, notes, quizQuestions, setNotes, setQuizQuestions]);

  return { data, loading, error };
};
