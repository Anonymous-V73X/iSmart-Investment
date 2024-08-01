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

async function handleDepositClick() {
  const salesDiv = this.closest(".sales");
  const investmentAmount = parseFloat(
    salesDiv.querySelector(".ref[investment]").getAttribute("investment")
  );

  if (!isNaN(investmentAmount)) {
    const userUid = localStorage.getItem("userUid");

    // Calculate the number of weeks between oldDate and the current date
    const currentDate = new Date();
    const oldDate = new Date("July 1, 2024 10:00:00");
    const timeDifference = currentDate - oldDate;
    const weeksDifference = Math.floor(timeDifference / (1000 * 3600 * 24 * 7));

    // Find the most recent week by checking the largest number in weekInvestment keys
    let mostRecentWeek = 1;
    for (const key in userData.weekInvestment) {
      const weekNumber = parseInt(key.replace("week", ""));
      if (!isNaN(weekNumber) && weekNumber > mostRecentWeek) {
        mostRecentWeek = weekNumber;
      }
    }

    // Calculate the expected date to deposit based on the most recent week and oldDate
    const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
    const expectedDepositDate = new Date(
      oldDate.getTime() + mostRecentWeek * millisecondsPerWeek
    );

    console.log(`Expected date to deposit: ${expectedDepositDate}`);

    // Check if the most recent week is ahead of the current date
    if (mostRecentWeek > weeksDifference) {
      const formattedDepositDate = expectedDepositDate.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZoneName: "short",
      });

      

      const popUp = document.getElementById("error-Popup");
      const popUpMessage = `Apologies, but you're not permitted to make a deposit at this moment. Please wait until ${formattedDepositDate} to proceed.`;
      showPopup(popUp, popUpMessage);
      return;
    }

    // Construct the path to the most recent week's data in the database
    const weekInvestmentRef = ref(
      database,
      `users/${userUid}/weekInvestment/week${mostRecentWeek}`
    );

    try {
      const weekInvestmentSnapshot = await get(weekInvestmentRef);
      const userWeekAmount = weekInvestmentSnapshot.val();

      if (userWeekAmount > 100) {
        const planType = getPlanType(userWeekAmount);

        const popUp = document.getElementById("error-Popup");
        const popUpMessage = `Apologies, you are currently unable to purchase another plan as you already possess a ${planType} plan.`;
        showPopup(popUp, popUpMessage);

        return;
      }

      const planForUrl = this.getAttribute("data-plan");
      const planUrls = {
        simba: "https://alekie254.000webhostapp.com/index.php",
        ndovu: "https://alekie254.000webhostapp.com/ndovu.php",
        kifaru: "https://alekie254.000webhostapp.com/kifaru.php",
        chui: "https://alekie254.000webhostapp.com/chui.php",
      };

      const redirectUrl = planUrls[planForUrl];
      if (redirectUrl) {
        window.location.href = redirectUrl;
        

      } else {
        const popUp = document.getElementById("error-Popup");
        const popUpMessage = "Can't find that plan";
        showPopup(popUp, popUpMessage);
      }
    } catch (error) {
      console.error(error);
    }
  }
}

function getPlanType(userWeek3Amount) {
  const planTypes = {
    50000: "Simba",
    30000: "Ndovu",
    10000: "Kifaru",
    1000: "Chui",
  };

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
  }, 5000); // Hide the alert after 3 seconds
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
      setTimeout(() => {
        location.reload();
      }, 1000);

      showAlert("Image uploaded successfully");

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
