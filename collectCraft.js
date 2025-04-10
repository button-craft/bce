//CRAFT MENU FUNCTIONS

//load cards into list for user to select from
async function loadUserCards() {

  let Tlist;
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const currentUsername = currentUser.username.toLowerCase();
  const userRef = db.collection('users');
  const userQuery = await userRef
        .where('name', '==', currentUsername)
        .get();
  const doc = userQuery.docs[0];
  Tlist = doc.data().cards;
  Tlist = sortByRarity(Tlist.sort());

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
loadUserCards();



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
      indexCards[i]=indexVal; //get index in resultList
      return tradeListItems[i];
    }
  }
  return null; // No empty slots available
}

let tradeCards = ["","","","","",""]; // Array to store the cards added to the trade list
let indexCards = [0,0,0,0,0,0];
let savedTrade = "";
let tradeTo = "";

async function craftCards() {
  document.querySelector(".craft").disabled = true;
  //check craftCards is full
  if(tradeCards.filter(card => card !== "").length!==9){
    console.log("notFull");
    window.alert("You must select 9 cards to craft. Please try again.");
    document.getElementById('craft').disabled = false;
    return;
  }
  
  let saveCards = tradeCards.filter(card => card !== "");
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const currentUsername = currentUser.username.toLowerCase();
  const userRef = db.collection('users');
  const userQuery = await userRef
        .where('name', '==', currentUsername)
        .get();
  const doc = userQuery.docs[0];
  
  let currentCards = doc.data().cards;
  console.log(currentCards);
  for (const curCard of saveCards) {
    const parts = curCard.split('/');
    const lastPart = parts[parts.length - 1];
    const cardCode = lastPart.replace('.png', '');
    const index = currentCards.indexOf(cardCode);
    console.log(cardCode + " " + index);
    if (index !== -1) {
        currentCards.splice(index, 1);
    }
  }
  console.log(currentCards);

  let curTokens = doc.data().tokens;
  let newTokens = curTokens+1;
  await doc.ref.update({
    cards: currentCards,
    tokens: newTokens
  });

  window.alert("Craft Completed.  +1 Pack Token");
  location.reload();
}

//Sorts array of cards by rarity
function sortByRarity(arr){
  const arrayOrder = {
    C: 0,
    U: 1,
    R: 2,
    E: 3,
    L: 4
  };
  const allArrays = { C, U, R, E, L };
  
  const stringToOrderMap = {};
  for (const [key, array] of Object.entries(allArrays)) {
      array.forEach((str, idx) => {
          stringToOrderMap[str] = { order: arrayOrder[key], index: idx };
      });
  }

  // Filter the input array to include only strings from C, U, R, E, or L
  let rarArray = arr.filter(str => stringToOrderMap[str]);

  // Sort the filtered array based on the order of the arrays and index within each array
  rarArray.sort((a, b) => {
      const orderA = stringToOrderMap[a].order;
      const orderB = stringToOrderMap[b].order;

      // First compare by the order of arrays (C first, U second, etc.)
      if (orderA === orderB) {
          // If they belong to the same array, compare by their index in that array
          return stringToOrderMap[a].index - stringToOrderMap[b].index;
      } else {
          return orderA - orderB;
      }
  });

  const aOrPStrings = arr.filter(str => {
    return (str.endsWith("A") || str.endsWith("P")) && 
     !str.startsWith("V") && 
     !str.startsWith("S");
  });
  console.log(arr.sort());
  console.log(rarArray);
  console.log(rarArray.length);
  let newArray = arr.sort().slice(rarArray.length+aOrPStrings.length);
  console.log(newArray);
  newArray = rarArray.concat(newArray);
  newArray = newArray.concat(aOrPStrings);
  return newArray;
}

