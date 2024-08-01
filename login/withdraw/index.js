//Getting Things Ready...

const dotsElement = document.getElementById("typing-dots");
const dots = "...";
let dotCount = 0;

function animateTypingDots() {
  dotsElement.textContent =
    " Setting up withdrawals " + dots.substring(0, dotCount);
  dotCount = (dotCount + 1) % (dots.length + 1);
  setTimeout(animateTypingDots, 300);
}

animateTypingDots();

//PreLoader Starts Here...

const fade = () => {
  const wrapper = document.querySelector(".wrapper-loader");
  wrapper.classList.add("fade");
};

// Add an event listener to ensure the preloader stays visible until the content is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Remove the "fade" class from the preloader wrapper initially
  const wrapper = document.querySelector(".wrapper-loader");

  wrapper.classList.remove("fade");

  // Add the "fade" class to the preloader wrapper once the content is loaded
  window.addEventListener("load", fade);
});

//PreLoader Ends Here...\



// Get the logout link element by its ID
const logoutLink = document.getElementById("logout");

// Add a click event listener to the logout link
logoutLink.addEventListener("click", function (event) {
  // Prevent the default behavior of the link (e.g., navigating to another page)
  event.preventDefault();

  // Set the local storage value to indicate logout (e.g., 'true')
  localStorage.setItem("logout", "true");
  window.location.href = "../";
});

// Check if the 'logout' value in local storage is 'true'
const isLoggedOut = localStorage.getItem("logout") === "true";

if (isLoggedOut) {
  // Redirect the user to the desired location (e.g., the home page)
  window.location.href = "../"; // Replace with the URL you want to redirect to
}

//Get Username and Other DETAILS...

// Add an event listener for the "DOMContentLoaded" event
window.addEventListener("DOMContentLoaded", () => {
  // Retrieve the required session data
  const userName = localStorage.getItem("userName");
  const darkMode = localStorage.getItem("darkMode");
  // Add more session data variables as needed

  if (!userName || !darkMode) {
    // Redirect the user to the login page
    window.location.href = "../";
  }

  // Retrieve the last login timestamp from localStorage
  const lastLoginTimestamp = localStorage.getItem("loginTimestamp");

  // Calculate the time difference between now and the last login timestamp
  const currentTime = Date.now();
  const timeSinceLastLogin = currentTime - (lastLoginTimestamp || 0);
  const timeThreshold = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

  if (lastLoginTimestamp && timeSinceLastLogin >= timeThreshold) {
    // Redirect the user to the desired location
    window.location.href = "../";
  }

  // Update the login timestamp
  localStorage.setItem("loginTimestamp", currentTime.toString());
});

// Main contents JS starts here...
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const themeToggler = document.querySelector(".theme-toggler");
const themeTogglerIcons = themeToggler.querySelectorAll("span");

// Show sidebar...
menuBtn.addEventListener("click", () => {
  document.body.querySelector("aside").style.display = "block";
});

// Close sidebar
closeBtn.addEventListener("click", () => {
  document.body.querySelector("aside").style.display = "none";
});

// Change theme...
themeToggler.addEventListener("click", () => {
  // Toggle dark mode class on body
  document.body.classList.toggle("dark-theme-variables");

  // Update and store dark mode status in session storage
  const isDarkMode = document.body.classList.contains("dark-theme-variables");
  localStorage.setItem("darkMode", isDarkMode);

  // Update theme toggler icons
  themeTogglerIcons.forEach((icon, index) => {
    icon.classList.toggle("active", index === (isDarkMode ? 1 : 0));
  });
});

// Function to set dark mode based on user's stored preference
function setDarkModePreference() {
  const isDarkMode = localStorage.getItem("darkMode") === "true";

  // Apply dark mode class to body if dark mode is enabled
  if (isDarkMode) {
    document.body.classList.add("dark-theme-variables");
  }

  // Update theme toggler icons
  themeTogglerIcons.forEach((icon, index) => {
    icon.classList.toggle("active", index === (isDarkMode ? 0 : 1));
  });
}

// Call the function to set the dark mode preference when the page loads
window.addEventListener("DOMContentLoaded", () => {
  setDarkModePreference();

  // Add the click listener to toggle the theme icons
  themeToggler.addEventListener("click", () => {
    themeTogglerIcons.forEach((icon) => {
      icon.classList.toggle("active");
    });
  });
});

// Define a function to calculate the percentage based on the withdrawableBalance
function calculatePercentage(withdrawableBalance) {
  let denominator;

  if (withdrawableBalance >= 1000 && withdrawableBalance <= 1350) {
    denominator = 1350;
  } else if (withdrawableBalance >= 10000 && withdrawableBalance <= 13500) {
    denominator = 13500;
  } else if (withdrawableBalance >= 30000 && withdrawableBalance <= 40500) {
    denominator = 40500;
  } else if (withdrawableBalance >= 50000 && withdrawableBalance <= 67500) {
    denominator = 67500;
  } else if (withdrawableBalance <= 0) {
    return 0; 
  } else {
    // Set the default denominator to be 35% of the withdrawableBalance
    denominator = withdrawableBalance * 1.35;
  }

  const progressPercentage = (withdrawableBalance / denominator) * 100;

  return progressPercentage;
}

// Define the withdraw function
function withdraw() {
  const withdrawableBalance = parseFloat(
    localStorage.getItem("withdrawAmount")
  );

  const progressPercentage = calculatePercentage(withdrawableBalance);

  document.documentElement.style.setProperty(
    "--weekly-percent",
    `${progressPercentage * 0.01}`
  );

  const weekPercentageElement = document.getElementById("withdrawPercentage");
  if (weekPercentageElement) {
    weekPercentageElement.textContent = `${Math.round(progressPercentage)}%`;
  }
}

// Call the withdraw function initially
withdraw();

// Set up an interval to call the withdraw function every second
setInterval(withdraw, 1000); // 1000 milliseconds = 1 second

// Continuously update the withdrawAmount every second
setInterval(() => {
  try {
    const withdrawAmount = localStorage.getItem("withdrawAmount");

    // Check if withdrawAmount is not null or undefined
    if (withdrawAmount !== null && withdrawAmount !== undefined) {
      const withdrawAmountElement = document.querySelector(
        ".withdrawableBalance p"
      );

      // Check if the element exists before updating its textContent
      if (withdrawAmountElement) {
        withdrawAmountElement.textContent = withdrawAmount;
      } else {
      }
    }
  } catch (error) {
    console.error("Error while updating withdrawAmount:", error);
  }
}, 1000);

//Uploadin Image Functions

function showImageUploadPopup() {
  document.querySelector("#popupContainer").style.display = "flex";
}

function closeImageUploadPopup() {
  document.querySelector("#popupContainer").style.display = "none";
}

function closeImageUploadPopup() {
  document.querySelector("#popupContainer").style.display = "none";
}
