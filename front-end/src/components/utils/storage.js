export function getFromStorage(key) {
  if (!key) {
    return null;
  } // if is not the key then nothing hapens

  try {
    // The getItem() method of the Storage interface, when passed a key name, will return that key's value or null if the key does not exist.
    if (localStorage.getItem(key)) {
      return JSON.parse(localStorage.getItem(key)); // passing the parsed key
    }
    return null;
  } catch (err) {
    return null;
  }
}

export function setInStorage(key, obj) {
  if (!key) {
    console.error('Error: key is missing');
  }
  try {
    localStorage.setItem(key, JSON.stringify(obj));
  } catch (err) {
    console.error(err);
  }
}
