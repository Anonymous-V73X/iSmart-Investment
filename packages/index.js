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
  dotsElement.textContent = " Getting Packages " + dots.substring(0, dotCount);
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

// Close sidebar...
closeBtn.addEventListener("click", () => {
  document.body.querySelector("aside").style.display = "none";
});

// Change theme...
themeToggler.addEventListener("click", () => {
  // Toggle dark mode class on body
  document.body.classList.toggle("dark-theme-variables");

  // Update and store dark mode status in local storage
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









function closePopup(popupId) {
  var popup = document.getElementById(popupId);
  popup.classList.remove("open-popup");
  popup.style.visibility = "hidden";

  // Reload the page after showing the error pop-up
  setTimeout(() => {
    location.reload();
  }, 1000);
}



function showImageUploadPopup() {
  document.querySelector("#popupContainer").style.display = "flex";
}

function closeImageUploadPopup() {
  document.querySelector("#popupContainer").style.display = "none";
}

function closeImageUploadPopup() {
  document.querySelector("#popupContainer").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
  const avatars = document.querySelectorAll(".avatars img");
  const profileImage = document.getElementById("profileImage");

  // Load avatar from local storage if available
  const savedAvatar = localStorage.getItem("selectedAvatar");
  if (savedAvatar) {
    profileImage.setAttribute("src", savedAvatar);
  }

  avatars.forEach((avatar) => {
    avatar.addEventListener("click", function () {
      const avatarSrc = avatar.getAttribute("src");
      profileImage.setAttribute("src", avatarSrc);
      localStorage.setItem("selectedAvatar", avatarSrc); // Store in local storage
    });
  });
});

