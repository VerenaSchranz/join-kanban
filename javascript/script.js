const STORAGE_TOKEN = '628OREVLJSW9YGXS0SPX7R1NWTY96PPCTP7YQPAD';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

let user = [];
let users = [];
let contacts = [];
let contactColors = ['#FF7A00', '#9327FF', '#6E52FF', '#FC71FF', '#FFBB2B', '#1FD7C1', '#462F8A', '#FF4646'];
let legalNoticeOffline = true;
let privacyPolicyOffline = true;


/**
 * Includes HTML content into specified elements.
 * Fetches HTML content from the specified URLs and inserts them into elements with 'w3-include-html' attribute.
 *
 */
async function includeHTML() {
  let includeElements = document.querySelectorAll('[w3-include-html]');
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute('w3-include-html');
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = 'Page not found';
    }
  }
}


/**
 * Adds CSS classes to elements to indicate active state.
 * @function
 * @param {string} id1 - The ID of the first element.
 * @param {string} id2 - The ID of the second element.
 * @param {string} id3 - The ID of the third element.
 * @param {string} id4 - The ID of the fourth element.
 */
function setColorToActive(id1, id2, id3, id4) {
  let textSidebar = document.getElementById(id1);
  textSidebar.classList.add('active');
  let imageSidebar = document.getElementById(id2);
  imageSidebar.classList.add('filter-white');
  let textBottombar = document.getElementById(id3);
  textBottombar.classList.add('active');
  let imageBottombar = document.getElementById(id4);
  imageBottombar.classList.add('filter-white');
}


/**
 * Toggles the visibility of the top bar dropdown menu.
 * @function
 */
function showTopbarDropdown() {
  document.getElementById('topbar-dropdown').classList.toggle('d-flex');
  document.getElementById('topbar-dropdown').classList.toggle('show-overlay-menu');
}


/**
 * Sets user initials in the top bar.
 * @function
 */
function setUserInitials() {
  let x = user;

  let acronym = getFirstLetters(users[x]['username']);
  let content = document.getElementById('topbar-user');
  content.innerHTML = '';
  content.innerHTML = /*html*/ `
    <p>${acronym}</p>
  `;
}


/**
 * Adds the user to contacts if not already present.
 * @function
 */
async function setUserToContacts() {
  let name = users[user].username;
  let mail = users[user].email;
  let userExistsIndex = contacts.findIndex((contact) => contact.name === name);
  let nr = contacts.length;

  if (userExistsIndex === -1) {
    contacts.push({ name: firstLettersUppercase(name), mail: mail, phone: '', color: '', nr: nr });
    userExistsIndex = contacts.length - 1;
  }
}


/**
 * Capitalizes the first letter of each word in a string.
 * @param {string} str - The input string.
 * @returns {string} The string with first letters capitalized.
 * @function
 */
function firstLettersUppercase(str) {
  let splitStr = '';
  splitStr = str.toLowerCase().split(' ');
  for (let i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(' ');
}


/**
 * Retrieves the first letters of each word in a string.
 * @param {string} str - The input string.
 * @returns {string} The first letters of each word.
 * @function
 */
function getFirstLetters(str) {
  return str.split(/\s/).reduce((response, word) => (response += word.slice(0, 1)), '');
}


/**
 * Sets menu color to active state.
 * @param {string} id - The ID of the element.
 * @function
 */
function setMenuColorToActive(id) {
  let container = document.getElementById(id);
  container.classList.add('active');
  container.classList.add('inactiveNote');
  container.classList.remove('noteLink');
  container.style.hoverColor = '#cdcdcd';
}


/**
 * Checks if the current user's name exists in the list of users.
 * @returns {string} The user's name if found, otherwise undefined.
 * @function
 */
function checkForUserName() {
  for (let i = 0; i < users.length; i++) {
    let userName = users[i]['username'];
    if (userName === users[user]['username']) {
      return userName;
    }
  }
}


/**
 * Toggles CSS classes on an element.
 * @param {string} id - The ID of the element.
 * @param {string} toggle - The class to toggle.
 * @function
 */
function classlistToggle(id, toggle) {
  document.getElementById(id).classList.toggle(toggle);
}


/**
 * Adds a CSS class to an element.
 * @param {string} id - The ID of the element.
 * @param {string} add - The class to add.
 * @function
 */
function classlistAdd(id, add) {
  document.getElementById(id).classList.add(add);
}


/**
 * Removes a CSS class from an element.
 * @param {string} id - The ID of the element.
 * @param {string} remove - The class to remove.
 * @function
 */
function classlistRemove(id, remove) {
  document.getElementById(id).classList.remove(remove);
}


/**
 * Removes one CSS class and adds another to an element.
 * @param {string} id - The ID of the element.
 * @param {string} remove - The class to remove.
 * @param {string} add - The class to add.
 * @function
 */
function classlistRemoveAndAdd(id, remove, add) {
  document.getElementById(id).classList.remove(remove);
  document.getElementById(id).classList.add(add);
}


/**
 * Sets a number property on each contact based on its index.
 * @function
 */
async function setNumberOnContacts() {
  for (let i = 0; i < contacts.length; i++) {
    let contact = contacts[i];
    contact['nr'] = i;
    await setItem('contacts', JSON.stringify(contacts));
  }
}


/**
 * Set colors to each contact.
 * Assigns colors from predefined contactColors array to each contact in contacts list.
 * @returns {void}
 */
function setColorToContacts() {
  for (let i = 0; i < contacts.length; i++) {
    let colorIndex = i % contactColors.length;
    contacts[i].color = contactColors[colorIndex];
  }
}


/**
 * Sort the contacts array alphabetically by name.
 * Sorts the contacts array alphabetically by name property.
 * @returns {Array} The sorted contacts array.
 */
function sortContactsByAlphabet() {
  return contacts.sort((a, b) => a.name.localeCompare(b.name));
}


/**
 * Save the contacts array to the storage.
 * Converts the contacts array to JSON and saves it to the storage.
 * @returns {Promise<void>} A promise that resolves when the contacts are saved.
 */
async function saveContacts() {
  await setItem('contacts', JSON.stringify(contacts));
}
