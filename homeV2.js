//PACK OPENING FUNCTIONS

let num = 0;
let pack = [];
let packNum = -1;
let reopen = false;
let isAnimating = false; // Flag to prevent multiple clicks during animation
let packContainer = null; // Track the pack container for cleanup

//Loads in Pack Token Count
async function loadTokens() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userRef = db.collection('users');
  const userQuery = await userRef
      .where('name', '==', currentUser.username)
      .get();
  const doc = userQuery.docs[0];
  let tokens = doc.data().tokens;
  document.getElementsByClassName('tokenCount')[0].textContent = 'Pack Tokens: ' + tokens;
}
loadTokens();

// Initial setup to hide the pack image
window.onload = function() {
  const packImage = document.querySelector(".pack");
  if (packImage) {
    packImage.style.width = "0px";
    packImage.style.display = "none";
  }
  
  //Store Updater
  //Pack 1 Info
  document.getElementById("PackName1").innerHTML = Pack1_Name;
  document.getElementById("PackDesc1").innerHTML = Pack1_Description;
  document.getElementById("Pack1").src = Pack1_Image;
  //Pack 2 Info
  document.getElementById("PackName2").innerHTML = Pack2_Name;
  document.getElementById("PackDesc2").innerHTML = Pack2_Description;
  document.getElementById("Pack2").src = Pack2_Image;
  //Pack 3 Info
  document.getElementById("PackName3").innerHTML = Pack3_Name;
  document.getElementById("PackDesc3").innerHTML = Pack3_Description;
  document.getElementById("Pack3").src = Pack3_Image;
};

