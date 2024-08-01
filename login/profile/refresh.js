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









document.addEventListener("DOMContentLoaded", async function () {
  const savedAvatar = localStorage.getItem("selectedAvatar");
  const userUid = localStorage.getItem("userUid");

  if (userUid && savedAvatar) {
    // Update local storage with the selected avatar URL
    localStorage.setItem("urlImage", savedAvatar);

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
      updateUserDataElements(userData);
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

// ... (previously defined code)

// Event listener for the file input element's onchange event
const fileInput = document.querySelector("#photo");
fileInput.addEventListener("change", uploadImageAndStoreUrl);

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
    if (profileImageUrl) {
      profileImageElement.src = profileImageUrl;
    } else {
      // Set a default image if no URL is available
      profileImageElement.src = "../../img/avatar-1.png";
    }
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

// Function to show the edit profile popup
editProfileButton.addEventListener("click", () => {
  editProfilePopup.classList.add("open");
});

// Function to update user profile details in the database
function updateUserProfile(userUid, app, newData) {
  const userRef = ref(getDatabase(app), "users/" + userUid);
  update(userRef, newData)
    .then(() => {
      alert("User profile details updated successfully.");
      editProfilePopup.classList.remove("open"); // Close the popup after successful update
      window.open("../dashboard/")
    })
    .catch((error) => {
      console.error("Error updating user profile details:", error);
    });
}

editProfileForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const newUsername = document.getElementById("edit-username").value;
  
  const newBio = document.getElementById("edit-bio").value;
  const newGender = document.getElementById("edit-gender").value;

  // Get the user's input from the HTML element with id "edit-mpesa-number"
  const userEnteredMpesaNumber =
    document.getElementById("edit-mpesa-number").value;

  // Function to clean and format the mpesaNumber
  function cleanAndFormatMpesaNumber(mpesaNumber) {
    const cleanedMpesaNumber = mpesaNumber.replace(/[^0-9]/g, ""); // Remove non-numeric characters

    if (cleanedMpesaNumber.startsWith("07")) {
      return "2547" + cleanedMpesaNumber.substr(2);
    } else if (cleanedMpesaNumber.startsWith("01")) {
      return "2541" + cleanedMpesaNumber.substr(2);
    }

    return cleanedMpesaNumber;
  }

  // Clean and format the user-entered mpesaNumber
  const formattedMpesaNumber = cleanAndFormatMpesaNumber(
    userEnteredMpesaNumber
  );

  // Now you can use `formattedMpesaNumber` in your `newData` object
  const newData = {
    username: newUsername,
    
    mpesaNumber: parseInt(formattedMpesaNumber), // Convert to a number using parseInt
    bio: newBio,
    gender: newGender,
  };

  if (storedUserUid) {
    updateUserProfile(storedUserUid, app, newData);

    // Update localStorage items with the new data
    localStorage.setItem("username", newUsername);
   
    localStorage.setItem("mpesaNumber", newMpesaNumber);
    localStorage.setItem("defaultBio", newBio);
    localStorage.setItem("gender", newGender);

    // Update the profile immediately
    populateUserDetailsInHTML(storedUserUid, app);
  }
});