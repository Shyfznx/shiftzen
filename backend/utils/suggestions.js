const generateSuggestions = (portfolio, projects, interests) => {
  const s = [];
  if (!portfolio?.description || portfolio.description.length < 50)
    s.push({ priority: 'high',   message: 'Add a detailed bio (50+ words) to tell your story.' });
  if (!projects?.length)
    s.push({ priority: 'high',   message: 'Add your first project to showcase your work.' });
  if (projects?.length && !projects.some(p => p.featured))
    s.push({ priority: 'medium', message: 'Mark your best work as featured so it stands out.' });
  if (!interests?.youtubeLinks?.length)
    s.push({ priority: 'low',    message: 'Add YouTube videos to build an interests section.' });
  if (projects?.filter(p => p.type === 'writing').length > 3)
    s.push({ priority: 'medium', message: 'Strong writing — consider starting a Substack.' });
  if (projects?.filter(p => p.type === 'art').length > 2)
    s.push({ priority: 'medium', message: 'Great art portfolio — consider selling prints or commissions.' });
  return s;
};
module.exports = { generateSuggestions };
