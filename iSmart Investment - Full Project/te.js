// Importin the functions needed from the SDKs ...
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";

import {
  getDatabase,
  ref,
  set,
  push
  
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

// the web app's Firebase configuration API AND  ALL SORT OF STUFF
const firebaseConfig = {
  apiKey: "AIzaSyCjo5Q7udPIXCVUFJYG4Dp1hcpLvAElg6o",
  authDomain: "money-92adb.firebaseapp.com",
  databaseURL: "https://money-92adb-default-rtdb.firebaseio.com",
  projectId: "money-92adb",
  storageBucket: "money-92adb.appspot.com",
  messagingSenderId: "1042572717494",
  appId: "1:1042572717494:web:f056df88597e53c3a0e517",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const userUid = sessionStorage.getItem("userUid");

// Read the contents of trans.json using AJAX
const xhr = new XMLHttpRequest();
xhr.open("GET", "./trans.json", true);
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      const jsonData = JSON.parse(xhr.responseText);
      processData(jsonData);
    } else {
      console.error("Failed to read trans.json");
    }
  }
};
xhr.send();

// Process the JSON data and upload to Firebase
function processData(data) {
  try {
    const filteredData = data.map(item => {
      const callbackMetadata = item?.Body?.stkCallback?.CallbackMetadata;
      if (callbackMetadata) {
        const amount = callbackMetadata?.Item.find(meta => meta.Name === "Amount")?.Value || null;
        const refNo = callbackMetadata?.Item.find(meta => meta.Name === "MpesaReceiptNumber")?.Value || null;
        const date = callbackMetadata?.Item.find(meta => meta.Name === "TransactionDate")?.Value || null;
        const type = "RECEIVED"; 
        if (amount !== null && refNo !== null && date !== null) {
          return { amount, refNo, date: new Date(date).toISOString(), type };
        }
      }
    }).filter(Boolean);

    
    console.log("User UID:", userUid);
    
    if (userUid) {
      const userRef = ref(database, `users/${userUid}/transactions`);
      filteredData.forEach(transaction => {
        try {
          push(userRef, transaction);
        } catch (error) {
          console.error("Error uploading transaction data to Firebase:", error);
        }
      });
    } else {
      console.error("User UID not found in localStorage");
    }
  } catch (error) {
    console.error("Error processing data:", error);
  }
}