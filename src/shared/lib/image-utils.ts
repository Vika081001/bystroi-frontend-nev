export const transformImageUrl = (url: string): string => {
  if (!url) return url;
  
  if (url.startsWith('https://app.tablecrm.com/photos/')) {
    return url.replace(
      'https://app.tablecrm.com/photos/',
      'https://app.tablecrm.com/api/v1/photos/'
    );
  }
  
  return url;
};