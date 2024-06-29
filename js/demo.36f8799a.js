const dotsElement = document.getElementById("typing-dots");
const dots = "...";
let dotCount = 0;

function animateTypingDots() {
  dotsElement.textContent =
    " Please wait " + dots.substring(0, dotCount);
  dotCount = (dotCount + 1) % (dots.length + 1);
  setTimeout(animateTypingDots, 300);
}

animateTypingDots();

//PreLoader For web optimisation starts here.... 

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

//PreLoader Ends Here..

var stylesheet = $("link#theme-stylesheet");
$("<link id='new-stylesheet' rel='stylesheet'>").insertAfter(stylesheet);
var alternateColour = $("link#new-stylesheet");

if ($.cookie("theme_csspath")) {
  alternateColour.attr("href", $.cookie("theme_csspath"));
}

$("#colour").change(function () {
  if ($(this).val() !== "") {
    var theme_csspath = $(this).val();

    alternateColour.attr("href", theme_csspath);

    $.cookie("theme_csspath", theme_csspath, {
      expires: 365,
      path: document.URL.substr(0, document.URL.lastIndexOf("/")),
    });
  }

  return false;
});

const toggleButton = document.getElementById("toggleButton");
const defaultContent = toggleButton.querySelector(".default-content");
const alternateContent = toggleButton.querySelector(".alternate-content");

let isToggled = false;

toggleButton.addEventListener("click", function () {
  if (isToggled) {
    // Toggle back to the default state with spinning animation
    alternateContent.classList.add("spin");
    setTimeout(() => {
      alternateContent.classList.remove("spin");
      defaultContent.style.display = "inline-block";
      alternateContent.style.display = "none";
    }, 200);
  } else {
    // Toggle to the alternate state with spinning animation
    defaultContent.classList.add("spin");
    setTimeout(() => {
      defaultContent.classList.remove("spin");
      defaultContent.style.display = "none";
      alternateContent.style.display = "inline-block";
    }, 200);
  }

  // Toggle the state
  isToggled = !isToggled;
});


//Data AOS initialization...
AOS.init({
  duration: 600,
});








