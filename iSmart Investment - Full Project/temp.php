



<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JavaScript to PHP Example</title>
</head>

<body>
  <h1>JavaScript to PHP Example</h1>

  <script>
    // Retrieve userUid from sessionStorage
    const userUid = sessionStorage.getItem("userUid");

    // Send userUid to PHP using AJAX
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "example.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        console.log(xhr.responseText);
      }
    };
    xhr.send("userUid=" + encodeURIComponent(userUid));
  </script>

  
</body>

</html>



<?php
// PHP code starts here
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["userUid"])) {
  $userUid = $_POST["userUid"];

  // Set the content type to application/json
  header("Content-Type: application/json");

  // Get the response from the POST request
  $response = file_get_contents('php://input');

  // Decode the response
  $responseData = json_decode($response, true);

  // Check if the response data is valid
  if ($responseData) {
    // Define the file path for saving the transaction data
    $filePath = "./{$userUid}.json";

    // Get the existing data from the file
    if (file_exists($filePath)) {
      $existingData = json_decode(file_get_contents($filePath), true);
    } else {
      $existingData = [];
    }

    // Append the new transaction data
    $existingData[] = $responseData;

    // Save the updated data back to the file
    file_put_contents($filePath, json_encode($existingData, JSON_PRETTY_PRINT));

    // Include the transfer.php file
    include 'transfer.php';

    // Send a success response
    echo json_encode(["ResultCode" => 0, "ResultDesc" => "Success"]);
  } else {
    // Send an error response
    echo json_encode(["ResultCode" => 1, "ResultDesc" => "Failed"]);
  }
} else {
  echo "<p>No userUid received</p>";
}
?>



