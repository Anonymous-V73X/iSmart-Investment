// Import the necessary Firebase SDK modules (app, database, storage)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  set,
  onValue,
  update,
  child,
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
firebase.initializeApp(firebaseConfig);





// Get the user UID from session storage
const storedUserUid = localStorage.getItem("userUid");





const userName = localStorage.getItem("userName");

// Function to update user-related elements on the page
function updateUserDataElements() {
  const weekInvestmentSum = parseFloat(
    localStorage.getItem("weekInvestmentSum")
  );
  const cumulativeInvestment = document.getElementById("cummulative");

  if (!isNaN(weekInvestmentSum)) {
    const expectedCumulativeInvestment = weekInvestmentSum * 1.35;
    cumulativeInvestment.textContent =
      expectedCumulativeInvestment.toLocaleString("en-US");
  } else {
    cumulativeInvestment.textContent = "0";
  }

  const recentWeekInvestment = parseFloat(
    localStorage.getItem("recentWeekInvestment")
  );

  const recentWeekInvestmentElement =
    document.getElementById("week-investment");
  if (recentWeekInvestmentElement) {
    recentWeekInvestmentElement.textContent = recentWeekInvestment
      ? recentWeekInvestment.toLocaleString("en-US")
      : "0";
  }

  const expectedRevenue = recentWeekInvestment * 1.35;
  const expectedRevenueElement = document.querySelector(".expenses .left h1");
  if (expectedRevenueElement) {
    expectedRevenueElement.textContent =
      expectedRevenue.toLocaleString("en-US");
  } else {
    const fallbackElement = document.createElement("h1");
    fallbackElement.textContent = "0";
    const parentElement = document.querySelector(".expenses .left");
    parentElement.appendChild(fallbackElement);
  }

  const userNameElement = document.getElementById("user-name");
  if (userNameElement) {
    const gender = localStorage.getItem("gender");
    const userName = localStorage.getItem("userName");

    if (gender) {
      const lowerGender = gender.toLowerCase();
      if (lowerGender === "male" || lowerGender === "man") {
        userNameElement.textContent = `Sir ${userName}`;
      } else if (
        lowerGender === "female" ||
        lowerGender === "lady" ||
        lowerGender === "woman"
      ) {
        userNameElement.textContent = `Miss ${userName}`;
      } else {
        userNameElement.textContent = userName;
      }
    } else {
      userNameElement.textContent = userName;
    }
  }



  const userNameElement2 = document.getElementById("username2");
  if (userNameElement2) {
    userNameElement2.textContent = userName;
  }

  const progressPercentage = (recentWeekInvestment / 50000) * 100;
  document.documentElement.style.setProperty(
    "--weekly-percent",
    `${progressPercentage * 0.01}`
  );

  const weekPercentageElement = document.getElementById("weekPercentage");
  if (weekPercentageElement) {
    weekPercentageElement.textContent = `${Math.round(progressPercentage)}%`;
  }

  const revenuePercentage = (expectedRevenue / 67500) * 100;
  document.documentElement.style.setProperty(
    "--weekly-revenue-percent",
    `${revenuePercentage * 0.01}`
  );

  const weekRevenuePercentageElement = document.getElementById(
    "weekRevenuePercentage"
  );
  if (weekRevenuePercentageElement) {
    weekRevenuePercentageElement.textContent = `${Math.round(
      revenuePercentage
    )}%`;
  }

  const incomePercentage = ((weekInvestmentSum * 1.35) / 1000000) * 100;
  document.documentElement.style.setProperty(
    "--income-percent",
    `${incomePercentage * 0.01}`
  );

  const incomePercentageElement = document.querySelector(
    ".cummulativeInvestment"
  );
  if (incomePercentageElement) {
    incomePercentageElement.textContent = `${Math.round(incomePercentage)}%`;
  }
}






// Retrieve data from Firebase Realtime Database and update local storage
function fetchTransactionDataFromDatabase() {
  const user = auth.currentUser;

  if (user) {
    const userRef = ref(database, "users/" + user.uid);
    onValue(
      userRef,
      (snapshot) => {
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
      },
      (error) => {
        console.error("Error fetching transaction data:", error);
        // Handle the error or provide user feedback here
      }
    );
  }
}




// Function to retrieve user data from the database and update local storage
function retrieveAndListenUserData(userUid, app) {
  const userRef = ref(getDatabase(app), "users/" + userUid);

  onValue(userRef, (snapshot) => {
    const userData = snapshot.val();
    if (userData) {
      // Update local storage with the latest user data
      localStorage.setItem("email", userData.email);
      localStorage.setItem("userName", userData.username);
      localStorage.setItem("mpesaNumber", userData.mpesaNumber);
      localStorage.setItem("gender", userData.gender);
      localStorage.setItem("registrationTime", userData.registrationTime);
      localStorage.setItem("defaultBio", userData.bio);
      localStorage.setItem("darkMode", userData.darkMode);
      localStorage.setItem(
        "weekInvestmentSum",
        calculateWeekInvestmentSum(userData.weekInvestment)
      );


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

      // Call the update function with the retrieved user data
      updateUserDataElements();
      fetchTransactionDataFromDatabase();
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













































//* Reference to the darkMode property in Firebase
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
      localStorage.setItem("urlImage", liveImageUrl);
      localStorage.setItem("selectedAvatar", liveImageUrl);
      updateProfileImageSrc(liveImageUrl);
    } else {
      const fallback = localStorage.getItem("urlImage") || "../../img/avatar-1.png";
      updateProfileImageSrc(fallback);
    }
  });
}



















//! Function to show an alert
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





function checkAndUpdateTransactionType(transactionsRef, withdrawRequestRef) {
  onValue(withdrawRequestRef, (snapshot) => {
    const withdrawRequest = snapshot.val();

    if (withdrawRequest) {
      const refNoToCheck = withdrawRequest.refNo;

      get(transactionsRef)
        .then((snapshot) => {
          const transactions = snapshot.val();

          if (transactions) {
            for (const transactionKey in transactions) {
              if (transactions.hasOwnProperty(transactionKey)) {
                const transaction = transactions[transactionKey];

                if (transaction.refNo === refNoToCheck) {
                  const updateData = {
                    type: withdrawRequest.status ? "Pending" : "Received",
                  };

                  update(child(transactionsRef, transactionKey), updateData)
                    .then(() => {
                      console.log(
                        `Transaction type updated to "${updateData.type}"`
                      );
                    })
                    .catch((error) => {
                      console.error("Error updating transaction type:", error);
                    });

                  break;
                }
              }
            }
          }
        })
        .catch((error) => {
          console.error("Error querying transactions:", error);
        });
    }
  });
}

const withdrawRequestRef = ref(
  database,
  `users/${storedUserUid}/withdrawRequest`
);
const transactionsRef = ref(database, `users/${storedUserUid}/transactions`);
checkAndUpdateTransactionType(transactionsRef, withdrawRequestRef);