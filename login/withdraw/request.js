// Import the necessary Firebase SDK modules (app, database, storage)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  set,
  onValue,
  update,
  push,
  child
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
const storedUserUid = localStorage.getItem("userUid");
const database = getDatabase(app);









// Define a function to add a new week's investment
function addNewWeekInvestment(storedUserUid, database, withdrawalAmount) {
  // Set a variable to hold the new week's investment amount (you can set it to any value you want)
  const newWeekInvestmentAmount = 0; // For example, set it to 100

  // Reference to the user's weekInvestment
  const userWeekInvestmentRef = ref(database, `users/${storedUserUid}/weekInvestment`);

  // Fetch the current weekInvestment data
  get(userWeekInvestmentRef)
    .then((snapshot) => {
      const weekInvestmentData = snapshot.val();

      // Find the most recent week and increment it
      let mostRecentWeek = 1;
      for (const key in weekInvestmentData) {
        const weekNumber = parseInt(key.replace("week", ""));
        if (!isNaN(weekNumber) && weekNumber > mostRecentWeek) {
          mostRecentWeek = weekNumber;
        }
      }

      // Calculate the current week
      const currentDate = new Date();
      const oldDate = new Date("July 1, 2024 10:00:00");
      const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;
      const currentWeek =
        Math.floor((currentDate - oldDate) / millisecondsPerWeek) + 1;

      const reducedAmounts = [1000, 10000, 30000, 50000];

      // Check if withdrawalAmount is in reducedAmounts
      if (reducedAmounts.includes(withdrawalAmount)) {
        console.log(
          `Reducing weekInvestment for mostRecentWeek (${mostRecentWeek})`
        );

        // Reduce the weekInvestment by 35%
        for (const key in weekInvestmentData) {
          const weekNumber = parseInt(key.replace("week", ""));
          if (!isNaN(weekNumber) && weekNumber === mostRecentWeek) {
            // Update the weekInvestment value for the most recent week
            weekInvestmentData[key] /= 1.35; // Reduce by 35%
            console.log(`Reduced weekInvestment for week ${weekNumber}`);
            break; // No need to continue looping
          }
        }

        // Update the user's weekInvestment with the reduced data
        update(userWeekInvestmentRef, weekInvestmentData)
          .then(() => {
            console.log("WeekInvestment updated with reduced data.");
          })
          .catch((error) => {
            console.error("Error updating WeekInvestment:", error);
          });
      }

      // Check if the user missed any weeks and add them with 0 investment
      for (let i = mostRecentWeek + 1; i < currentWeek; i++) {
        const newWeekKey = `week${i}`;
        weekInvestmentData[newWeekKey] = newWeekInvestmentAmount;
      }

      // Create a new week key (incremented by 1)
      const newWeekKey = `week${currentWeek}`;

      // Create an object with the new week's investment
      const newWeekData = {
        [newWeekKey]: newWeekInvestmentAmount,
      };

      // Update the user's weekInvestment to include the new week
      update(
        ref(database, `users/${storedUserUid}/weekInvestment`),
        newWeekData
      )
        .then(() => {
          console.log(
            `New week (${newWeekKey}) added with investment amount: ${newWeekInvestmentAmount}`
          );
        })
        .catch((error) => {
          console.error("Error adding the new week's investment:", error);
          const popupElement = document.getElementById("error-Popup");
          showPopup(
            popupElement,
            "An error occurred while adding the new week's investment. Please try again later."
          );
        });
    })
    .catch((error) => {
      console.error("Error fetching weekInvestment data:", error);
      const popupElement = document.getElementById("error-Popup");
      showPopup(popupElement,
        "An error occurred while fetching your weekInvestment data. Please try again later."
      );
    });
}










// Function to close the pop-up
function closePopup(popupElement) {
  popupElement.classList.remove("open-popup");
  popupElement.style.visibility = "hidden";
}

// Function to open the pop-up
function openPopup(popupElement) {
  popupElement.classList.add("open-popup");
  popupElement.style.visibility = "visible";
}

// Function to show the pop-up with a message
function showPopup(popupElement, message) {
  const messageElement = popupElement.querySelector("p");
  messageElement.textContent = message;

  // Open the pop-up with the new message
  openPopup(popupElement);
}










const transactionsRef = ref(database, `users/${storedUserUid}/transactions`);
// Define a function to create a new transaction
// Define a function to create a new transaction with curated data
function createNewTransaction(transactionsRef, requestDetails) {
  

  // Create the pushedVersion object
  const pushedVersion = {
    type: 'Pending',
    date: requestDetails.requestTime,
    refNo: requestDetails.refNo, // Generating the 10-character string
    amount: requestDetails.requestedAmount,
  };

  // Add the curated pushedVersion as a new transaction
  push(transactionsRef, pushedVersion)
    .then(() => {
      console.log('New transaction added successfully.');
    })
    .catch((error) => {
      console.error('Error adding new transaction:', error);
    });
}







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

