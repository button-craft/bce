//TRADE SENDING FUNCTIONS


const currentUser = JSON.parse(localStorage.getItem('currentUser'));
const currentUsername = currentUser.username.toLowerCase();
function loadMenu() {
  // Get the select menu element
  const selectMenu = document.querySelector('select[name="Tplayers"]');
  
  // Loop through each option in the select menu
  const options = selectMenu.querySelectorAll('option');
  
  options.forEach(option => {
    // Compare the value of the option with the current user's username
    if (option.value.toLowerCase() === currentUsername) {
      // Remove the option if it matches
      option.remove();
    }
  });
}

let fromNames = [];
let theirTradeCards = [];
let yourTradeCards = [];
let curTradeNum = -1;
async function loadTrades(){
  await getTrades();
  populateTradesSelect();
}

//Check which page is open and run specified function
const selectedPage = document.querySelector('.pageSelected');
if (selectedPage.textContent === "Send Trades") {
  loadMenu();
} else {
  loadTrades();
}


let tradeCards = ["","","","","",""]; // Array to store the cards added to the trade list
let indexCards = [0,0,0,0,0,0];
let savedTrade = "";
let tradeTo = "";

// Move the card to the trade list when clicked in resultList
function moveToTradeList(cardClass) {
  console.log('move ' + cardClass);
  const cardElement = document.querySelector(`.${cardClass}`);

  // Add the card to the trade list
  const cardImage = cardElement.src; // Get the image source of the card
  const tradeSlot = findEmptyTradeSlot(cardImage,parseInt(cardClass.replace(/\D/g, ''), 10));
  
  if (tradeSlot !== null) {
    console.log('moving');
    // Mark the card as selected (faded) in resultList
    cardElement.style.opacity = "0.5";  // Fade out the card in the resultList
    cardElement.style.pointerEvents = "none";  // Disable further clicking

    // Update the corresponding tradeList slot with the card image
    const tradeSlotImage = tradeSlot.querySelector("img");
    tradeSlotImage.src = cardImage;
    tradeSlotImage.style.width = "110px"; // Set size for image
  }
}

// Remove the card from the trade list when clicked
function removeFromTradeList(cardClass) {
    console.log('remove ' + cardClass);
    const tradeSlot = document.querySelector(`.${cardClass}`);
    const tradeSlotSrc = tradeSlot.src;
    //const tradeSlotImage = tradeSlot.querySelector("img");
  
    console.log('removing ' + tradeSlot);
    console.log('removing ' + tradeSlotSrc);
    // Ensure tradeSlotImage exists before accessing src
    if (tradeSlot !== null) {
      console.log('remover');
  
      // Find the index of the card in tradeCards array and remove it
      const cardIndex = parseInt(cardClass.replace(/\D/g, ''), 10);
      
      console.log('remover' + tradeSlot.src);
      // Reset the trade slot to default (hide image and set to "Pack.png")
      tradeSlot.src = "Pack.png";
      tradeSlot.style.width = "0px";  // Hide image
  
      // Find a result slot with the matching src to restore opacity
      const slotToRestore = findMatchingResultSlot(tradeSlotSrc,indexCards[parseInt(cardClass.replace(/\D/g, ''), 10)]);
      if (slotToRestore) {
        console.log('FOUND matching result slot');
        const cardElement = slotToRestore.querySelector("img");
        // Set opacity back to 1 and restore visibility in the result list
        console.log('FOUND' + cardElement.src);
        cardElement.style.opacity = "1";  // Restore opacity
        cardElement.style.pointerEvents = "auto";  // Re-enable clicking
      }

      if (cardIndex !== -1) {
        tradeCards[cardIndex]="";
        indexCards[cardIndex]=0;
      }
    }
  }
  
  function findMatchingResultSlot(src,index) {
    if(src !== "pack.png"){
      console.log('find matching result slot' + index);
      const resultListItems = document.querySelectorAll(".resultList li");
      
      for (let i = 0; i < resultListItems.length; i++) {
        const resultSlotImage = resultListItems[i].querySelector("img");
        
        // If a slot with matching src is found, return it
        if (i == index) {
          console.log('YES ' + i);
          return resultListItems[i];
        }
      }
    }
    return null; // No matching slot found
  }

