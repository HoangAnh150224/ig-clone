export const formatPostDate = (dateString) => {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  const now = new Date();
  
  // If current year, only show day and month
  // Format: "10 March" or "March 10" depending on locale
  const options = { day: 'numeric', month: 'long' };
  
  // If different from current year, can add year (optionally)
  if (date.getFullYear() !== now.getFullYear()) {
    options.year = 'numeric';
  }
  
  return date.toLocaleDateString('en-US', options);
};
