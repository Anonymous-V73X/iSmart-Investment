// Import the necessary Firebase SDK modules (app, database, storage)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  set,
  onValue,
  update,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjo5Q7udPIXCVUFJYG4Dp1hcpLvAElg6o",
  authDomain: "money-92adb.firebaseapp.com",
  databaseURL: "https://money-92adb-default-rtdb.firebaseio.com",
  projectId: "money-92adb",
  storageBucket: "money-92adb.appspot.com",
  messagingSenderId: "1042572717494",
  appId: "1:1042572717494:web:f056df88597e53c3a0e517",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database = getDatabase(app);
firebase.initializeApp(firebaseConfig);

// Get the user UID from session storage
const userUid = localStorage.getItem("userUid");

// Get the user UID from session storage
const storedUserUid = localStorage.getItem("userUid");

// Function to increase the withdrawAmount by 35%
function increaseWithdrawAmount() {
  // Create a reference to the user's withdrawAmount
  const withdrawAmountRef = ref(
    database,
    `users/${storedUserUid}/withdrawAmount`
  );

  // Retrieve the current withdrawAmount value
  get(withdrawAmountRef)
    .then((snapshot) => {
      const currentAmount = snapshot.val() || 0; // Default to 0 if the value is null

      // Check if the currentAmount is one of the specified values (1000, 10000, 30000, or 50000)
      if (
        currentAmount === 100 ||
        currentAmount === 1000 ||
        currentAmount === 10000 ||
        currentAmount === 30000 ||
        currentAmount === 50000
      ) {
        // Calculate the new amount (increased by 35%)
        const newAmount = currentAmount + currentAmount * 0.35;

        // Update the withdrawAmount with the new value
        set(withdrawAmountRef, newAmount)
          .then(() => {
            console.log("Withdraw amount increased successfully.");
          })
          .catch((error) => {
            console.error("Error increasing withdraw amount:", error);
          });
      } else {
        console.log("Withdraw amount already increased.");
      }
    })
    .catch((error) => {
      console.error("Error retrieving withdraw amount:", error);
    });
}

// Function to check the condition and execute it in real-time
function checkAndExecuteCondition() {











//###########################################################################

  // Specify the target time as a JavaScript Date object (2023-09-03 15:55:00)
  const targetTime = new Date("2024-08-01T16:55:00");

//###########################################################################








  // Create an interval to periodically check the condition (every second in this example)
  const intervalId = setInterval(() => {
    // Calculate the current time

    const currentTime = new Date();

    // Check if the storedUserUid is not null or undefined and if the currentTime is equal to or greater than the targetTime
    if (storedUserUid && currentTime >= targetTime) {
      increaseWithdrawAmount();
      // Clear the interval once the condition is met
      // clearInterval(intervalId);

      retrieveAndListenUserData(userUid, app);
    } else {
      console.log("Target time not reached.");
    }
  }, 1000); // Check every second (adjust the interval as needed)
}

// Call the function to check and execute the condition in real-time
checkAndExecuteCondition();

// Reference to the withdrawableBalance elements
const withdrawableBalanceElements = document.querySelectorAll(
  ".withdrawableBalance"
);

// Function to display withdrawable balance
function displayWithdrawableBalance() {
  // Create a reference to the user's withdrawableBalance
  const withdrawableBalanceRef = ref(
    database,
    `users/${storedUserUid}/withdrawAmount`
  );

  // Listen for changes to the withdrawableBalance using onValue
  onValue(withdrawableBalanceRef, (snapshot) => {
    const withdrawableBalance = snapshot.val() || 0; // Default to 0 if the value is null

    // Update each withdrawableBalance element with the new value
    withdrawableBalanceElements.forEach((element) => {
      element.textContent = `${withdrawableBalance.toFixed(2)}`;
    });
  });
}

// Call the function to display withdrawable balance
displayWithdrawableBalance();

// Reference to the user's weekInvestment
const userWeekInvestmentRef = ref(
  database,
  `users/${storedUserUid}/weekInvestment`
);

// Reference to the withdrawAmount
const withdrawAmountRef = ref(
  database,
  `users/${storedUserUid}/withdrawAmount`
);

// Function to update withdrawAmount based on the most recent week's investment
function updateWithdrawAmountFromWeekInvestment() {
  // Fetch the current weekInvestment data
  get(userWeekInvestmentRef)
    .then((snapshot) => {
      const weekInvestmentData = snapshot.val();

      console.log("Week Investment Data:", weekInvestmentData);

      // Find the most recent week's investment
      let mostRecentInvestment = 0;
      let mostRecentWeek = 0; // Track the most recent week number

      for (const key in weekInvestmentData) {
        const weekInvestment = weekInvestmentData[key];
        const weekNumber = parseInt(key.replace("week", ""));

        if (!isNaN(weekNumber) && weekNumber > mostRecentWeek) {
          mostRecentInvestment = weekInvestment;
          mostRecentWeek = weekNumber;
        }
      }

      console.log("Most Recent Week:", mostRecentWeek);

      // Update the withdrawAmount based on the most recent week's investment
      set(withdrawAmountRef, mostRecentInvestment)
        .then(() => {
          console.log(`WithdrawAmount updated to: ${mostRecentInvestment}`);
        })
        .catch((error) => {
          console.error("Error updating withdrawAmount:", error);
          alert(
            "An error occurred while updating withdrawAmount. Please try again later."
          );
        });
    })
    .catch((error) => {
      console.error("Error fetching weekInvestment data:", error);
      alert(
        "An error occurred while fetching weekInvestment data. Please try again later."
      );
    });
}

// Set up an onValue listener for the user's weekInvestment
onValue(userWeekInvestmentRef, (snapshot) => {
  // When the weekInvestment data changes, update the withdrawAmount
  updateWithdrawAmountFromWeekInvestment();
});

