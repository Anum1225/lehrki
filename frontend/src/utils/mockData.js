export const generateMockAnalytics = (timeRange) => {
  const multipliers = {
    '7d': 0.3,
    '30d': 1,
    '90d': 2.5,
    '1y': 12
  };
  
  const multiplier = multipliers[timeRange] || 1;
  
  return {
    totalStudents: Math.floor(1234 * multiplier),
    quizzesCreated: Math.floor(89 * multiplier),
    averageScore: Math.min(95, 84.2 + (multiplier - 1) * 2),
    studyTime: Math.round((2.4 * multiplier) * 10) / 10,
    chartData: {
      labels: timeRange === '7d' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
              timeRange === '1y' ? ['Q1', 'Q2', 'Q3', 'Q4'] :
              ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [{
        label: 'Quiz Completion Rate',
        data: timeRange === '7d' ? [82, 85, 88, 87, 90, 89, 92] :
              timeRange === '1y' ? [78, 84, 87, 91] :
              [85, 89, 87, 92]
      }]
    }
  };
};

export const mockFeedback = [
  {
    id: 1,
    type: 'feature',
    rating: 5,
    message: 'Love the AI quiz generator! Saves me hours of work.',
    user: 'Teacher A',
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    type: 'bug',
    rating: 3,
    message: 'Export feature sometimes fails on large reports.',
    user: 'Teacher B',
    created_at: '2024-01-14T15:45:00Z'
  }
];

export const mockCommunityPosts = [
  {
    id: 1,
    title: "Best practices for AI-generated quizzes",
    content: "I've been using the AI quiz generator and found these tips helpful...",
    author: "Sarah M.",
    category: "ai-tools",
    likes: 23,
    replies: 8,
    timeAgo: "2 hours ago"
  },
  {
    id: 2,
    title: "Parent communication strategies",
    content: "How do you handle difficult parent conversations?",
    author: "Mike C.",
    category: "teaching-tips",
    likes: 15,
    replies: 12,
    timeAgo: "5 hours ago"
  }
];