//Checks for Token, Opens Pack and Changes Page to Start Pack Opening Sequence
async function openPack(pack_Num) {
  // Prevent multiple clicks while animating
  if (isAnimating) return;

  //Check if pack is expired
  if(pack.length == 0) {
    packNum = pack_Num;
    console.log(packNum);
    let timeCompare = 0;
    if(packNum == 0) {
      timeCompare = Pack1_Time;
    } else if(packNum == 1) {
      timeCompare = Pack2_Time;
    } else if(packNum == 2) {
      timeCompare = Pack3_Time;
    } else {
      // Invalid pack selection - don't proceed
      return;
    }
    
    let now = new Date();
    console.log(timeCompare);
    console.log(now.getTime());
    if(timeCompare < now.getTime()) {
      alert("This pack is expired.");
      if(reopen) {
        location.reload();
      }
      return;
    }
  }
  
  const userRef = db.collection('users');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userQuery = await userRef
    .where('name', '==', currentUser.username.toLowerCase())
    .get();

  const allQuery = await userRef.get();
  let allCards = allQuery.docs[0].data().cards.concat(
    allQuery.docs[1].data().cards, 
    allQuery.docs[2].data().cards, 
    allQuery.docs[3].data().cards,
    allQuery.docs[4].data().cards, 
    allQuery.docs[5].data().cards);

  //check if user has enough tokens to open pack
  const doc = userQuery.docs[0];
  let curTokens = doc.data().tokens;
  if(pack.length == 0) {
    if(curTokens - packCost[packNum] < 0) {
      alert("Not Enough Pack Tokens!");
      if(reopen) {
        location.reload();
      }
      return;
    }
  }
    
  //updates pack token if pack is empty
  if(pack.length == 0) {
    let newTokens = curTokens - packCost[packNum];
    await doc.ref.update({
      tokens: newTokens
    });
    document.getElementById("token").innerHTML = "Pack Tokens: " + newTokens;
    
    // Also update the token count at the top of the page
    const tokenCountElement = document.querySelector('.tokenCount');
    if (tokenCountElement) {
      tokenCountElement.textContent = 'Pack Tokens: ' + newTokens;
    }
  }

  //hide old page features for card opening
  let packOptions = document.querySelector(".pack-options");
  if (packOptions) packOptions.style.display = "none";
  
  let pageTitle = document.querySelector(".pageTitle");
  if (pageTitle) pageTitle.style.display = "none";
  
  let tokenCount = document.querySelector(".tokenCount");
  if (tokenCount) tokenCount.style.display = "none";

  //shows large card
  let cardPic = document.querySelector(".pack");
  
  // Check if cardPic exists before proceeding
  if (!cardPic) {
    console.error("Card picture element not found");
    return;
  }
  
  cardPic.style.display = "block"; // Make sure it's visible
  
  if (num != 0) {
    cardPic.style.width = "300px";
    cardPic.style.filter = `drop-shadow(0 0 20px ${getRandomColor()})`;
    // Using a proper function reference instead of directly calling it
    cardPic.onclick = function() { flipCard(cardPic); };
    return;
  }

  let inPack = 0;
  let packSize = packSizes[packNum];
  console.log(packNum);

  // Generate pack contents
  //SPECIAL - Pack 3
  if (packNum == 2) {
    for (let i = 0; i < packSize; i++) {
      if (inPack < packSize && Math.floor(Math.random() * P3Srarity) + 1 == 1) {
        let randCard;
        let backUp = 0;
        let available = false;
        while (!available && backUp <= 100) {
          randCard = SpeSet[Math.floor(Math.random() * (SpeSet.length))];
          if (countCards(allCards.concat(pack), randCard) < Scount) {
            available = true;
          }
          backUp++;
        }
        if (backUp <= 99) {
          pack.push(randCard + ".png");
          inPack++;
          console.log(randCard);
        }
      }
    }
  }
  
  //VARIANT - Pack 2
  if (packNum == 1) {
    for (let i = 0; i < packSize; i++) {
      if (inPack < packSize && Math.floor(Math.random() * P2Vrarity) + 1 == 1) {
        let randCard;
        let backUp = 0;
        let available = false;
        while (!available && backUp <= 100) {
          randCard = VarSet[Math.floor(Math.random() * (VarSet.length))];
          if (countCards(allCards.concat(pack), randCard) < Vcount) {
            available = true;
          }
          backUp++;
        }
        if (backUp <= 99) {
          pack.push(randCard + ".png");
          inPack++;
          console.log(randCard);
        }
      }
    }
  }

  //SPECIAL - Standard
  if (packNum == 0) {
    for (let i = 0; i < packSize; i++) {
      if (inPack < packSize && Math.floor(Math.random() * Srarity) + 1 == 1) {
        let randCard;
        let backUp = 0;
        let available = false;
        while (!available && backUp <= 100) {
          randCard = SpeSet[Math.floor(Math.random() * (SpeSet.length))];
          if (countCards(allCards.concat(pack), randCard) < Scount) {
            available = true;
          }
          backUp++;
        }
        if (backUp <= 99) {
          pack.push(randCard + ".png");
          inPack++;
          console.log(randCard);
        }
      }
    }
  }

  //VARIANT - Standard
  if (packNum == 0) {
    for (let i = 0; i < packSize; i++) {
      if (inPack < packSize && Math.floor(Math.random() * Vrarity) + 1 == 1) {
        let randCard;
        let backUp = 0;
        let available = false;
        while (!available && backUp <= 100) {
          randCard = VarSet[Math.floor(Math.random() * (VarSet.length))];
          if (countCards(allCards.concat(pack), randCard) < Vcount) {
            available = true;
          }
          backUp++;
        }
        if (backUp <= 99) {
          pack.push(randCard + ".png");
          inPack++;
          console.log(randCard);
        }
      }
    }
  }
    
  //LEGENDARY
  for (let i = 0; i < packSize; i++) {
    if (inPack < packSize && Math.floor(Math.random() * Lrarity) + 1 == 1) {
      let randCard;
      let backUp = 0;
      let available = false;
      while (!available && backUp <= 100) {
        randCard = L[Math.floor(Math.random() * (L.length))];
        if (countCards(allCards.concat(pack), randCard) < Lcount) {
          available = true;
        }
        backUp++;
      }
      if (backUp <= 99) {
        pack.push(randCard + ".png");
        inPack++;
        console.log(randCard);
        i = packSize; //One L per Pack
      }
    }
  }

  //EPIC
  for (let i = 0; i < packSize; i++) {
    if (inPack < packSize && Math.floor(Math.random() * Erarity) + 1 == 1) {
      let randCard;
      let backUp = 0;
      let available = false;
      while (!available && backUp <= 100) {
        randCard = E[Math.floor(Math.random() * (E.length))];
        if (countCards(allCards.concat(pack), randCard) < Ecount) {
          available = true;
        }
        backUp++;
      }
      if (backUp <= 99) {
        pack.push(randCard + ".png");
        inPack++;
        console.log(randCard);
      }
    }
  }

  //RARE
  for (let i = 0; i < packSize; i++) {
    if (inPack < packSize && Math.floor(Math.random() * Rrarity) + 1 == 1) {
      let randCard;
      let backUp = 0;
      let available = false;
      while (!available && backUp <= 100) {
        randCard = R[Math.floor(Math.random() * (R.length))];
        if (countCards(allCards.concat(pack), randCard) < Rcount) {
          available = true;
        }
        backUp++;
      }
      if (backUp <= 99) {
        pack.push(randCard + ".png");
        inPack++;
        console.log(randCard);
      }
    }
  }

  //UNCOMMON
  for (let i = 0; i < packSize; i++) {
    if (inPack < packSize && Math.floor(Math.random() * Urarity) + 1 == 1) {
      let randCard;
      let backUp = 0;
      let available = false;
      while (!available && backUp <= 100) {
        randCard = U[Math.floor(Math.random() * (U.length))];
        if (countCards(allCards.concat(pack), randCard) < Ucount) {
          available = true;
        }
        backUp++;
      }
      if (backUp <= 99) {
        pack.push(randCard + ".png");
        inPack++;
        console.log(randCard);
      }
    }
  }

  //COMMON
  for (let i = inPack; i < packSize; i++) {
    pack.push(C[Math.floor(Math.random() * (C.length))] + ".png");
  }

  shuffle(pack);
  console.log(pack);

  // Simply show the first card without the peel-back animation
  cardPic.src = "img/" + pack[0];
  cardPic.style.width = "300px";
  cardPic.style.filter = `drop-shadow(0 0 20px ${getRandomColor()})`;
  
  // Create and attach the container div if it doesn't exist
  if (!packContainer) {
    packContainer = document.createElement('div');
    packContainer.className = 'pack-container';
    if (cardPic.parentNode) {
      cardPic.parentNode.insertBefore(packContainer, cardPic);
      packContainer.appendChild(cardPic);
    }
  }
  
  // Set up the click handler for the next card
  num = 1;
  cardPic.onclick = function() { flipCard(cardPic); };
  
  // Apply special animation for legendary cards on first card
  checkForSpecialCard(pack[0]);
}

