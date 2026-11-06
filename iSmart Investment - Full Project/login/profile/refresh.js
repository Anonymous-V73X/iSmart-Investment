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

//$ Your web app's Firebase configuration                                      
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

const database = getDatabase(app);









document.addEventListener("DOMContentLoaded", async function () {
  const savedAvatar = localStorage.getItem("selectedAvatar");
  const userUid = localStorage.getItem("userUid");

  if (userUid && savedAvatar) {
    // Update local storage with the selected avatar URL
    localStorage.setItem("urlImage", savedAvatar); // safe: compressed base64 or URL

    const userRef = ref(database, "users/" + userUid);

    try {
      // Update the avatar URL in the database
      await update(userRef, {
        urlImage: savedAvatar,
      });
      
      console.log("Avatar URL updated in both local storage and the database");
      
    } catch (error) {
      console.error("Error updating avatar URL:", error);
    }
  }
});


// Function to retrieve user data from the database and call the update function
function retrieveAndListenUserData(userUid, app) {
  const userRef = ref(getDatabase(app), "users/" + userUid);

  onValue(userRef, (snapshot) => {
    const userData = snapshot.val();
    if (userData) {
      // Call the update function with the retrieved user data
      // User data element update
      populateUserDetailsInHTML(userUid, app);
    }
  });
}

// Get the user UID from session storage and call the retrieveAndStoreUserData function
const storedUserUid2 = localStorage.getItem("userUid");

if (storedUserUid2) {
  retrieveAndListenUserData(storedUserUid2, app);
}

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

// ... (previously defined code)

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
      // Only cache in localStorage if it's a URL (not raw base64 — too large)
      localStorage.setItem("urlImage", liveImageUrl);
      localStorage.setItem("selectedAvatar", liveImageUrl);
      updateProfileImageSrc(liveImageUrl);
    } else {
      const fallback = localStorage.getItem("urlImage") || "../../img/avatar-1.png";
      updateProfileImageSrc(fallback);
    }
  });
}









// ... (rest of your code)
// ... (previously defined code)

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

// Function to compress an image via Canvas and return a small base64 string
function compressImage(file, maxWidth, maxHeight, quality, callback) {
  const img = new Image();
  const url = URL.createObjectURL(file);
  img.onload = function() {
    URL.revokeObjectURL(url);
    let w = img.width, h = img.height;
    if (w > maxWidth) { h = Math.round(h * maxWidth / w); w = maxWidth; }
    if (h > maxHeight) { w = Math.round(w * maxHeight / h); h = maxHeight; }
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    canvas.getContext("2d").drawImage(img, 0, 0, w, h);
    callback(canvas.toDataURL("image/jpeg", quality));
  };
  img.onerror = function() { URL.revokeObjectURL(url); callback(null); };
  img.src = url;
}

// Function to upload an image and store the URL with instant preview
window.uploadImageAndStoreUrl = function() {
  const fileInput = document.querySelector("#photo");
  const file = fileInput?.files?.[0];
  if (!file) return;

  // File size validation (max 10MB raw — we compress it anyway)
  if (file.size > 10 * 1024 * 1024) {
    showAlert("File is too large! Please choose an image under 10MB.");
    return;
  }

  closeImageUploadPopup();
  showAlert("Uploading profile picture...");

  const storedUserUid = localStorage.getItem("userUid");

  // Compress image to ~150x150px JPEG at 60% quality → usually < 20KB
  compressImage(file, 150, 150, 0.6, function(compressedBase64) {
    if (!compressedBase64) {
      showAlert("Failed to process image. Please try again.");
      return;
    }

    // 1. Instant UI update
    document.querySelectorAll("#profileImage, .profile-image").forEach(img => {
      img.src = compressedBase64;
    });

    // 2. Persist in localStorage (compressed base64 is tiny — safe)
    localStorage.setItem("urlImage", compressedBase64);
    localStorage.setItem("selectedAvatar", compressedBase64);

    // 3. Persist in Firebase RTDB for cross-device sync
    if (storedUserUid) {
      storeImageUrlInDatabase(storedUserUid, compressedBase64, app);
    }

    showAlert("Profile picture updated successfully!");
  });
};

// ... (previously defined code)