// Find the first empty slot in the tradeList
function findEmptyTradeSlot(tradeVal, indexVal) {
  console.log('find empty');
  const tradeListItems = document.querySelectorAll(".tradeList li");

  for (let i = 0; i < tradeListItems.length; i++) {
    console.log('search');
    const tradeSlotImage = tradeListItems[i].querySelector("img");

    if (tradeSlotImage.width === 0) {
      console.log('found');
      tradeCards[i]=tradeVal; // Store the card in the tradeCards array
      console.log(tradeCards);
      indexCards[i]=indexVal; //get index in resultList
      return tradeListItems[i];
    }
  }
  return null; // No empty slots available
}

// Reset the trade list to be empty
function resetTradeList() {
  // Empty the tradeCards array
  console.log('reset + tradeSlotImage.src');
  // Reset each trade list slot
  const tradeListItems = document.querySelectorAll(".tradeList li");
  tradeListItems.forEach((tradeSlot) => {
    console.log('resetting ' + tradeSlot);
    const tradeSlotImage = tradeSlot.querySelector("img");
    console.log(findFadedResultSlot(tradeSlotImage.src,indexCards[tradeCards.indexOf(tradeSlotImage.src)]));
    console.log('resetted ' + tradeSlotImage.src);
    tradeSlotImage.src = "Pack.png";  // Set image to "pack.png"
    tradeSlotImage.style.width = "0px";  // Set image width to 0px
  });

  tradeCards = ["","","","","",""];
  indexCards = [0,0,0,0,0,0];
}

function findFadedResultSlot(src,index) {
  tradeCards[indexCards.indexOf(index)]="";
  if(src !== "pack.png"){
    console.log('find faded result slot ' + index);
    const resultListItems = document.querySelectorAll(".resultList li");
    
    for (let i = 0; i < resultListItems.length; i++) {
      const resultSlotImage = resultListItems[i].querySelector("img");
      
      // If a slot with matching src is found, fix it
      if (i == index) {
        
        resultSlotImage.style.opacity = "1";  // Restore opacity
        resultSlotImage.style.pointerEvents = "auto";  // Re-enable clicking
        console.log('YESS' + i);
      }
    }
    return true;
  }
  return false; // No matching slot found
}





function saveTrade() {
  //check tradeCards isn't empty
  console.log(tradeCards);
  const tradeCardsCopy = [...tradeCards]
  if(tradeCardsCopy.filter(card => card !== "").length==0){
    console.log("zero");
    window.alert("You must select at least 1 Card to trade. Please try again.");
    return;
  }
  console.log(tradeCards);
  updatePage();
  console.log(tradeCards);
  addYourCards();
  
  // Join the cards array into a single string with commas
  console.log(tradeCards);
  let saveCards = tradeCards.filter(card => card !== "");
  saveCards = saveCards.map(cardurl => {
    // Use a regular expression to match the part after the last '/' and before '.png'
    let match = cardurl.match(/\/([^\/]+)\.png$/);
    return match ? match[1] : cardurl;  // Return the shortened part if a match is found
  });
  console.log(tradeCards);
  console.log("SAVE " + saveCards);
  let cardsString = saveCards.join(',');
  // Combine the name and the cards string
  tradeTo = document.querySelector(".Tplayers").value;
  savedTrade = currentUsername + " " + cardsString;
  console.log(savedTrade);
  console.log(tradeTo);
}

function updatePage() {
  // Change the "Trading with" text
  const tradingText = document.querySelector('p');
  tradingText.textContent = "Select your cards to trade:";

  // Hide the Tplayers selector
  const tPlayersSelect = document.querySelector('.Tplayers');
  tPlayersSelect.style.display = "none";

  // Hide the Trade With text
  const tradeWith = document.querySelector('.tradeText');
  tradeWith.style.display = "none";

  // Hide the Search button
  const searchButton = document.querySelector('.compare');
  searchButton.style.display = "none";

  // Hide the Confirm Trade button
  const confirmTradeButton = document.querySelectorAll('.compare')[1]; // We target the second button here
  confirmTradeButton.style.display = "none";

  // Make Your Cards: text and yourList visible
  const yoursFix = document.querySelector('.yours');
  yoursFix.style.display = "inline-block";
  const yourListFix = document.querySelector('.yourList');
  yourListFix.style.display = "flex";

  // Make Send Trade button visible
  const sendTradeButton = document.querySelector('.send');
  sendTradeButton.style.display = "inline-block";

  // Hide the resultList
  const resultListHide = document.querySelector('.resultList');
  resultListHide.style.display = "none";

  //Make myList visible
  const myListFix = document.querySelector('.myList');
  myListFix.style.display = "flex";

  const tradeListItems = document.querySelectorAll(".tradeList li");
  tradeListItems.forEach((tradeSlot) => {
    console.log('resetting ' + tradeSlot);
    const tradeSlotImage = tradeSlot.querySelector("img");
    //console.log(findFadedResultSlot(tradeSlotImage.src,indexCards[tradeCards.indexOf(tradeSlotImage.src)]));
    console.log('resetted ' + tradeSlotImage.src);
  });
}

