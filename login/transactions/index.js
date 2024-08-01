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

//Getting Things Ready...

const dotsElement = document.getElementById("typing-dots");
const dots = "...";
let dotCount = 0;

function animateTypingDots() {
  dotsElement.textContent =
    " Fetching transactions " + dots.substring(0, dotCount);
  dotCount = (dotCount + 1) % (dots.length + 1);
  setTimeout(animateTypingDots, 300);
}

animateTypingDots();

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

// Call the function to update the timestamps on the page
window.addEventListener("load", updateTimestamps);

function updateTimestamps() {
  const messages = [
    { id: "timestamp-1", timestamp: "2023-08-23T16:30:00Z" }, // Set to EAT: 2023-08-22T10:30:00Z + 3 hours
  ];

  messages.forEach((item) => {
    const timestampElement = document.getElementById(item.id);
    if (timestampElement) {
      const formattedTimestamp = formatFixedTimestamp(item.timestamp);
      timestampElement.textContent = formattedTimestamp;
    } else {
      console.warn(`Element with ID '${item.id}' not found.`);
    }
  });
}

//Fetching Transactions...
function formatDateTime(date) {
  const options = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
  };

  const formattedDate = new Date(date).toLocaleString("en-US", options);
  return formattedDate.replace(/,/g, "-");
}

// Reference to the insights container
const insightsContainer = document.querySelector(".insights");

// Function to populate transaction cards
function populateTransactionCards(transactions) {
  insightsContainer.innerHTML = ""; // Clear existing content

  const transactionIds = Object.keys(transactions);

  for (let i = transactionIds.length - 1; i >= 0; i--) {
    const transactionId = transactionIds[i];
    const transaction = transactions[transactionId];
    const card = document.createElement("div");
    card.classList.add("sales");

    const transactionType =
      transaction.type === "Sent"
        ? "Debit"
        : transaction.type === "Pending"
        ? "Processing"
        : "Credit";

    const transactionType2 =
      transaction.type === "Sent" ? "Deposit" : transaction.type === "Pending"
        ? "Pending"
        : "Withdrawal";

    const formattedAmount = parseFloat(transaction.amount).toLocaleString(
      "en-US"
    );

    // Call the formatDateTime function to get the formatted date
    const formattedDate = transaction.date;

    card.innerHTML = `
    <div class="sales" >
      <div class="middle">

        <div class="left">
          <h3>${transactionType2}</h3>
          <div class="refDiv">
            <h3 id="reference"  class="ref">Ref: ${transaction.refNo}</h3>
            <small class="text-muted">${formattedDate}</small>
          </div>
        </div>

        <div class="typeDiv">
          <div class="type-${transactionType.toLowerCase()}">
            <p style="font-weight: 600;">${transactionType}</p>
          </div>
          <div class="transaction">
            <p style="font-weight: 700; font-size:16px">${formattedAmount} <b class="money-kes" style="font-size: 10px;">KES</b></p>
          </div>
        </div>
      </div>
    </div>
    `;

    insightsContainer.appendChild(card);
  }
}

// Function to retrieve transactions from localStorage
function getTransactionsFromLocalStorage() {
  // Retrieve transactions from localStorage
  const transactions = JSON.parse(localStorage.getItem("transactions")) || {};
  populateTransactionCards(transactions);
}

// Call the function to populate transaction data from localStorage when the page loads
window.addEventListener("load", getTransactionsFromLocalStorage);

function showImageUploadPopup() {
  document.querySelector("#popupContainer").style.display = "flex";
}

function closeImageUploadPopup() {
  document.querySelector("#popupContainer").style.display = "none";
}

function closeImageUploadPopup() {
  document.querySelector("#popupContainer").style.display = "none";
}
