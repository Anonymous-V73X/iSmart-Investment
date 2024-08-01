// Import the necessary Firebase SDK modules (app, database, storage)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  set,
  onValue,
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
const auth = getAuth(app);
const database = getDatabase(app);
// Initialize Firebase
firebase.initializeApp(firebaseConfig);






// Retrieve data from Firebase Realtime Database
function fetchTransactionDataFromDatabase() {
  const user = auth.currentUser;
  if (user) {
    const userRef = ref(database, "users/" + user.uid);
    onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      if (userData && userData.transactions) {
        // Update local storage with the new transaction data
        localStorage.setItem(
          "transactions",
          JSON.stringify(userData.transactions)
        );

        // Populate the recent transactions table with the updated data
        populateRecentTransactionsTable();
      }
    });
  }
}











// Call the function to fetch transaction data from the database when the page loads
window.addEventListener("load", fetchTransactionDataFromDatabase);

function retrieveAndStoreUserData(userUid, app) {
  const userRef = ref(getDatabase(app), "users/" + userUid);

  return get(userRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        const userName = userData.username;
        const darkMode = userData.darkMode;

        // Calculate the sum of all week investments
        const weekInvestmentSum = Object.values(userData.weekInvestment)
          .slice(0, -1) // Slice to exclude the most recent week
          .reduce((sum, value) => sum + value, 0);

        // Get the recent week's investment
        // Find the most recent week by checking the largest number in weekInvestment keys
        let mostRecentWeek = 1;
        for (const key in userData.weekInvestment) {
          const weekNumber = parseInt(key.replace("week", ""));
          if (!isNaN(weekNumber) && weekNumber > mostRecentWeek) {
            mostRecentWeek = weekNumber;
          }
        }

        // Set the most recent week's value as recentWeekInvestment
        const recentWeekInvestment =
          userData.weekInvestment[`week${mostRecentWeek}`];
        // Change this based on your structure

        // Store user's data in session storage
        localStorage.setItem("userUid", userUid);
        localStorage.setItem("userName", userName);
        localStorage.setItem("darkMode", darkMode);
        localStorage.setItem("weekInvestmentSum", weekInvestmentSum);
        localStorage.setItem("recentWeekInvestment", recentWeekInvestment);

        // Log the retrieved data for debugging within the module's scope
        console.log("Retrieved data:", {
          userName,
          darkMode,
          weekInvestmentSum,
          recentWeekInvestment,
        });
      } else {
        console.error("User data not found.");
      }
    })
    .catch((error) => {
      console.error("Error retrieving user data:", error);
    });
}








// Listen for the 'storage' event to update the session data
window.addEventListener("storage", (event) => {
  if (event.key === "userUid") {
    const storedUserUid = localStorage.getItem("userUid");
    if (storedUserUid) {
      retrieveAndStoreUserData(storedUserUid, app);
    }
  }
});








// Get the user UID from session storage and call the retrieveAndStoreUserData function
const storedUserUid = localStorage.getItem("userUid");
if (storedUserUid) {
  retrieveAndStoreUserData(storedUserUid, app);
}

// Reference to the darkMode property in Firebase
const darkModeRef = ref(
  getDatabase(app),
  "users/" + storedUserUid + "/darkMode"
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




















// Retrieve the uploaded image URL from  storage
const uploadedImageUrl = sessionStorage.getItem("uploadedImageUrl");

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



if (uploadedImageUrl) {
  // Use the uploaded image URL
  console.log("Uploaded Image URL:", uploadedImageUrl);

  // Get the user UID from session storage
  const storedUserUid = localStorage.getItem("userUid");

  if (storedUserUid) {
    // Store the image URL in the user's database reference
    storeImageUrlInDatabase(storedUserUid, uploadedImageUrl, app);
  } else {
    console.error("User UID not found in session storage.");
  }
} else {
  console.log("No uploaded image URL found.");
}

// ... (previously defined code)
// Function to update the profile image's src attribute
function updateProfileImageSrc(imageUrl) {
  const profileImage = document.querySelector("#profileImage");
  profileImage.src = imageUrl;
}

// ... (other previously defined functions and code)

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
        } else {
          console.log("No image URL found in the database.");
        }

        // ... (rest of your code)
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
      setTimeout(() => {
        location.reload();
      }, 1);

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


