// Utility function to enable/disable the submit button based on validation
function setSubmitButtonState(isValid) {
  document.getElementById("submit").disabled = !isValid;
}


//Validating The Email Address...
function validateEmail() {
  const emailInput = document.getElementById("email");
  const emailValidationMessage = document.getElementById("email-validation");

  const email = emailInput.value.trim();
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  if (!emailPattern.test(email)) {
    emailValidationMessage.innerHTML =
      "<span style='color: red;'>&#10008;</span> Invalid email address.";
    emailValidationMessage.style.color = "red";
  } else {
    emailValidationMessage.innerHTML =
      "<span style='color: green;'>&#10004;</span> Email is valid.";
    emailValidationMessage.style.color = "green";
  }
  emailValidationMessage.style.display = "inline-block";
  setSubmitButtonState(emailPattern.test(email));
}

//Validating The Username...

function validateUsername() {
  const usernameInput = document.getElementById("username");
  const usernameValidationMessage = document.getElementById(
    "username-validation"
  );

  const username = usernameInput.value.trim();
  const minUsernameLength = 2;
  const maxUsernameLength = 15;

  if (
    username.length < minUsernameLength ||
    username.length > maxUsernameLength
  ) {
    usernameValidationMessage.innerHTML =
      "<span style='color: red;'>&#10008;</span> Username must be between <br> 2 and 15 characters in length.";
    usernameValidationMessage.style.color = "red";
  } else if (/\s/.test(username)) {
    usernameValidationMessage.innerHTML =
      "<span style='color: red;'>&#10008;</span> Username cannot contain spaces.";
    usernameValidationMessage.style.color = "red";
  } else {
    usernameValidationMessage.innerHTML =
      "<span style='color: green;'>&#10004;</span> Username is valid.";
    usernameValidationMessage.style.color = "green";
  }
  usernameValidationMessage.style.display = "inline-block";
  setSubmitButtonState(
    username.length >= minUsernameLength &&
      username.length <= maxUsernameLength &&
      !/\s/.test(username)
  );
}

// Validating Mpesa Number...
function validateMpesaNumber() {
  const mpesaInput = document.getElementById("mpesaNumber");
  const mpesaNumber = mpesaInput.value.trim();
  const mpesaValidationMessage = document.getElementById("mpesa-validation");
  const isValid = /^((\+254)|(254)|(0))[1-9]\d{8}$/.test(mpesaNumber);

  mpesaInput.style.borderColor = isValid ? "green" : "red";
  mpesaInput.style.borderWidth = "2px";
  mpesaValidationMessage.innerHTML = isValid
    ? "<span style='color: green;'>&#10004;</span> Mpesa number is valid "
    : "<span style='color: red;'>&#10008;</span> Invalid Mpesa number. ";

  mpesaValidationMessage.style.display = "inline-block";
  mpesaValidationMessage.style.color = isValid ? "green" : "red";
  setSubmitButtonState(isValid);
}

// Validating The Password and Comparing with re-entered password'''

function validatePassword() {
  const passwordInput = document.getElementById("password");
  const reEnteredPasswordInput = document.getElementById("re-entered-password");
  const passwordMatchMessage = document.getElementById(
    "password-match-message"
  );

  const password = passwordInput.value;
  const reEnteredPassword = reEnteredPasswordInput.value;
  const passwordLength = password.length;
  

  if (passwordLength < 8) {
    passwordMatchMessage.innerHTML =
      "<span style='color: red;'>&#10008;</span> Password must be at least <br>  8 characters long.";
    passwordMatchMessage.style.color = "red";
  } else if (reEnteredPassword === password) {
    passwordMatchMessage.innerHTML = `<span style='color: green;'>&#10004;</span> Passwords match. <br> <span style='color: green;'>&#10004;</span> Character count: ${passwordLength}.`;
    passwordMatchMessage.style.color = "green";
  } else {
    passwordMatchMessage.innerHTML =
      "<span style='color: red;'>&#10008;</span> Passwords do not match!";
    passwordMatchMessage.style.color = "red";
  }
  passwordMatchMessage.style.display = "inline-block";
  setSubmitButtonState(passwordLength >= 8 && reEnteredPassword === password);
}

// Attaching event listeners
document
  .getElementById("mpesaNumber")
  .addEventListener("input", validateMpesaNumber);
document.getElementById("password").addEventListener("input", validatePassword);
document
  .getElementById("re-entered-password")
  .addEventListener("input", validatePassword);
document.getElementById("username").addEventListener("input", validateUsername);
document.getElementById("email").addEventListener("input", validateEmail);

// Initializing form input listeners
const formInputs = document.querySelectorAll("input[required]");

