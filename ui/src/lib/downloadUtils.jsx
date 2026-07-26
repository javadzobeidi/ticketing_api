const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5161';

export const getDownloadUrl = (filePath) => {
  return `${baseURL}/attachment/download?path=${encodeURIComponent(filePath)}`;
};

// Utility function to trigger download
export const triggerFileDownload = (filePath) => {
  const url = getDownloadUrl(filePath);
  window.open(url);
};