// Function to retrieve user data from the database and update local storage
function retrieveAndListenUserData(userUid, app) {
  const userRef = ref(getDatabase(app), "users/" + userUid);

  onValue(userRef, (snapshot) => {
    const userData = snapshot.val();
    if (userData) {
      // Update local storage with the latest user data
      localStorage.setItem("email", userData.email);

      localStorage.setItem("withdrawAmount", userData.withdrawAmount);

      localStorage.setItem("username", userData.username);
      localStorage.setItem("mpesaNumber", userData.mpesaNumber);
      localStorage.setItem("gender", userData.gender);
      localStorage.setItem("registrationTime", userData.registrationTime);
      localStorage.setItem("defaultBio", userData.bio);
      localStorage.setItem("darkMode", userData.darkMode);
      localStorage.setItem(
        "weekInvestmentSum",
        calculateWeekInvestmentSum(userData.weekInvestment)
      );
      // Find the most recent week by checking the largest number in weekInvestment keys
      let mostRecentWeek = 1;
      for (const key in userData.weekInvestment) {
        const weekNumber = parseInt(key.replace("week", ""));
        if (!isNaN(weekNumber) && weekNumber > mostRecentWeek) {
          mostRecentWeek = weekNumber;
        }
      }

      localStorage.setItem(
        "recentWeekInvestment",
        userData.weekInvestment[`week${mostRecentWeek}`] || 0
      );

      localStorage.setItem(
        "transactions",
        JSON.stringify(userData.transactions || {})
      );
    }
  });
}

// Calculate the sum of week investments
function calculateWeekInvestmentSum(weekInvestment) {
  return Object.values(weekInvestment)
    .slice(0, -1)
    .reduce((sum, value) => sum + value, 0);
}

// Get the user UID from local storage and call the retrieveAndStoreUserData function
const storedUserUid2 = localStorage.getItem("userUid");
if (storedUserUid2) {
  retrieveAndListenUserData(storedUserUid2, app);
} else {
  window.location.href = "../";
}

// Reference to the darkMode property in Firebase
const darkModeRef = ref(
  getDatabase(app),
  "users/" + storedUserUid2 + "/darkMode"
);

// Function to toggle dark mode in Firebase
function toggleDarkMode() {
  get(darkModeRef)
    .then((snapshot) => {
      const currentDarkMode = snapshot.val();

      // Toggle the dark mode value in Firebase using set function
      set(darkModeRef, !currentDarkMode)
        .then(() => {
          console.log("Dark mode toggled successfully.");
        })
        .catch((error) => {
          console.error("Error toggling dark mode:", error);
        });
    })
    .catch((error) => {
      console.error("Error getting dark mode value:", error);
    });
}

// Event listener for the theme toggler button
document
  .querySelector(".theme-toggler")
  .addEventListener("click", toggleDarkMode);

// Function to store the uploaded image URL in the user's database reference
function storeImageUrlInDatabase(userUid, imageUrl, app) {
  const urlImageRef = ref(getDatabase(app), "users/" + userUid + "/urlImage");

  set(urlImageRef, imageUrl)
    .then(() => {
      console.log("Image URL stored in database successfully.");
    })
    .catch((error) => {
      console.error("Error storing image URL in database:", error);
    });
}

// Function to update the profile image's src attribute
function updateProfileImageSrc(imageUrl) {
  const profileImage = document.querySelector("#profileImage");
  profileImage.src = imageUrl;
}

if (storedUserUid) {
  const userRef = ref(getDatabase(app), "users/" + storedUserUid);

  get(userRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        const imageUrl = userData.urlImage;

        if (imageUrl) {
          // Update the profile image's src attribute with the retrieved URL
          updateProfileImageSrc(imageUrl);
          localStorage.setItem("urlImage", imageUrl);
        } else {
          console.log("No image URL found in the database.");
        }
      } else {
        console.error("User data not found.");
      }
    })
    .catch((error) => {
      console.error("Error retrieving user data:", error);
    });
} else {
  console.error("User UID not found in session storage.");
}

// Function to show an alert
function showAlert(message) {
  const alertElement = document.querySelector(".alert");
  const messageElement = alertElement.querySelector(".msg");

  messageElement.textContent = message;

  alertElement.classList.remove("hide");
  alertElement.classList.add("showAlert", "show");

  setTimeout(() => {
    alertElement.classList.remove("show");
    alertElement.classList.add("hide");
  }, 3000); // Hide the alert after 3 seconds
}

// Function to upload an image and store the URL in the user's data
function uploadImageAndStoreUrl() {
  const ref = firebase.storage().ref();
  const file = document.querySelector("#photo").files[0];
  const name = +new Date() + "-" + file.name;
  const metadata = {
    contentType: file.type,
  };
  const task = ref.child(name).put(file, metadata);

  task
    .then((snapshot) => snapshot.ref.getDownloadURL())
    .then((url) => {
      console.log(url);
      showAlert("Image uploaded successfully");
      // Reload the page after showing the error pop-up
      setTimeout(() => {
        location.reload();
      }, 1000);

      // Get the user UID from session storage
      const storedUserUid = localStorage.getItem("userUid");

      if (storedUserUid) {
        // Store the URL in the user's database reference
        storeImageUrlInDatabase(storedUserUid, url, app);

        // Close the upload popup
        closeImageUploadPopup();
      } else {
        console.error("User UID not found in session storage.");
      }
    })
    .catch((error) => {
      console.error(error);
      showAlert("Error uploading image");
    });
}

// Event listener for the file input element's onchange event
const fileInput = document.querySelector("#photo");
fileInput.addEventListener("change", uploadImageAndStoreUrl);