formInputs.forEach((input) => {
  input.addEventListener("input", () => {
    const allInputsFilled = [...formInputs].every(
      (input) => input.value.trim() !== ""
    );
    submitButton.disabled = !allInputsFilled;
  });
});

// Importing the functions you need from the SDKs you need

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";

import {
  getDatabase,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

// the web app's Firebase configuration API AND  ALL SORT OF STUFF
const firebaseConfig = {
  apiKey: "AIzaSyCjo5Q7udPIXCVUFJYG4Dp1hcpLvAElg6o",
  authDomain: "money-92adb.firebaseapp.com",
  databaseURL: "https://money-92adb-default-rtdb.firebaseio.com",
  projectId: "money-92adb",
  storageBucket: "money-92adb.appspot.com",
  messagingSenderId: "1042572717494",
  appId: "1:1042572717494:web:f056df88597e53c3a0e517",
};

// Initializing Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Function to map Firebase error codes to user-friendly error messages
function getFriendlyErrorMessage(errorCode) {
  switch (errorCode) {
    case "auth/user-not-found":
      return "User not found!";
    case "auth/wrong-password":
      return "Incorrect password!";
    case "auth/invalid-email":
      return "Please enter a valid email!";
    case "auth/user-disabled":
      return "Account disabled. Please contact support.";
    case "auth/too-many-requests":
      return "Too many unsuccessful login attempts!";
    case "auth/network-request-failed":
      return "Check your internet connection!";
    case "auth/weak-password":
      return "Password is too weak. Try a stronger password.";
    case "auth/email-already-in-use":
      return "Email address is already in use.";
    default:
      return "Something's wrong. Check your details.";
  }
}

const submitButton = document.getElementById("submit");

submitButton.addEventListener("click", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const mpesaNumber = document.getElementById("mpesaNumber").value;
  const gender = document.getElementById("gender").value;

  // Function to clean and format the mpesaNumber
  function formattedMpesaNumber(mpesaNumber) {
    const cleanedMpesaNumber = mpesaNumber.replace(/[^0-9]/g, ""); // Remove non-numeric characters

    if (cleanedMpesaNumber.startsWith("07")) {
      return "2547" + cleanedMpesaNumber.substr(2);
    } else if (cleanedMpesaNumber.startsWith("01")) {
      return "2541" + cleanedMpesaNumber.substr(2);
    }

    return cleanedMpesaNumber;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // Gettin' the current date and time
    const registrationTime = new Date().toISOString();

    // Default bio
    const defaultBio = "I am an iSmart investor!";

    // Saving user details to the database...
    const userRef = ref(database, "users/" + user.uid);

    // Calculatin the number of weeks past
    const currentDate = new Date();
    const oldDate = new Date("May 1, 2024 10:00:00");
    const timeDifference = currentDate - oldDate;
    const weeksPast = Math.floor(timeDifference / (7 * 24 * 60 * 60 * 1000));

    // Create an empty weekInvestment object
    const weekInvestment = {};

    // Initialize week properties
    console.log("Generated weekInvestment object:");
    for (let i = 1; i <= weeksPast; i++) {
      if (i === weeksPast) {
        // Set the most recent week to 100
        weekInvestment[`week${i}`] = 100;
      } else {
        // Set all other weeks to 0
        weekInvestment[`week${i}`] = 0;
      }
      console.log(`week${i}: ${weekInvestment[`week${i}`]}`);
    }

    await set(userRef, {
      email: email,
      username: username,
      mpesaNumber: parseInt(formattedMpesaNumber(mpesaNumber)),
      gender: gender,
      registrationTime: registrationTime,
      bio: defaultBio,
      weekInvestment: weekInvestment,
      withdrawAmount: 100,
      darkMode: false,
    });

    // Display success message in the custom alert popup...
    $(".msg").text("Registered successfully");
    $(".alert").addClass("show");
    $(".alert").removeClass("hide");
    $(".alert").addClass("showAlert");

    // Hide the alert popup after 1 second...
    setTimeout(function () {
      $(".alert").removeClass("show");
      $(".alert").addClass("hide");
    }, 1000);

    // Redirect to home page...
    setTimeout(function () {
      window.location.href = "../login/";
    }, 1000);
  } catch (error) {
    const errorMessage = getFriendlyErrorMessage(error.code);

    // Display user-friendly error message in the custom alert popup...
    $(".msg").text(errorMessage);
    $(".alert").addClass("show");
    $(".alert").removeClass("hide");
    $(".alert").addClass("showAlert");

    // Hide the alert popup after 3 seconds...
    setTimeout(function () {
      $(".alert").removeClass("show");
      $(".alert").addClass("hide");
    }, 3000);
  }
});

//HREF to LOGIN...
const loginLink = document.getElementById("loginLink");

loginLink.addEventListener("click", () => {
  window.location.href = "../login/";
});



