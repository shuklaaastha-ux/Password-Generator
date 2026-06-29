const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");

let password = "";
let passwordLength = 10;

const symbols = '!@#$%^&*()_+{}:"<>?|[];\',./`~';

// initialize slider and length display
inputSlider.value = passwordLength;
lengthDisplay.innerText = passwordLength;

// ------------------- Functions -------------------

// Set indicator color
function setIndicator(color) {
  indicator.style.backgroundColor = color;
}

// Random integer generator
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Random character generators
function generateRandomNumber() {
  return String.fromCharCode(getRndInteger(48, 58)); // 0-9
}

function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123)); // a-z
}

function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91)); // A-Z
}

function generateSymbol() {
  return symbols[getRndInteger(0, symbols.length)];
}

// Shuffle password
function shufflePassword(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join('');
}

// Strength calculator
function calcStrength() {
  let hasUpper = uppercaseCheck.checked;
  let hasLower = lowercaseCheck.checked;
  let hasNum = numbersCheck.checked;
  let hasSym = symbolsCheck.checked;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0"); // strong - green
  } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
    setIndicator("#ff0"); // medium - yellow
  } else {
    setIndicator("#f00"); // weak - red
  }
}

// Copy to clipboard
async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "Copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }
  copyMsg.classList.add("active");
  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

// ------------------- Event Listeners -------------------

// Update length on slider move
inputSlider.addEventListener("input", function () {
  passwordLength = inputSlider.value;
  lengthDisplay.innerText = passwordLength;
});

// Copy button
copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) copyContent();
});

// Generate password
generateBtn.addEventListener("click", () => {
  if (!(uppercaseCheck.checked || lowercaseCheck.checked || numbersCheck.checked || symbolsCheck.checked)) {
    alert("Please select at least one option!");
    return;
  }

  password = "";

  let funcArr = [];
  if (uppercaseCheck.checked) funcArr.push(generateUpperCase);
  if (lowercaseCheck.checked) funcArr.push(generateLowerCase);
  if (numbersCheck.checked) funcArr.push(generateRandomNumber);
  if (symbolsCheck.checked) funcArr.push(generateSymbol);

  // Compulsory addition
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }

  // Remaining addition
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRndInteger(0, funcArr.length);
    password += funcArr[randIndex]();
  }

  // Shuffle
  password = shufflePassword(Array.from(password));

  // Show on UI
  passwordDisplay.value = password;

  // Strength check
  calcStrength();
});
