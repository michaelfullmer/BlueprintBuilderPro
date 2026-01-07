// src/lib/utils.js (or src/utils/index.js)

export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const fetchWithTimeout = async (url, options = {}, ms = 15000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    const resp = await fetch(url, { ...options, signal: controller.signal });
    return resp;
  } finally {
    clearTimeout(id);
  }
};
// src/lib/utils.js

// ... your existing exports (fetchWithTimeout, cn, etc.)

export const createPageUrl = (page, params = {}) => {
  let url = page;
  if (params.id) {
    url = url.replace(':id', params.id);
  }
  return url;
};