// Function to check if a card is special/legendary and apply special animation
function checkForSpecialCard(card) {
  // Extract the base card code without .png
  const cardCode = card.split('.')[0];
  
  // Check if it's a legendary, epic, variant, or special card
  if (L.includes(cardCode)) {
    applyLegendaryAnimation();
  } else if (E.includes(cardCode)) {
    applyEpicAnimation();
  } else if (VarSet.includes(cardCode) || SpeSet.includes(cardCode)) {
    applySpecialAnimation();
  }
}

// Apply a special animation for legendary cards
function applyLegendaryAnimation() {
  const cardPic = document.querySelector(".pack");
  if (!cardPic) return;
  
  // Gold shimmer effect
  cardPic.style.boxShadow = "0 0 30px 15px gold";
  cardPic.style.animation = "pulse 1.5s infinite";
  
  // Add CSS for the animation if it doesn't exist
  if (!document.getElementById('special-animations')) {
    const style = document.createElement('style');
    style.id = 'special-animations';
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); box-shadow: 0 0 30px 15px gold; }
        50% { transform: scale(1.05); box-shadow: 0 0 40px 20px gold; }
        100% { transform: scale(1); box-shadow: 0 0 30px 15px gold; }
      }
      
      @keyframes epic-glow {
        0% { box-shadow: 0 0 20px 10px purple; }
        50% { box-shadow: 0 0 30px 15px purple; }
        100% { box-shadow: 0 0 20px 10px purple; }
      }
      
      @keyframes special-rainbow {
        0% { box-shadow: 0 0 20px 10px red; }
        16.6% { box-shadow: 0 0 20px 10px orange; }
        33.3% { box-shadow: 0 0 20px 10px yellow; }
        50% { box-shadow: 0 0 20px 10px green; }
        66.6% { box-shadow: 0 0 20px 10px blue; }
        83.3% { box-shadow: 0 0 20px 10px indigo; }
        100% { box-shadow: 0 0 20px 10px violet; }
      }
    `;
    document.head.appendChild(style);
  }
}

// Apply a special animation for epic cards
function applyEpicAnimation() {
  const cardPic = document.querySelector(".pack");
  if (!cardPic) return;
  
  // Purple glow effect
  cardPic.style.boxShadow = "0 0 20px 10px purple";
  cardPic.style.animation = "epic-glow 2s infinite";
}

// Apply a special animation for variant/special cards
function applySpecialAnimation() {
  const cardPic = document.querySelector(".pack");
  if (!cardPic) return;
  
  // Rainbow effect
  cardPic.style.animation = "special-rainbow 3s infinite";
}

//Shows next card when clicked, with animation
function flipCard(cardPic) {
  if (isAnimating) return;
  isAnimating = true;
  
  if (num == pack.length) {
    // Slide out the last card
    cardPic.classList.add('slide-out');
    
    setTimeout(() => {
      cardPic.src = "Pack.png";
      cardPic.style.width = "0";
      cardPic.style.display = "none";
      cardPic.classList.remove('slide-out');
      cardPic.style.animation = "none";
      cardPic.style.boxShadow = "none";
      
      // Clean up the pack container
      if (packContainer && packContainer.parentNode) {
        packContainer.parentNode.removeChild(packContainer);
        packContainer = null;
      }
      
      console.log("results");
      results(pack);
      num++;
      isAnimating = false;
    }, 600);
    return;
  } else if (num >= pack.length) {
    cardPic.src = "Pack.png";
    cardPic.style.width = "0";
    cardPic.style.display = "none";
    cardPic.style.animation = "none";
    cardPic.style.boxShadow = "none";
    
    // Clean up the pack container
    if (packContainer && packContainer.parentNode) {
      packContainer.parentNode.removeChild(packContainer);
      packContainer = null;
    }
    
    console.log("remove");
    isAnimating = false;
    return;
  }
  
  // Slide out the current card
  cardPic.classList.add('slide-out');
  
  setTimeout(() => {
    // After slide out, prepare the next card
    cardPic.classList.remove('slide-out');
    cardPic.style.opacity = "0";
    cardPic.style.animation = "none";
    cardPic.style.boxShadow = "none";
    
    setTimeout(() => {
      // Update to new card and fade in
      cardPic.src = "img/" + pack[num];
      cardPic.style.filter = `drop-shadow(0 0 20px ${getRandomColor()})`;
      cardPic.style.opacity = "1";
      
      // Check if this is a special card
      checkForSpecialCard(pack[num]);
      
      console.log(num);
      num++;
      isAnimating = false;
    }, 300);
  }, 600);
}

//Shows all the Cards from the Pack and adds them to the User's Collection
async function results(pack) {
  console.log(pack);
  let resultBack = document.querySelector(".resultList");
  
  // Prepare the results container but keep it hidden initially
  resultBack.style.display = "flex";
  resultBack.style.opacity = "0";

  let resTitle = document.querySelector(".resultTitle");
  resTitle.style.display = "block";
  resTitle.style.opacity = "0";

  let resetButton = document.querySelector(".resetBtn");
  resetButton.style.display = "block";
  resetButton.style.opacity = "0";

  const userRef = db.collection('users');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userQuery = await userRef
    .where('name', '==', currentUser.username.toLowerCase())
    .get();

  const doc = userQuery.docs[0];
  let currentCards = doc.data().cards;
  let newCards = currentCards;

  let cardsOut = document.querySelector(".resultCards");
  cardsOut.innerHTML = "Cards: [";
  for (let i = 0; i < pack.length; i++) {
    cardsOut.innerHTML = cardsOut.innerHTML + pack[i].substring(0, pack[i].length - 4) + ", ";
    newCards = newCards.concat([pack[i].substring(0, pack[i].length - 4)]);
  }
  cardsOut.innerHTML = cardsOut.innerHTML.substring(0, cardsOut.innerHTML.length - 2) + "]";
  cardsOut.style.display = "block";
  cardsOut.style.opacity = "0";

  await doc.ref.update({
      cards: newCards
  });

  // Add cards to results with initial hidden state
  for (let i = 0; i < pack.length; i++) {
    console.log(i);
    let cardResult = document.querySelector(".i" + i);
    cardResult.src = "img/" + pack[i];
    cardResult.style.width = "0px"; // Start at 0 width
    cardResult.style.margin = "5px";
    cardResult.style.opacity = "0";
    cardResult.style.transform = "translateY(20px)";
    cardResult.style.transition = "all 0.3s ease";
  }

  // Fade in the results title and description
  setTimeout(() => {
    resTitle.style.opacity = "1";
    resTitle.style.transition = "opacity 0.5s ease";
    
    setTimeout(() => {
      cardsOut.style.opacity = "1";
      cardsOut.style.transition = "opacity 0.5s ease";
      
      setTimeout(() => {
        resultBack.style.opacity = "1";
        resultBack.style.transition = "opacity 0.5s ease";
        
        // Animate each card entering with a staggered delay
        for (let i = 0; i < pack.length; i++) {
          setTimeout(() => {
            let cardResult = document.querySelector(".i" + i);
            cardResult.style.width = "100px"; // Now show the card
            cardResult.style.opacity = "1";
            cardResult.style.transform = "translateY(0)";
          }, i * 150);
        }
        
        // Finally show the reset button
        setTimeout(() => {
          resetButton.style.opacity = "1";
          resetButton.style.transition = "opacity 0.5s ease";
        }, pack.length * 150 + 300);
        
      }, 300);
    }, 300);
  }, 300);
}

//Shuffles Pack of Cards
function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

//Enlarges a Card from the Pack Results
function enlargePack(card) {
  console.log("enlargePack");
  let cardImg = document.querySelector("." + card);
  
  if (!cardImg) return;
  
  // Create the pack container if it doesn't exist
  let hidePack = document.querySelector(".pack");
  
  if (!hidePack) return;
  
  hidePack.style.display = "block";
  hidePack.style.opacity = "0";
  hidePack.style.transform = "scale(0.9)";
  
  setTimeout(() => {
    hidePack.src = cardImg.src;
    hidePack.style.width = "300px";
    hidePack.style.marginTop = "25px";
    hidePack.style.marginBottom = "50px";
    
    setTimeout(() => {
      hidePack.style.opacity = "1";
      hidePack.style.transform = "scale(1)";
      hidePack.style.transition = "all 0.3s ease";
    }, 50);
  }, 300);
}

//Hides a Card from the Pack Results
function hidePack() {
  console.log("hidePack");
  let hidePack = document.querySelector(".pack");
  
  if (!hidePack) return;
  
  hidePack.style.opacity = "0";
  hidePack.style.transform = "scale(0.9)";
  hidePack.style.transition = "all 0.3s ease";
  
  setTimeout(() => {
    hidePack.src = "Pack.png";
    hidePack.style.width = "0px";
    hidePack.style.display = "none";
    hidePack.style.marginTop = "0px";
    hidePack.style.marginBottom = "0px";
  }, 300);
}

//Generates Random Color for Card Shadow
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

//counts amount of a card in the array
function countCards(curDeck, searchCard) {
    return curDeck.filter(item => item === searchCard).length;
}

//resets page to open the same pack again
function resetPage() {
  num = 0;
  pack = [];
  isAnimating = false;
  
  // Fade out the results
  let resList = document.querySelector(".resultList");
  let resTitle = document.querySelector(".resultTitle");
  let resCards = document.querySelector(".resultCards");
  let resetButton = document.querySelector(".resetBtn");
  
  if (!resList || !resTitle || !resCards || !resetButton) {
    return;
  }
  
  resList.style.opacity = "0";
  resTitle.style.opacity = "0";
  resCards.style.opacity = "0";
  resetButton.style.opacity = "0";
  
  // Hide cards in the result list
  const resultCards = resList.querySelectorAll("img");
  for (let i = 0; i < resultCards.length; i++) {
    resultCards[i].style.width = "0px";
    resultCards[i].style.opacity = "0";
  }
  
  setTimeout(() => {
    resList.style.display = "none";
    resTitle.style.display = "none";
    resCards.style.display = "none";
    resetButton.style.display = "none";
    
    console.log(packNum);
    reopen = true;
    openPack(packNum);
  }, 500);
}
