export const getSourceUrlId = (url: string) => {
  const urlParts = url.split('/');
  return urlParts.pop() || urlParts.pop();
};
