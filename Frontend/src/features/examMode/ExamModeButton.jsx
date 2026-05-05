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
      style={{ backgroundColor: '#8a2be2' }}
      className={`flex items-center gap-2 px-4 py-2 text-white rounded-xl font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all ${className}`}
    >
      <GraduationCap size={18} />
      <span>Exam Mode</span>
    </button>
  );
};

export default ExamModeButton;
