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
  const targetTime = new Date("2023-09-11T15:20:00");

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
  function renderBalance() {
    const recentInvestment = parseFloat(localStorage.getItem("recentWeekInvestment")) || 0;
    const depositTime = parseInt(localStorage.getItem("investmentDepositTime") || "0");
    const maturityTime = parseInt(localStorage.getItem("investmentMaturityTime") || "0");
    const now = Date.now();
    const isMatured = (maturityTime > 0 && now >= maturityTime);

    // If 7 days completed: Return full 135% (Investment + 35% Profit)
    // If user cashes out early: Returns ONLY Principal (Investment), forfeiting the 35% profit
    let payoutAmount = 0;
    if (recentInvestment > 0) {
      payoutAmount = isMatured ? (recentInvestment * 1.35) : recentInvestment;
    } else {
      payoutAmount = parseFloat(localStorage.getItem("withdrawAmount")) || 0;
    }

    localStorage.setItem("withdrawAmount", payoutAmount);

    withdrawableBalanceElements.forEach((element) => {
      element.textContent = `${payoutAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    });

    // Update subtitle advice
    const infoSubtitle = document.querySelector(".insights .sales small");
    if (infoSubtitle && recentInvestment > 0) {
      if (isMatured) {
        infoSubtitle.innerHTML = '<span style="color:#00a651; font-weight:700;">✓ Investment Matured: Full 35% profit included!</span>';
      } else {
        const remainingMs = maturityTime > now ? (maturityTime - now) : 0;
        const daysLeft = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
        infoSubtitle.innerHTML = `<span style="color:#f97316; font-weight:700;">⚠ Early Cashout Active: ${daysLeft}d left to 35% profit. Withdrawing now forfeits all profit.</span>`;
      }
    }
  }

  // Render immediately from localStorage
  renderBalance();

  // Also listen to database updates if available
  if (storedUserUid) {
    const withdrawableBalanceRef = ref(database, `users/${storedUserUid}/withdrawAmount`);
    onValue(withdrawableBalanceRef, (snapshot) => {
      const dbVal = snapshot.val();
      if (dbVal !== null && dbVal !== undefined) {
        localStorage.setItem("withdrawAmount", dbVal);
      }
      renderBalance();
    }, (err) => {
      console.warn("RTDB sync deferred:", err.message);
      renderBalance();
    });
  }
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
      // Always cache -- base64 is now compressed (~20KB), safe for localStorage
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

  if (file.size > 10 * 1024 * 1024) {
    showAlert("File is too large! Please choose an image under 10MB.");
    return;
  }

  closeImageUploadPopup();
  showAlert("Uploading profile picture...");

  const storedUserUid = localStorage.getItem("userUid");

  compressImage(file, 150, 150, 0.6, function(compressedBase64) {
    if (!compressedBase64) {
      showAlert("Failed to process image. Please try again.");
      return;
    }
    document.querySelectorAll("#profileImage, .profile-image").forEach(img => {
      img.src = compressedBase64;
    });
    localStorage.setItem("urlImage", compressedBase64);
    localStorage.setItem("selectedAvatar", compressedBase64);
    if (storedUserUid) {
      storeImageUrlInDatabase(storedUserUid, compressedBase64, app);
    }
    showAlert("Profile picture updated successfully!");
  });
};


// Cross-tab / Cross-page instant sync listener
window.addEventListener("storage", function(event) {
  if (event.key === "urlImage" || event.key === "selectedAvatar") {
    const newImage = event.newValue;
    if (newImage && typeof updateProfileImageSrc === "function") {
      updateProfileImageSrc(newImage);
    }
  }
});
