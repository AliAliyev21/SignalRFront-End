const connection = new signalR.HubConnectionBuilder()
  .withUrl("https://localhost:7001/offers")
  .configureLogging(signalR.LogLevel.Information)
  .build();

const url = "https://localhost:7001/";
let timerInterval; 

async function start() {
  try {
    await connection.start();
    console.log("SignalR Started");

    const element = document.querySelector("#offerValue");
    $.get(url + "api/Offer", function (data) {
      element.innerHTML = "Current bid: " + data + "$";
    });

    connection.on("ReceiveMessage", (message, data) => {
      let element = document.querySelector("#responseOfferValue");
      element.innerHTML = message + data + "$";
    });
  } catch (err) {
    console.log(err);
    setTimeout(() => {
      start();
    }, 5000);
  }
}

start();

function updateBidDisplay(bid) {
  document.querySelector("#offerValue").innerHTML = "Current bid: " + bid + "$";
}

function startTimerDisplay(seconds) {
  const timerElement = document.querySelector("#timer");
  timerElement.innerHTML = `Time left: ${seconds} seconds`;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    seconds--;
    timerElement.innerHTML = `Time left: ${seconds} seconds`;
    if (seconds <= 0) {
      clearInterval(timerInterval);
      timerElement.innerHTML = "Auction closed";
    }
  }, 1000);
}

async function IncreaseOffer() {
  const user = document.querySelector("#user").value;
  const bidAmount = 200; 
  try {
    $.get(url + `api/Offer/Increase?data=${bidAmount}&user=${user}`, function (data) {
      updateBidDisplay(data.CurrentBid);
      startTimerDisplay(30); 
      connection.invoke("SendMessage", user);
    });
  } catch (err) {
    console.error("Error placing bid:", err);
  }
}