checkAndUpdateTransactionType(transactionsRef, withdrawRequestRef);


























function setupWithdrawalRequestListener() {
  
  const sendWithdrawalRequestButton = document.getElementById(
    "sendWithdrawalRequest"
  );

  sendWithdrawalRequestButton.addEventListener("click", () => {
    // Get the user UID from local storage
    const storedUserUid = localStorage.getItem("userUid");

    const mpesaNumberInput = document.getElementById("mpesaNumber");
    const confirmMpesaNumberInput =
      document.getElementById("confirmMpesaNumber");
    const mpesaNameInput = document.getElementById("mpesaName");

    // Validate M-Pesa numbers
    const mpesaNumber = mpesaNumberInput.value.trim(); // Trim to remove leading/trailing whitespace
    const confirmMpesaNumber = confirmMpesaNumberInput.value.trim();
    const mpesaName = mpesaNameInput.value.trim();

    // Check if any of the fields are empty
    if (mpesaNumber === "" || confirmMpesaNumber === "" || mpesaName === "") {
      const popupElement = document.getElementById("error-Popup");
      showPopup(popupElement, "Please fill in all M-Pesa fields.");
      return;
    }

    // Check if the phone number format is valid
    const phoneNumberRegex = /^(?:(?:\+254|0)[17]|254|07)[0-9]{8}$/;

    // Matches 07... or 254... or +254...
    if (
      !phoneNumberRegex.test(mpesaNumber) ||
      !phoneNumberRegex.test(confirmMpesaNumber)
    ) {
      const popupElement = document.getElementById("error-Popup");
      showPopup(
        popupElement,
        "Invalid M-Pesa number format. Please use a valid Kenyan phone number starting with 07..., 254..., or +254."
      );
      return;
    }

    // Check if the M-Pesa numbers match
    if (mpesaNumber !== confirmMpesaNumber) {
      const popupElement = document.getElementById("error-Popup");
      showPopup(
        popupElement,
        "M-Pesa numbers do not match. Please check and try again."
      );
      return;
    }

    // If all validation checks pass, you can proceed with further actions here.

    // Get the user's withdrawAmount
    const database = getDatabase(app);
    const withdrawAmountRef = ref(
      database,
      `users/${storedUserUid}/withdrawAmount`
    );

    get(withdrawAmountRef)
      .then((snapshot) => {
        const withdrawAmount = snapshot.val();

        // Check if the requestAmount is zero
        if (withdrawAmount === 0) {
          const popupElement = document.getElementById("error-Popup");
          showPopup(popupElement, "C'mon, You can't request 0 KES 😎! ");
          return; // Stop further processing
        }

        const options = {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: false,
        };

        const currentTime = new Date().toLocaleString("en-US", options);
        console.log(currentTime); // Example output: "7 September 2023, 13:11:28"

        // Update Firebase database with the withdrawal request
        const requestRef = ref(
          database,
          `users/${storedUserUid}/withdrawRequest`
        );

        // Generate a random 7-character string
        function generateRandomString() {
          const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
          let randomString = "";
          for (let i = 0; i < 7; i++) {
            randomString += characters.charAt(
              Math.floor(Math.random() * characters.length)
            );
          }
          return randomString;
        }

        const requestDetails = {
          status: true,
          requestedAmount: withdrawAmount,
          requestTime: currentTime,
          mpesaNumber: mpesaNumber,
          mpesaName: mpesaName,
          refNo: `REC${generateRandomString()}`,
        };

        // Call the function to create a new transaction
        createNewTransaction(transactionsRef, requestDetails);

        set(requestRef, requestDetails)
          .then(() => {
            const popupElement = document.getElementById("success-Popup");
            // Request successfully submitted
            showPopup(
              popupElement,
              "Withdrawal request submitted successfully."
            );
            // Clear input fields
            mpesaNumberInput.value = "";
            confirmMpesaNumberInput.value = "";

            addNewWeekInvestment(storedUserUid, database, withdrawAmount);

            // Set withdrawAmount to zero
            update(ref(database, `users/${storedUserUid}`), {
              withdrawAmount: 0,
            })
              .then(() => {
                console.log("WithdrawAmount set to zero.");
              })
              .catch((error) => {
                console.error("Error updating withdrawAmount:", error);
              });
          })
          .catch((error) => {
            console.error("Error submitting withdrawal request:", error);
            const popupElement = document.getElementById("error-Popup");
            showPopup(
              popupElement,
              "An error occurred while submitting the withdrawal request. Please try again later."
            );
          });
      })
      .catch((error) => {
        console.error("Error fetching withdrawAmount:", error);
        const popupElement = document.getElementById("error-Popup");
        showPopup(
          popupElement,
          "An error occurred while fetching your withdrawAmount. Please try again later."
        );
      });
  });



}

// Call the function to set up the withdrawal request listener
setupWithdrawalRequestListener();

