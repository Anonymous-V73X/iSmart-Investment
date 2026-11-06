// Import the necessary Firebase SDK modules (app, database, storage)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  set,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

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

// Function to retrieve user data from the database and update local storage
function retrieveAndListenUserData(userUid, app) {
  const userRef = ref(getDatabase(app), "users/" + userUid);

  onValue(userRef, (snapshot) => {
    const userData = snapshot.val();
    if (userData) {
      // Store user's data in an object to reduce storage updates
      const userDataToUpdate = {
        email: userData.email,
        username: userData.username,
        mpesaNumber: userData.mpesaNumber,
        gender: userData.gender,
        registrationTime: userData.registrationTime,
        defaultBio: userData.bio,
        darkMode: userData.darkMode,
        weekInvestmentSum: Object.values(userData.weekInvestment)
          .slice(0, -1) // Slice to exclude the most recent week
          .reduce((sum, value) => sum + value, 0),
        transactions: JSON.stringify(userData.transactions || {}),
      };

      // Update local storage with the user data
      for (const key in userDataToUpdate) {
        localStorage.setItem(key, userDataToUpdate[key]);
      }

      // Call the update function with the retrieved user data
    }
  });
}

// Function to retrieve and store user data
async function retrieveAndStoreUserData(userUid, app) {
  const userRef = ref(getDatabase(app), "users/" + userUid);

  try {
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const userData = snapshot.val();
      const { username, darkMode, weekInvestment } = userData;

      // Calculate the sum of week investments
      const weekInvestmentSum = Object.values(weekInvestment)
        .slice(0, -1)
        .reduce((sum, value) => sum + value, 0);

      // Find the most recent week by checking the largest number in weekInvestment keys
      let mostRecentWeek = 1;
      for (const key in userData.weekInvestment) {
        const weekNumber = parseInt(key.replace("week", ""));
        if (!isNaN(weekNumber) && weekNumber > mostRecentWeek) {
          mostRecentWeek = weekNumber;
        }
      }

      // Store user's data in session storage
      const userDataToStore = {
        userUid,
        userName: username,
        darkMode,
        weekInvestmentSum,
        recentWeekInvestment:
          userData.weekInvestment[`week${mostRecentWeek}`] || 0,
      };

      // Update local storage with the user data
      for (const key in userDataToStore) {
        localStorage.setItem(key, userDataToStore[key]);
      }
    } else {
      console.error("User data not found.");
    }
  } catch (error) {
    console.error("Error retrieving user data:", error);
  }
}

// Calculate the sum of week investments
function calculateWeekInvestmentSum(weekInvestment) {
  return Object.values(weekInvestment)
    .slice(0, -1)
    .reduce((sum, value) => sum + value, 0);
}

// Function to toggle dark mode in Firebase
async function toggleDarkMode() {
  const storedUserUid = localStorage.getItem("userUid");
  if (!storedUserUid) {
    console.error("User UID not found.");
    return;
  }

  const darkModeRef = ref(
    getDatabase(app),
    "users/" + storedUserUid + "/darkMode"
  );

  try {
    const snapshot = await get(darkModeRef);
    const currentDarkMode = snapshot.val();

    // Toggle the dark mode value in Firebase using set function
    await set(darkModeRef, !currentDarkMode);
    console.log("Dark mode toggled successfully.");
  } catch (error) {
    console.error("Error toggling dark mode:", error);
  }
}

// Event listener for the theme toggler button
document
  .querySelector(".theme-toggler")
  .addEventListener("click", toggleDarkMode);

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

// Global variable to hold user data
let userData;

// Retrieve the userUid from local storage
const userUid = localStorage.getItem("userUid");

// Reference to the user's data in the database
const userRef = ref(database, `users/${userUid}`);

// Fetch the user's data from the database
try {
  const userSnapshot = await get(userRef);
  userData = userSnapshot.val();
} catch (error) {
  // Handle any errors that occur while fetching data
  console.error("Error fetching user data:", error);
}








// Add click event listener to deposit buttons
const depositButtons = document.querySelectorAll(".depo");

// Attach click event handler to each deposit button
depositButtons.forEach((button) => {
  button.addEventListener("click", handleDepositClick);
});

// ========================================================
// M-PESA DARAJA STK SIMULATOR & INVESTMENT CONTROLLER
// ========================================================
let currentStkPackage = {
  plan: "",
  amount: 0,
  roi: 0
};

window.openMpesaModalForPlan = function(planName, amount) {
  currentStkPackage.plan = planName;
  currentStkPackage.amount = parseFloat(amount) || 0;
  currentStkPackage.roi = Math.round(currentStkPackage.amount * 1.35);

  const modal = document.getElementById("mpesa-stk-modal");
  if (!modal) return;

  // Reset steps
  document.getElementById("stk-step-confirm").style.display = "block";
  document.getElementById("stk-step-pin").style.display = "none";
  document.getElementById("stk-step-processing").style.display = "none";
  document.getElementById("stk-step-success").style.display = "none";

  // Pre-fill labels
  document.getElementById("stk-plan-name").textContent = planName;
  document.getElementById("stk-amount-display").textContent = currentStkPackage.amount.toLocaleString();

  // Pre-fill user's registered phone
  const storedPhone = localStorage.getItem("mpesaNumber") || "";
  let cleanPhone = (storedPhone + "").replace(/[^0-9]/g, "");
  if (cleanPhone.startsWith("254")) {
    cleanPhone = cleanPhone.substring(3);
  } else if (cleanPhone.startsWith("0")) {
    cleanPhone = cleanPhone.substring(1);
  }
  const phoneInput = document.getElementById("stk-phone-input");
  if (phoneInput) phoneInput.value = cleanPhone;

  modal.style.display = "flex";
  modal.classList.add("open");
};