async function addYourCards() {

  for (let i = 0; i < 198; i++) {
    let cardResult = document.querySelector(".f" + i);
    cardResult.src = "Pack.png";
    cardResult.style.width = "0px";
    cardResult.style.border = "0";
  }


  let TlistName = currentUsername;
  let Tlist;
  const userRef = db.collection('users');
  if (TlistName == "dc") {
    const userQuery = await userRef
          .where('name', '==', 'dc')
          .get();
    
    const doc = userQuery.docs[0];
    Tlist = doc.data().cards.sort();
  }
  if (TlistName == "gem") {
    const userQuery = await userRef
          .where('name', '==', 'gem')
          .get();
    
    const doc = userQuery.docs[0];
    Tlist = doc.data().cards.sort();
  }
  if (TlistName == "jig") {
    const userQuery = await userRef
          .where('name', '==', 'jig')
          .get();
    
    const doc = userQuery.docs[0];
    Tlist = doc.data().cards.sort();
  }
  if (TlistName == "peach") {
    const userQuery = await userRef
          .where('name', '==', 'peach')
          .get();
    
    const doc = userQuery.docs[0];
    Tlist = doc.data().cards.sort();
  }
  if (TlistName == "void") {
    const userQuery = await userRef
          .where('name', '==', 'void')
          .get();
    
    const doc = userQuery.docs[0];
    Tlist = doc.data().cards.sort();
  }
  if (TlistName == "zav") {
    const userQuery = await userRef
          .where('name', '==', 'zav')
          .get();
    
    const doc = userQuery.docs[0];
    Tlist = doc.data().cards.sort();
  }

  let noTdupes = [];
  let Tdupes = [];
  let prevCard = null;
  for (let i = 0; i < Tlist.length; i++) {
    if (Tlist[i] != prevCard) {
      noTdupes.push(Tlist[i]);
    }
    else {
      Tdupes.push(Tlist[i]);
    }
    prevCard = Tlist[i];
  }

  console.log(noTdupes);

  let num = 0;
  for (let i = 0; i < Tlist.length; i++) {
    console.log("test");
    let cardResult = document.querySelector(".f" + num);
    cardResult.src = "img/" + Tlist[i] + ".png";
    cardResult.style.width = "110px";
    if (Tdupes.includes(Tlist[i])) {
      cardResult.style.border = "2px yellow solid";
    }
    num++;
  }
}




let yourCards = ["","","","","",""]; // Array to store the cards added to the your list
let yourIndexCards = [0,0,0,0,0,0];

// Move the card to the trade list when clicked in resultList
function moveToYourList(cardClass) {
  console.log('move ' + cardClass);
  const cardElement = document.querySelector(`.${cardClass}`);

  // Add the card to the trade list
  const cardImage = cardElement.src; // Get the image source of the card
  const yourSlot = findEmptyYourSlot(cardImage,parseInt(cardClass.replace(/\D/g, ''), 10));
  
  if (yourSlot !== null) {
    console.log('moving');
    // Mark the card as selected (faded) in resultList
    cardElement.style.opacity = "0.5";  // Fade out the card in the resultList
    cardElement.style.pointerEvents = "none";  // Disable further clicking

    // Update the corresponding tradeList slot with the card image
    const yourSlotImage = yourSlot.querySelector("img");
    yourSlotImage.src = cardImage;
    yourSlotImage.style.width = "110px"; // Set size for image
  }
}

