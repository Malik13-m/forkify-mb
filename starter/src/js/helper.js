import { TIMEOUT_SECONDS } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAXfunc = async function (url, uploadDATA = undefined) {
  try {
    const fetchPro = uploadDATA
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadDATA),
        })
      : fetch(url);
    const response = await Promise.race([fetchPro, timeout(TIMEOUT_SECONDS)]);
    const data = await response.json();

    if (!response.ok) throw new Error(`${data.message}: ${response.status}`);

    return data;
  } catch (err) {
    throw err;
  }
};

/*
export const getJSON = async function (url) {
  try {
    const fetchURL = fetch(url);
    const response = await Promise.race([fetchURL, timeout(TIMEOUT_SECONDS)]);
    const data = await response.json();

    if (!response.ok) throw new Error(`${data.message}: ${response.status}`);

    return data;
  } catch (err) {
    throw err;
  }
};


export const sendJSON = async function (url, uploadDATA) {
  try {
    const fetchURL = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadDATA),
    });
    const response = await Promise.race([fetchURL, timeout(TIMEOUT_SECONDS)]);
    const data = await response.json();

    if (!response.ok) throw new Error(`${data.message}: ${response.status}`);

    return data;
  } catch (err) {
    throw err;
  }
};
*/
