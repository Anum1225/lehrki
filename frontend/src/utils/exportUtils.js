export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToPDF = async (content, filename) => {
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>${filename}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
};

export const generateAnalyticsReport = (data) => {
  const reportDate = new Date().toLocaleDateString();
  
  return `
    <h1>Analytics Report - ${reportDate}</h1>
    <h2>Overview</h2>
    <table>
      <tr><th>Metric</th><th>Value</th></tr>
      <tr><td>Total Students</td><td>${data.totalStudents || 0}</td></tr>
      <tr><td>Quizzes Created</td><td>${data.quizzesCreated || 0}</td></tr>
      <tr><td>Average Score</td><td>${data.averageScore || 0}%</td></tr>
      <tr><td>Study Time</td><td>${data.studyTime || '0h'}</td></tr>
    </table>
    
    <h2>Subject Performance</h2>
    <table>
      <tr><th>Subject</th><th>Average Score</th><th>Students</th><th>Improvement</th></tr>
      ${(data.subjectPerformance || []).map(subject => 
        `<tr>
          <td>${subject.subject}</td>
          <td>${subject.avgScore}%</td>
          <td>${subject.students}</td>
          <td>${subject.improvement}</td>
        </tr>`
      ).join('')}
    </table>
  `;
};