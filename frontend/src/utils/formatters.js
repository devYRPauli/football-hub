export const formatMatchDate = (utcDate) => {
    if (!utcDate) return 'Date not available';
    const date = new Date(utcDate);
    return date.toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });
};
  
export const formatMatchStatus = (status) => {
    if (!status) return '';
    return status
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, l => l.toUpperCase());
};
