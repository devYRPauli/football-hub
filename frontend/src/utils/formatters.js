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

export const formatMatchTime = (utcDate) => {
    if (!utcDate) return '';
    const date = new Date(utcDate);
    return date.toLocaleTimeString(undefined, { 
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

export const getStatusIcon = (status) => {
    // Icon function kept for compatibility but returns empty string
    return '';
};