// Remove the card from the trade list when clicked
function removeFromYourList(cardClass) {
    console.log('removeyour ' + cardClass);
    const yourSlot = document.querySelector(`.${cardClass}`);
    const yourSlotSrc = yourSlot.src;
    //const tradeSlotImage = tradeSlot.querySelector("img");
  
    console.log('removingyour ' + yourSlot);
    // Ensure tradeSlotImage exists before accessing src
    if (yourSlot !== null) {
      console.log('remover');
  
      // Find the index of the card in tradeCards array and remove it
      const cardIndex = parseInt(cardClass.replace(/\D/g, ''), 10);
      
      console.log('remover' + yourSlot.src);
      // Reset the trade slot to default (hide image and set to "Pack.png")
      yourSlot.src = "Pack.png";
      yourSlot.style.width = "0px";  // Hide image
  
      // Find a result slot with the matching src to restore opacity
      const slotToRestore = findMatchingMySlot(yourSlotSrc,yourIndexCards[parseInt(cardClass.replace(/\D/g, ''), 10)]);
      if (slotToRestore) {
        console.log('FOUND matching my slot');
        const cardElement = slotToRestore.querySelector("img");
        // Set opacity back to 1 and restore visibility in the result list
        console.log('FOUND' + cardElement.src);
        cardElement.style.opacity = "1";  // Restore opacity
        cardElement.style.pointerEvents = "auto";  // Re-enable clicking
      }

      if (cardIndex !== -1) {
        yourCards[cardIndex]="";
        yourIndexCards[cardIndex]=0;
      }
    }
  }
  
  function findMatchingMySlot(src,index) {
    if(src !== "pack.png"){
      console.log('find matching my slot' + index);
      const myListItems = document.querySelectorAll(".myList li");
      
      for (let i = 0; i < myListItems.length; i++) {
        const mySlotImage = myListItems[i].querySelector("img");
        
        // If a slot with matching src is found, return it
        if (i == index) {
          console.log('YES ' + i);
          return myListItems[i];
        }
      }
    }
    return null; // No matching slot found
  }

// Find the first empty slot in the tradeList
function findEmptyYourSlot(yourVal, yourIndexVal) {
  console.log('find your empty');
  const yourListItems = document.querySelectorAll(".yourList li");

  for (let i = 0; i < yourListItems.length; i++) {
    console.log('search');
    const yourSlotImage = yourListItems[i].querySelector("img");

    if (yourSlotImage.width === 0) {
      console.log('found');
      yourCards[i]=yourVal; // Store the card in the tradeCards array
      yourIndexCards[i]=yourIndexVal; //get index in resultList
      return yourListItems[i];
    }
  }
  return null; // No empty slots available
}

async function sendTrade() {
  //check yourCards aren't empty
  if(yourCards.filter(card => card !== "").length==0){
    console.log("zero");
    window.alert("You must select at least 1 Card to trade. Please try again.");
    return;
  }
  
  // Join the cards array into a single string with commas
  let sendCards = yourCards.filter(card => card !== "");
  sendCards = sendCards.map(cardurl => {
    // Use a regular expression to match the part after the last '/' and before '.png'
    let match = cardurl.match(/\/([^\/]+)\.png$/);
    return match ? match[1] : cardurl;  // Return the shortened part if a match is found
  });
  let cardsString = sendCards.join(',');
 // Combine the name and the cards string
  savedTrade = savedTrade + " " + cardsString;
  console.log(savedTrade);

  const userRef = db.collection('users');
  const userQuery = await userRef
        .where('name', '==', tradeTo)
        .get();
  if (!userQuery.empty) {
      const doc = userQuery.docs[0];        
      let currentTrades = doc.data().trades;
      currentTrades.push(savedTrade);
      console.log(doc.data().trades);
      console.log(currentTrades);
      
      await doc.ref.update({
          trades: currentTrades
      });
  }
  location.reload();
}