// Function to fetch and store the withdrawal status in local storage
function storeWithdrawalStatus() {
  // Get the user UID from local storage
  const storedUserUid = localStorage.getItem("userUid");

  // Reference to the withdrawal status
  const database = getDatabase(app);
  const withdrawalStatusRef = ref(
    database,
    `users/${storedUserUid}/withdrawRequest/status`
  );

  // Listen for changes to the withdrawal status
  onValue(withdrawalStatusRef, (snapshot) => {
    const status = snapshot.val();
    // Store the status in local storage
    localStorage.setItem("withdrawalStatus", status);

    // Call the functions to update the withdrawal status
    updateWithdrawalStatus();
    updateWithdrawalStatus2();
  });
}

storeWithdrawalStatus();

// Function to update the withdrawal status based on the local storage value
function updateWithdrawalStatus() {
  // Request successfully submitted
  const expensesDiv = document.querySelector(".expenses");

  const withdrawalStatus = localStorage.getItem("withdrawalStatus");

  if (withdrawalStatus === "true") {
    expensesDiv.style.marginTop = "100px";
    expensesDiv.innerHTML = `
      <div class="ticker" style="display: flex; align-items:center; flex-direction:column;">
        <img class="tick" src="../../img/404-tick.png" alt="">
        <p class="ticker-p">Your withdrawal request has been submitted successfully. Kindly wait as we process your withdrawal. The withdrawal should be processed in a few minutes.</p>
      </div>


    `;
  }
}

// Function to retrieve the withdrawAmount and store it locally
function getWithdrawAmountAndStoreLocally() {
  // Replace 'app' with your Firebase app instance
  const database = getDatabase(app);

  // Retrieve the userUid from localStorage
  const storedUserUid = localStorage.getItem("userUid");

  // Create a reference to the 'withdrawAmount' location in the database
  const withdrawAmountRef = ref(
    database,
    `users/${storedUserUid}/withdrawAmount`
  );

  // Listen for changes to the withdrawAmount using the 'onValue' event
  onValue(
    withdrawAmountRef,
    (snapshot) => {
      // Extract the value from the snapshot (or default to 0 if null)
      const withdrawAmount = snapshot.val() || 0;

      // Store the withdrawAmount value locally
      localStorage.setItem("withdrawAmount", withdrawAmount);
    },
    {
      // You can optionally specify error handling here
      errorCallback: (error) => {
        console.error("Error fetching withdrawAmount:", error);
        // Handle the error here if needed
      },
    }
  );
}

// Call the function initially to set up the 'onValue' listener
setInterval(getWithdrawAmountAndStoreLocally, 100);









// Function to update the withdrawal status based on the local storage value
function updateWithdrawalStatus2() {
  const expensesDiv = document.querySelector(".expenses");
  const withdrawalStatus = localStorage.getItem("withdrawalStatus");

  

  if (withdrawalStatus === "false") {
    expensesDiv.style.marginTop = "30px";
    expensesDiv.innerHTML = `
    <div style="display: flex; align-items:center; flex-direction:column;">
            <img class="with" src="../../img/withdraw.png" alt="">

          </div>

          <div class="hinfo">
            <h3 class="username"><i class="fas fa-mobile-alt"></i> Mpesa Number:</h3>
            <input class="inputter" type="number" id="mpesaNumber">

          </div>

          <div class="hinfo">
            <h3 class="username"><i class="fas fa-mobile"></i> Confirm Mpesa no.</h3>
            <input class="inputter" type="number" id="confirmMpesaNumber">

          </div>


          <div class="hinfo">
            <h3 class="username"><i class="fas fa-user"></i> Full Mpesa Name</h3>
            <input class="inputter" type="text" id="mpesaName" required>

          </div>


          <div style="display: flex; justify-content:center">
            <h3 class="username"> You will receive </h3>
            <h1 style="color: rgb(158, 147, 243); font-size:small; padding-top:15px!important; padding:5px;"
              class="withdrawableBalance">
              <p style="font-weight: 700; font-size:13px;"></p>
            </h1>
            <spa style="margin-top: 4px;" class="money-kes">KES</spa>
          </div>


          <div style="display: flex; justify-content:center;">
            <button class="req" style=" font-family:  Bai Jamjuree, sans-serif;
            background-color: #7380ec; padding: 13px 30px;
              border-radius: 10px; font-size: 16px; font-weight: 700; color: white; margin-top: 30px; margin-bottom:20px;
               box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.3),
    -8px -8px 16px rgba(255, 255, 255, 0.1);" id="sendWithdrawalRequest">Send
              Withdrawal Request</button>
          </div>


          <div style="display: flex; justify-content: center; text-align: center;">
            <small style="font-weight: 500; color:grey" class="username">
              <i style="color: #f2450c;font-size:10px" class="fas fa-exclamation"></i>
              We will call you if the mpesa number you used to request the Withdrawal is different from the
              one you
              registered with.

             
            </small>
          </div>`;
    setupWithdrawalRequestListener();
  }
}
// Run onValue
