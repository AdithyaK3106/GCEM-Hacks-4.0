import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const ExamModeButton = ({ className = "" }) => {
  const navigate = useNavigate();
  const { sessionId: paramId } = useParams();
  const { sessionId: contextId } = useAppContext();
  
  const id = paramId || contextId;

  const handleClick = () => {
    if (id) {
      navigate(`/exam/${id}`);
    }
  };

  if (!id) return null;

  return (
    <button 
      onClick={handleClick}
      className={`flex items-center gap-3 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all ${className}`}
    >
      <GraduationCap size={18} />
      <span>Exam Mode</span>
    </button>
  );
};

export default ExamModeButton;
