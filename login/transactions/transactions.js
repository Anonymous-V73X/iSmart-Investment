/*// Import the necessary Firebase SDK modules (app, database, storage)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  set,
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

// Get the user's UID from local storage
const userUid = localStorage.getItem("userUid");

// Function to format a timestamp to a readable date and time
function formatTimestamp(timestamp) {
  // Convert the timestamp to a string if it's not already
  const timestampStr = timestamp.toString();

  const year = parseInt(timestampStr.substr(0, 4));
  const month = parseInt(timestampStr.substr(4, 2)) - 1; // Month is 0-based
  const day = parseInt(timestampStr.substr(6, 2));
  const hour = parseInt(timestampStr.substr(8, 2));
  const minute = parseInt(timestampStr.substr(10, 2));
  const second = parseInt(timestampStr.substr(12, 2));

  const date = new Date(year, month, day, hour, minute, second);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return date.toLocaleDateString(undefined, options);
}

// Fetch the transactions.json file from the same directory
fetch("./transactions.json")
  .then((response) => response.json()) // Parse the response as JSON
  .then((transactions) => {
    // Get a reference to the user's mpesaNumber in the database
    const mpesaNumberRef = ref(database, `users/${userUid}/mpesaNumber`);

    // Get the value of the user's mpesaNumber
    get(mpesaNumberRef)
      .then((snapshot) => {
        const mpesaNumber = snapshot.val();

        // Loop through the transactions array and find the ones that match the user's mpesaNumber
        const matchedTransactions = [];
        for (let transaction of transactions) {
          const callback = transaction.Body.stkCallback;

          if (
            callback &&
            callback.CallbackMetadata &&
            callback.CallbackMetadata.Item
          ) {
            // Get the phone number from the transaction object
            const phoneNumberItem = callback.CallbackMetadata.Item.find(
              (item) => item.Name === "PhoneNumber"
            );

            if (phoneNumberItem) {
              const phoneNumber = phoneNumberItem.Value;

              // Compare the phone number with the user's mpesaNumber
              if (phoneNumber === mpesaNumber) {
                // Get the transaction date, receipt number, and amount from the transaction object

                const transactionDateItem = formatTimestamp(
                  callback.CallbackMetadata.Item.find(
                    (item) => item.Name === "TransactionDate"
                  ).Value
                );

                const receiptNumberItem = callback.CallbackMetadata.Item.find(
                  (item) => item.Name === "MpesaReceiptNumber"
                );
                const amountItem = callback.CallbackMetadata.Item.find(
                  (item) => item.Name === "Amount"
                );

                if (receiptNumberItem && amountItem) {
                  const receiptNumber = receiptNumberItem.Value;
                  const amount = amountItem.Value;

                  // Push the transaction details to the matchedTransactions array
                  matchedTransactions.push({
                    date: transactionDateItem,
                    refNo: receiptNumber,
                    amount,
                    type: "Sent",
                  });
                }
              }
            }
          }
        }

        // Set a new reference to the user called transactions and add the matchedTransactions array as its value
        const transactionsRef = ref(database, `users/${userUid}/transactions`);
        set(transactionsRef, matchedTransactions)
          .then(() => {
            console.log("Transactions added successfully");
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  });
*/