async function selectTrade() {

  for (let i = 0; i < 198; i++) {
    let cardResult = document.querySelector(".c" + i);
    cardResult.src = "Pack.png";
    cardResult.style.width = "0px";
    cardResult.style.border = "0";
  }


  let TlistName = document.querySelector(".Tplayers");
  let Tlist;
  const userRef = db.collection('users');
  if (TlistName.value == "gem") {
    const userQuery = await userRef
          .where('name', '==', 'gem')
          .get();
    
    const doc = userQuery.docs[0];
    Tlist = doc.data().cards.sort();
  }
  if (TlistName.value == "dc") {
    const userQuery = await userRef
          .where('name', '==', 'dc')
          .get();
    
    const doc = userQuery.docs[0];
    Tlist = doc.data().cards.sort();
  }
  if (TlistName.value == "jig") {
    const userQuery = await userRef
          .where('name', '==', 'jig')
          .get();
    
    const doc = userQuery.docs[0];
    Tlist = doc.data().cards.sort();
  }
  if (TlistName.value == "peach") {
    const userQuery = await userRef
          .where('name', '==', 'peach')
          .get();
    
    const doc = userQuery.docs[0];
    Tlist = doc.data().cards.sort();
  }
  if (TlistName.value == "void") {
    const userQuery = await userRef
          .where('name', '==', 'void')
          .get();
    
    const doc = userQuery.docs[0];
    Tlist = doc.data().cards.sort();
  }
  if (TlistName.value == "zav") {
    const userQuery = await userRef
          .where('name', '==', 'zav')
          .get();
    
    const doc = userQuery.docs[0];
    Tlist = doc.data().cards.sort();
  }

  let noTdupes = [];
  let Tdupes = [];
  let prevCard = null;
  for (let i = 0; i < Tlist.length; i++) {
    if (Tlist[i] != prevCard) {
      noTdupes.push(Tlist[i]);
    }
    else {
      Tdupes.push(Tlist[i]);
    }
    prevCard = Tlist[i];
  }

  console.log(noTdupes);

  let num = 0;
  for (let i = 0; i < Tlist.length; i++) {
    console.log("test");
    let cardResult = document.querySelector(".c" + num);
    cardResult.src = "img/" + Tlist[i] + ".png";
    cardResult.style.width = "110px";
    if (Tdupes.includes(Tlist[i])) {
      cardResult.style.border = "2px yellow solid";
    }
    num++;
  }
}








//TRADE VIEWING FUNCTIONS

async function getTrades() {
  const userRef = db.collection('users');
  const userQuery = await userRef
        .where('name', '==', currentUsername)
        .get();
  if (!userQuery.empty) {
      const doc = userQuery.docs[0];        
      let currentTrades = doc.data().trades;
      currentTrades.forEach(curTrade => {
        let parts = curTrade.split(" ");
        fromNames.push(parts[0]);
        theirTradeCards.push(parts[1].split(","));
        yourTradeCards.push(parts[2].split(","));
      });
      console.log(fromNames);
      console.log(theirTradeCards);
      console.log(yourTradeCards);
  }
}

// Function to populate the tradesSelect dropdown
function populateTradesSelect() {
  const tradesSelect = document.querySelector('.tradesSelect');  // Get the select element
  fromNames.forEach((name, index) => {
    // Create a new option element for each name
    const option = document.createElement('option');
    option.value = name; // Set the value of the option to the name
    if(name=="dc"){
      option.textContent = "DCMetro";
    } else if(name=="gem"){
      option.textContent = "DCGem";
    } else if(name=="jig"){
      option.textContent = "Jiggster";
    } else if(name=="peach"){
      option.textContent = "Peach";
    } else if(name=="void"){
      option.textContent = "VoidMax";
    } else if(name=="zav"){
      option.textContent = "Zaveeya";
    } else{
      option.textContent = "Lurker";
    }
    option.classList.add(`t${index + 1}`); // Add a class like t1, t2, t3, ...
    
    // Append the option to the select element
    tradesSelect.appendChild(option);
  });
}

function changeTrade(){
      console.log("change");
      for (let i = 0; i < 6; i++) {
        let tRem = document.querySelector(".d" + i);
        let yRem = document.querySelector(".e" + i);
        tRem.src = "Pack.png";
        tRem.style.width = "0px";
        yRem.src = "Pack.png";
        yRem.style.width = "0px";
      }
  
    let tradesSelect = document.querySelector(".tradesSelect");
    let selectedOption = tradesSelect.selectedOptions[0];
    let classValue = selectedOption.className;
    let tradeNum = parseInt(classValue.substring(1))-1;
    curTradeNum = tradeNum;
    console.log("changed to " + curTradeNum);
    let tCards = theirTradeCards[tradeNum];
    let yCards = yourTradeCards[tradeNum];
    console.log(tCards + " " + tradeNum);
    console.log(yCards + " " + tradeNum);
    let num = 0;
    for (let i = 0; i < Math.max(tCards.length,yCards.length); i++) {
      console.log("test");
      //their cars setting
      if(tCards[i]!=null){
        let tCard = document.querySelector(".d" + num);
        tCard.src = "img/" + tCards[i] + ".png";
        tCard.style.width = "110px";
      }

      //your cards setting
      if(yCards[i]!=null){
        let yCard = document.querySelector(".e" + num);
        yCard.src = "img/" + yCards[i] + ".png";
        yCard.style.width = "110px";
      }
      num++;
    }
}

