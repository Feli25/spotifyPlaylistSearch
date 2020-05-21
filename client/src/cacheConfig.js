export const updateCache = (key, data) => {
  try {
    localStorage.setItem(JSON.stringify(key), JSON.stringify(data));
  } catch (e) {
    console.log(e);
  }
};

export const getFromCache = (key) => {
  const cached = localStorage.getItem(JSON.stringify(key));
  if (cached) {
    return JSON.parse(cached);
  }
  return null;
};