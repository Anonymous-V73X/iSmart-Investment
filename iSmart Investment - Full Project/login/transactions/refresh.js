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
  apiKey: "AIzaSyB6QD_Ufu8IiU8qrrzAUm3pjSXHQrNVqNs",
  authDomain: "i-smart-600b9.firebaseapp.com",
  databaseURL: "https://i-smart-600b9-default-rtdb.firebaseio.com",
  projectId: "i-smart-600b9",
  storageBucket: "i-smart-600b9.firebasestorage.app",
  messagingSenderId: "436483974438",
  appId: "1:436483974438:web:4d6f4eecd8437e86874de7",
  measurementId: "G-EP35BSMWXQ"
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
// Unified Profile Image Management with Instant Persistence & Realtime Listener
function updateProfileImageSrc(imageUrl) {
  const targetImages = document.querySelectorAll("#profileImage, .profile-image");
  const validUrl = (imageUrl && imageUrl.trim() !== "") ? imageUrl : "../../img/avatar-1.png";
  targetImages.forEach(img => {
    img.src = validUrl;
    img.onerror = () => { img.src = "../../img/avatar-1.png"; };
  });
}

// 1. Instant Cache Render on script execution
const cachedImage = localStorage.getItem("urlImage") || localStorage.getItem("selectedAvatar");
if (cachedImage) {
  updateProfileImageSrc(cachedImage);
}

// 2. Realtime sync with Firebase
if (storedUserUid) {
  const urlImageRef = ref(getDatabase(app), "users/" + storedUserUid + "/urlImage");
  
  // Realtime listener for cross-tab and cross-page synchronization
  onValue(urlImageRef, (snapshot) => {
    const liveImageUrl = snapshot.val();
    if (liveImageUrl) {
      localStorage.setItem("urlImage", liveImageUrl);
      localStorage.setItem("selectedAvatar", liveImageUrl);
      updateProfileImageSrc(liveImageUrl);
    } else {
      const fallback = localStorage.getItem("urlImage") || "../../img/avatar-1.png";
      updateProfileImageSrc(fallback);
    }
  });
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

// Function to upload an image and store the URL with instant preview
window.uploadImageAndStoreUrl = function() {
  const fileInput = document.querySelector("#photo");
  const file = fileInput?.files?.[0];
  if (!file) return;

  // File size validation (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    showAlert("File is too large! Please choose an image under 5MB.");
    return;
  }

  // 1. Instant optimistic UI preview
  const reader = new FileReader();
  reader.onload = function(e) {
    const previewUrl = e.target.result;
    document.querySelectorAll("#profileImage, .profile-image").forEach(img => {
      img.src = previewUrl;
    });
    localStorage.setItem("selectedAvatar", previewUrl);
  };
  reader.readAsDataURL(file);

  closeImageUploadPopup();
  showAlert("Uploading profile picture...");

  const storedUserUid = localStorage.getItem("userUid");

  // 2. Upload to Firebase Storage or persist binary Base64 fallback to RTDB
  try {
    const storageRef = firebase.storage().ref();
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const task = storageRef.child(`avatars/${storedUserUid || "users"}/${fileName}`).put(file, { contentType: file.type });

    task
      .then(snapshot => snapshot.ref.getDownloadURL())
      .then(downloadUrl => {
        if (storedUserUid) {
          storeImageUrlInDatabase(storedUserUid, downloadUrl, app);
          localStorage.setItem("urlImage", downloadUrl);
        }
        showAlert("Profile picture updated successfully!");
      })
      .catch(storageError => {
        console.warn("Storage upload failed, falling back to database binary/base64 storage:", storageError);
        // Fallback: compress and store directly in user's profile node
        const readerBackup = new FileReader();
        readerBackup.onload = function(evt) {
          const base64Data = evt.target.result;
          if (storedUserUid) {
            storeImageUrlInDatabase(storedUserUid, base64Data, app);
            localStorage.setItem("urlImage", base64Data);
          }
          showAlert("Profile picture updated successfully!");
        };
        readerBackup.readAsDataURL(file);
      });
  } catch (err) {
    console.warn("Firebase Storage unavailable, saving directly to database:", err);
    const readerDirect = new FileReader();
    readerDirect.onload = function(evt) {
      const base64Data = evt.target.result;
      if (storedUserUid) {
        storeImageUrlInDatabase(storedUserUid, base64Data, app);
        localStorage.setItem("urlImage", base64Data);
      }
      showAlert("Profile picture updated successfully!");
    };
    readerDirect.readAsDataURL(file);
  }
};


