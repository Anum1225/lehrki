export const generateAutomatedFeedback = (studentData) => {
  const { score, timeSpent, attempts, subject } = studentData;
  
  let feedback = {
    overall: '',
    strengths: [],
    improvements: [],
    recommendations: []
  };

  // Overall performance feedback
  if (score >= 90) {
    feedback.overall = 'Excellent work! You demonstrate strong mastery of the material.';
    feedback.strengths.push('Exceptional understanding of key concepts');
    feedback.recommendations.push('Consider helping peers or exploring advanced topics');
  } else if (score >= 80) {
    feedback.overall = 'Good job! You have a solid understanding with room for improvement.';
    feedback.strengths.push('Good grasp of fundamental concepts');
    feedback.improvements.push('Review areas where points were lost');
    feedback.recommendations.push('Practice similar problems to reinforce learning');
  } else if (score >= 70) {
    feedback.overall = 'Fair performance. Focus on strengthening your understanding.';
    feedback.improvements.push('Need to review core concepts more thoroughly');
    feedback.recommendations.push('Schedule additional study time', 'Seek help from teacher or tutor');
  } else {
    feedback.overall = 'This topic needs more attention. Don\'t get discouraged!';
    feedback.improvements.push('Fundamental concepts need reinforcement');
    feedback.recommendations.push('Review course materials', 'Practice basic problems first', 'Consider one-on-one tutoring');
  }

  // Time-based feedback
  if (timeSpent < 300) { // Less than 5 minutes
    feedback.improvements.push('Consider spending more time reading questions carefully');
  } else if (timeSpent > 1800) { // More than 30 minutes
    feedback.improvements.push('Work on time management and decision-making speed');
  }

  // Attempt-based feedback
  if (attempts > 1) {
    feedback.strengths.push('Shows persistence and willingness to improve');
  }

  // Subject-specific feedback
  const subjectTips = {
    mathematics: ['Practice daily calculations', 'Review formulas regularly', 'Work through step-by-step solutions'],
    science: ['Connect concepts to real-world examples', 'Review scientific method', 'Practice lab procedures'],
    english: ['Read more diverse texts', 'Practice writing regularly', 'Expand vocabulary'],
    history: ['Create timelines for better understanding', 'Connect events to causes and effects', 'Practice essay writing']
  };

  if (subjectTips[subject?.toLowerCase()]) {
    feedback.recommendations.push(...subjectTips[subject.toLowerCase()]);
  }

  return feedback;
};

export const generateProgressInsights = (studentHistory) => {
  if (!studentHistory || studentHistory.length < 2) {
    return { trend: 'insufficient_data', message: 'Complete more assessments to see progress insights.' };
  }

  const scores = studentHistory.map(h => h.score);
  const recent = scores.slice(-3);
  const earlier = scores.slice(0, -3);
  
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const earlierAvg = earlier.length > 0 ? earlier.reduce((a, b) => a + b, 0) / earlier.length : recentAvg;
  
  const improvement = recentAvg - earlierAvg;
  
  if (improvement > 10) {
    return { 
      trend: 'improving', 
      message: `Great progress! Your scores have improved by ${improvement.toFixed(1)} points on average.`,
      recommendation: 'Keep up the excellent work and maintain your study routine.'
    };
  } else if (improvement > 5) {
    return { 
      trend: 'slight_improvement', 
      message: `You're making steady progress with a ${improvement.toFixed(1)} point improvement.`,
      recommendation: 'Continue your current approach and consider increasing study time slightly.'
    };
  } else if (improvement < -10) {
    return { 
      trend: 'declining', 
      message: `Your recent scores show a ${Math.abs(improvement).toFixed(1)} point decline.`,
      recommendation: 'Consider reviewing your study methods and seeking additional help.'
    };
  } else {
    return { 
      trend: 'stable', 
      message: 'Your performance has been consistent.',
      recommendation: 'Focus on challenging yourself with more advanced problems.'
    };
  }
};