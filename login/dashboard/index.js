//Getting Things Ready...

const dotsElement = document.getElementById("typing-dots");
const dots = "...";
let dotCount = 0;

function animateTypingDots() {
  dotsElement.textContent = " Loading dashboard " + dots.substring(0, dotCount);
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

//PreLoader Ends Here...

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
  const timeThreshold = 12 * 60 * 60 * 1000; // 6 hours in milliseconds

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

// Function to update user-related elements on the page
function updateUserDataElements() {
  const weekInvestmentSum = parseFloat(
    localStorage.getItem("weekInvestmentSum")
  );

  const cumulativeInvestment = document.getElementById("cummulative");

  const recentWeekInvestment = parseFloat(
    localStorage.getItem("recentWeekInvestment")
  );

  const expectedRevenue = recentWeekInvestment * 1.35;

  const userName = localStorage.getItem("userName");

  if (!isNaN(weekInvestmentSum)) {
    const expectedCumulativeInvestment = weekInvestmentSum * 1.35;
    cumulativeInvestment.textContent =
      expectedCumulativeInvestment.toLocaleString("en-US");
  } else {
    cumulativeInvestment.textContent = "0";
  }

  const recentWeekInvestmentElement =
    document.getElementById("week-investment");
  if (recentWeekInvestmentElement) {
    recentWeekInvestmentElement.textContent = recentWeekInvestment
      ? recentWeekInvestment.toLocaleString("en-US")
      : "0";
  }

  const expectedRevenueElement = document.querySelector(".expenses .left h1");
  if (expectedRevenueElement) {
    expectedRevenueElement.textContent =
      expectedRevenue.toLocaleString("en-US");
  } else {
    const fallbackElement = document.createElement("h1");
    fallbackElement.textContent = "0";
    document.querySelector(".expenses .left").appendChild(fallbackElement);
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
  const incomePercentageElement = document.querySelector(".Investment");
  if (incomePercentageElement) {
    incomePercentageElement.textContent = `${Math.round(incomePercentage)}%`;
  }

  const userNameElement = document.getElementById("user-name");
  if (userNameElement) {
    const gender = localStorage.getItem("gender");
    const userName = localStorage.getItem("username");

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
}

// Call the function to fetch transaction data from the database when the page loads
window.addEventListener("load", updateUserDataElements);

// Function to populate the recent transactions table
function populateRecentTransactionsTable() {
  const tableBody = document.querySelector(".recent-orders tbody");

  // Retrieve transactions from localStorage
  const transactions = JSON.parse(localStorage.getItem("transactions")) || {};

  // Clear existing table rows
  tableBody.innerHTML = "";

  // Get an array of transaction IDs
  const transactionIds = Object.keys(transactions);

  // Populate table rows with transaction data in reverse order
  let rowNumber = 1;
  for (let i = transactionIds.length - 1; i >= 0; i--) {
    const transactionId = transactionIds[i];
    const transaction = transactions[transactionId];
    const row = document.createElement("tr");

    const fontColor =
      transaction.type === "Sent"
        ? "#ff7878"
        : transaction.type === "Received"
        ? " #84d27e "
        : "orange";


    // Format amount with commas
    const formattedAmount = parseFloat(transaction.amount).toLocaleString(
      "en-US"
    );

    row.innerHTML = `
      <td></td>
      <td>${transaction.refNo}</td>
      <td>${formattedAmount}<span style="color: orange; font-size:8px; font-weight:bold"> KES</span></td>
      <td style="color: ${fontColor}; font-weight:600;">${transaction.type}</td>
      <td>${transaction.date}</td>
    `;
    tableBody.appendChild(row);

    rowNumber++;

    // Show a limited number of recent transactions (e.g., 5)
    if (rowNumber > 5) {
      break;
    }
  }
}

window.addEventListener("load", populateRecentTransactionsTable());

// Function to format a fixed timestamp into human-readable text
function formatFixedTimestamp(fixedTimestamp) {
  const timestampDate = new Date(fixedTimestamp);
  const now = new Date();

  const timeDifference = now - timestampDate;

  const seconds = Math.floor(timeDifference / 1000);
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
  }

  const minutes = Math.floor(timeDifference / (1000 * 60));
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  }

  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }

  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  if (days < 30) {
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  }

  const months = Math.floor(days / 30);
  return `${months} month${months !== 1 ? "s" : ""} ago`;
}

function updateTimestamps() {
  const messages = [
    { id: "timestamp-1", timestamp: "2023-08-24T14:30:00Z" }, // Set to EAT: 2023-08-22T10:30:00Z + 3 hours
    { id: "timestamp-2", timestamp: "2023-08-24T14:00:00Z" }, // Set to EAT: 2023-08-20T11:00:00Z + 3 hours
    { id: "timestamp-3", timestamp: "2023-08-24T12:00:00Z" }, // Set to EAT: 2023-08-15T09:00:00Z + 3 hours
  ];

  messages.forEach((item) => {
    const timestampElement = document.getElementById(item.id);
    const formattedTimestamp = formatFixedTimestamp(item.timestamp);
    //timestampElement.textContent = formattedTimestamp;
  });
}

// Call the function to update the timestamps on the page
window.addEventListener("load", updateTimestamps);

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


