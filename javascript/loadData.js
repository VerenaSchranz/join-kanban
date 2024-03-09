/**
 * Loads data from the storage.
 * Retrieves users, contacts, and tasks from the storage.
 * @returns {Promise<void>} - A promise that resolves once the data is loaded.
 */
async function loadData() {
  try {
    users = JSON.parse(await getItem('users'));
    contacts = JSON.parse(await getItem('contacts'));
    tasks = JSON.parse(await getItem('tasks'));
  } catch (e) {
    console.info('could not load users');
  }
}


/**
 * Retrieves an item from the storage.
 * @param {string} key - The key of the item to retrieve.
 * @returns {Promise<any>} - A promise that resolves with the retrieved item.
 */
async function getItem(key) {
  const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  return await fetch(url)
    .then((res) => res.json())
    .then((res) => res.data.value);
}


/**
 * Sets an item in the storage.
 * @param {string} key - The key of the item to set.
 * @param {any} value - The value of the item to set.
 * @returns {Promise<any>} - A promise that resolves with the result of the operation.
 */
async function setItem(key, value) {
  const payload = { key, value, token: STORAGE_TOKEN };
  return await fetch(STORAGE_URL, {
    method: 'POST',
    body: JSON.stringify(payload),
  }).then((res) => res.json());
}


/**
 * Loads user data from local storage.
 * Retrieves the user object from local storage if available.
 * @returns {void}
 */
function loadUser() {
  let userAsText = localStorage.getItem('user');
  if (userAsText) {
    user = JSON.parse(userAsText);
  }
}