window.closeMpesaModal = function() {
  const modal = document.getElementById("mpesa-stk-modal");
  if (modal) {
    modal.style.display = "none";
    modal.classList.remove("open");
  }
};

window.initiateMockStkPush = function() {
  const phone = document.getElementById("stk-phone-input")?.value.trim();
  if (!phone || phone.length < 9) {
    alert("Please enter a valid M-Pesa phone number");
    return;
  }

  // Switch to simulated phone PIN prompt (Step 2)
  document.getElementById("stk-step-confirm").style.display = "none";
  document.getElementById("stk-step-pin").style.display = "block";

  document.getElementById("stk-phone-amt").textContent = currentStkPackage.amount.toLocaleString();
  const pinInput = document.getElementById("stk-pin-input");
  if (pinInput) {
    pinInput.value = "";
    setTimeout(() => pinInput.focus(), 300);
  }
};

window.cancelStkPrompt = function() {
  closeMpesaModal();
  showAlert("Payment cancelled by user.");
};

window.submitMockPin = function() {
  const pin = document.getElementById("stk-pin-input")?.value;
  if (!pin || pin.length < 4) {
    alert("Please enter your 4-digit M-Pesa PIN");
    return;
  }

  // Step 3: Show processing animation (Daraja Webhook simulation)
  document.getElementById("stk-step-pin").style.display = "none";
  document.getElementById("stk-step-processing").style.display = "block";

  // Simulate network roundtrip latency (2 seconds)
  setTimeout(() => {
    executeSuccessfulInvestment();
  }, 2000);
};

function generateMockReceipt() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let receipt = "Q";
  for (let i = 0; i < 9; i++) {
    receipt += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return receipt;
}

async function executeSuccessfulInvestment() {
  const userUid = localStorage.getItem("userUid");
  const amount = currentStkPackage.amount;
  const plan = currentStkPackage.plan;
  const receiptNo = generateMockReceipt();
  const timestamp = new Date().toISOString();

  // 1. Calculate latest week key
  let currentRecent = parseFloat(localStorage.getItem("recentWeekInvestment")) || 0;
  let currentSum = parseFloat(localStorage.getItem("weekInvestmentSum")) || 0;

  // New investment becomes the active recent week investment
  let newRecent = amount;
  let newSum = currentSum + amount;

  // 2. Optimistic local storage update
  localStorage.setItem("recentWeekInvestment", newRecent);
  localStorage.setItem("weekInvestmentSum", newSum);

  // 3. Record transaction in localStorage
  let localTx = [];
  try {
    localTx = JSON.parse(localStorage.getItem("transactions") || "[]");
  } catch (e) {
    localTx = [];
  }
  localTx.unshift({
    receiptNo: receiptNo,
    type: "Deposit",
    plan: plan,
    amount: amount,
    date: timestamp,
    status: "Completed"
  });
  localStorage.setItem("transactions", JSON.stringify(localTx));

  // 4. Background Firebase RTDB updates
  if (userUid) {
    try {
      // Update weekInvestment structure
      await update(ref(database, `users/${userUid}/weekInvestment`), {
        week1: newRecent
      });

      // Append transaction record
      const newTxRef = ref(database, `users/${userUid}/transactions/${Date.now()}`);
      await set(newTxRef, {
        refNo: receiptNo,
        amount: amount,
        package: plan,
        status: "Approved",
        date: timestamp
      });

      console.log("Investment successfully committed to Firebase database");
    } catch (dbErr) {
      console.warn("Database sync deferred (rules or offline):", dbErr.message);
    }
  }

  // Step 4: Show success screen
  document.getElementById("stk-step-processing").style.display = "none";
  document.getElementById("stk-step-success").style.display = "block";

  document.getElementById("stk-receipt-code").textContent = receiptNo;
  document.getElementById("stk-summary-plan").textContent = plan;
  document.getElementById("stk-summary-amount").textContent = "KES " + amount.toLocaleString();
  document.getElementById("stk-summary-roi").textContent = "KES " + currentStkPackage.roi.toLocaleString();
}

window.finishInvestment = function() {
  closeMpesaModal();
  window.location.href = "../dashboard/";
};

async function handleDepositClick() {
  const salesDiv = this.closest(".sales");
  const investmentAmount = parseFloat(
    salesDiv.querySelector(".ref[investment]")?.getAttribute("investment") || 0
  );
  const planForUrl = this.getAttribute("data-plan") || "Starter";

  const planNames = {
    simba: "Simba (KES 50,000)",
    ndovu: "Ndovu (KES 30,000)",
    kifaru: "Kifaru (KES 10,000)",
    chui: "Chui (KES 1,000)"
  };

  const displayName = planNames[planForUrl] || `${planForUrl.toUpperCase()} Plan`;
  openMpesaModalForPlan(displayName, investmentAmount);
}

;

  return planTypes[userWeek3Amount] || "";
}

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
  }, 5000); // Hide the alert after 3 seconds
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

// Function to open the pop-up
function openPopup(popupElement) {
  popupElement.classList.add("open-popup");
}

// Function to show the pop-up with a message
function showPopup(popupElement, message) {
  const messageElement = popupElement.querySelector("p");
  messageElement.textContent = message;
  openPopup(popupElement);
}