async function acceptTrade(){
  console.log("accept");
  if (curTradeNum==-1){
    console.log("ret -1");
    return;
  }
  const userRef = db.collection('users');
  const userQuery = await userRef
        .where('name', '==', currentUsername)
        .get();
  if (!userQuery.empty) {
      const doc = userQuery.docs[0];
      let curTheirCards = doc.data().cards;
      const theirQuery = await userRef
        .where('name', '==', fromNames[curTradeNum])
        .get();
      const doc2 = theirQuery.docs[0];        
      let curYourCards = doc2.data().cards;
      let thisYourTradeCards = yourTradeCards[curTradeNum];
      let thisTheirTradeCards = theirTradeCards[curTradeNum];
      console.log(yourTradeCards);
      console.log(theirTradeCards);
      if (compareArrays(thisYourTradeCards, curYourCards) && compareArrays(thisTheirTradeCards, curTheirCards)){
        let newYourCards = removeCardsArray(curYourCards, thisYourTradeCards);
        console.log(newYourCards);
        let newTheirCards = removeCardsArray(curTheirCards, thisTheirTradeCards);
        newYourCards = newYourCards.concat(thisTheirTradeCards);
        console.log(newYourCards);
        newTheirCards = newTheirCards.concat(thisYourTradeCards);
        console.log("HERE " + thisTheirTradeCards);
        console.log(newTheirCards);
        console.log(thisYourTradeCards);
        console.log(newYourCards);
        await doc.ref.update({
            cards: newTheirCards
        });
        await doc2.ref.update({
            cards: newYourCards
        });
        console.log("accepted");
        declineTrade();
      } else {
        console.log("fail accept");
        if (window.confirm("One side of the trade does not have all the cards. Click OK to decline the trade. Click cancel to keep the trade.")){
          declineTrade();
        }
        return;
      }
  }
  return;
}

function compareArrays(smallerArray, largerArray) {
    if(!(smallerArray.every(element => largerArray.includes(element)))){
      console.log("fail every");
      return false;
    }
  
    // Create an object to count occurrences of each string in the smaller array
    const smallerCount = smallerArray.reduce((acc, str) => {
        acc[str] = (acc[str] || 0) + 1;
        return acc;
    }, {});
    console.log(smallerCount);

    // Create an object to count occurrences of each string in the larger array
    const largerCount = largerArray.reduce((acc, str) => {
        acc[str] = (acc[str] || 0) + 1;
        return acc;
    }, {});
    console.log(largerCount);

    // Check if every string in the smaller array has enough occurrences in the larger array
    for (const str in smallerCount) {
        console.log(smallerCount[str] + " vs " + largerCount[str]);
        if (smallerCount[str] > largerCount[str]) {
            console.log("fail count");
            return false;  // If there's not enough of a string, return false
        }
    }

    return true;  // If all strings in the smaller array are accounted for, return true
}

function removeCardsArray(playCards, remCards) {
  console.log("remCardArray");
  remCards.forEach(str => {
    const index = playCards.indexOf(str);
    if (index !== -1) {
        console.log(playCards[index] + " removedArray");
        playCards.splice(index, 1); // Remove the first occurrence of the string
    }
  });
  return playCards;
}

async function declineTrade(){
  console.log("declining");
  if (curTradeNum==-1){
    return;
  }
  const userRef = db.collection('users');
  const userQuery = await userRef
        .where('name', '==', currentUsername)
        .get();
  if (!userQuery.empty) {
      const doc = userQuery.docs[0];        
      let currentTrades = doc.data().trades;
      currentTrades.splice(curTradeNum,1);
      curTradeNum = -1;
    
      await doc.ref.update({
          trades: currentTrades
      });
  }
  location.reload();
}