// Function to populate user details in the HTML
function populateUserDetailsInHTML(userUid, app) {
  // Retrieve user details from local storage
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");
  const mpesaNumber = localStorage.getItem("mpesaNumber");
  const profileImageUrl = localStorage.getItem("urlImage");
  const bio = localStorage.getItem("defaultBio");
  const gender = localStorage.getItem("gender");

  // Populate user details into the HTML
  const usernameElement = document.querySelector(".username-value");
  const emailElement = document.querySelector(".email-value");
  const mpesaNumberElement = document.querySelector(".mpesa-number-value");
  const profileImageElement = document.querySelector(".profile-image");
  const bioElement = document.querySelector(".user-bio-value");
  const genderElement = document.querySelector(".user-gender-value");

  if (
    usernameElement &&
    emailElement &&
    mpesaNumberElement &&
    profileImageElement &&
    bioElement &&
    genderElement
  ) {
    // Set values from local storage
    usernameElement.textContent = username || "N/A";
    emailElement.textContent = email || "N/A";
    mpesaNumberElement.textContent = mpesaNumber || "N/A";
    bioElement.textContent = bio || "N/A";
    genderElement.textContent = gender || "N/A";

    // Set profile image src
    const activeProfileImg = profileImageUrl || localStorage.getItem("selectedAvatar") || "../../img/avatar-1.png";
    profileImageElement.src = activeProfileImg;
  } else {
    console.error("One or more elements not found.");
  }
}

// Call the function to populate user details when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const storedUserUid = localStorage.getItem("userUid");
  if (storedUserUid) {
    populateUserDetailsInHTML(storedUserUid, app);
  } else {
    console.error("User UID not found in localStorage.");
  }
});







const editProfileButton = document.getElementById("edit-profile-button");
const editProfilePopup = document.getElementById("edit-profile-popup");
const editProfileForm = document.getElementById("edit-profile-form");

// Function to show and populate the edit profile popup
if (editProfileButton && editProfilePopup) {
  editProfileButton.addEventListener("click", () => {
    // Pre-populate input fields with existing values from localStorage
    const currentUsername = localStorage.getItem("username") || localStorage.getItem("userName") || "";
    const currentMpesa = localStorage.getItem("mpesaNumber") || "";
    const currentBio = localStorage.getItem("defaultBio") || "";
    const currentGender = localStorage.getItem("gender") || "Male";

    const usernameInput = document.getElementById("edit-username");
    const mpesaInput = document.getElementById("edit-mpesa-number");
    const bioInput = document.getElementById("edit-bio");
    const genderInput = document.getElementById("edit-gender");

    if (usernameInput) usernameInput.value = currentUsername;
    if (mpesaInput) mpesaInput.value = currentMpesa;
    if (bioInput) bioInput.value = currentBio;
    if (genderInput) genderInput.value = currentGender;

    editProfilePopup.classList.add("open");
  });
}

// Function to update user profile details in the database
function updateUserProfile(userUid, app, newData) {
  const userRef = ref(getDatabase(app), "users/" + userUid);
  return update(userRef, newData)
    .then(() => {
      console.log("Firebase profile updated successfully");
    })
    .catch((error) => {
      console.warn("Database sync deferred (permission check or offline):", error.message);
    });
}

if (editProfileForm) {
  editProfileForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const newUsername = (document.getElementById("edit-username")?.value || "").trim();
    const newBio = (document.getElementById("edit-bio")?.value || "").trim();
    const newGender = document.getElementById("edit-gender")?.value || "Male";
    const userEnteredMpesaNumber = document.getElementById("edit-mpesa-number")?.value || "";

    function cleanAndFormatMpesaNumber(mpesaNumber) {
      const cleaned = (mpesaNumber + "").replace(/[^0-9]/g, "");
      if (cleaned.startsWith("07")) {
        return "2547" + cleaned.substr(2);
      } else if (cleaned.startsWith("01")) {
        return "2541" + cleaned.substr(2);
      }
      return cleaned;
    }

    const formattedMpesaNumber = cleanAndFormatMpesaNumber(userEnteredMpesaNumber);
    const parsedMpesa = formattedMpesaNumber ? parseInt(formattedMpesaNumber) : (localStorage.getItem("mpesaNumber") || "");

    const newData = {
      username: newUsername,
      bio: newBio,
      gender: newGender,
    };
    if (parsedMpesa) {
      newData.mpesaNumber = parsedMpesa;
    }

    // 1. Immediately update localStorage for instant optimistic persistence
    if (newUsername) {
      localStorage.setItem("username", newUsername);
      localStorage.setItem("userName", newUsername);
    }
    if (formattedMpesaNumber) {
      localStorage.setItem("mpesaNumber", formattedMpesaNumber);
    }
    localStorage.setItem("defaultBio", newBio);
    localStorage.setItem("gender", newGender);

    const activeUid = localStorage.getItem("userUid");

    // 2. Sync to Firebase RTDB in background
    if (activeUid) {
      updateUserProfile(activeUid, app, newData);
    }

    // 3. Immediately update DOM elements in current view
    populateUserDetailsInHTML(activeUid, app);

    // 4. Close modal and show feedback
    if (editProfilePopup) {
      editProfilePopup.classList.remove("open");
    }
    showAlert("Profile details updated successfully!");
  });
}