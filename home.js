//PACK OPENING FUNCTIONS

let num = 0;
let pack = [];
let packNum=-1;
let reopen=false;

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

//Checks for Token, Opens Pack and Changes Page to Start Pack Opening Sequence
async function openPack(pack_Num) {

  //Check if pack is expired
  if(pack.length==0){
    packNum=pack_Num;
    console.log(packNum);
    let timeCompare = 0;
    if(packNum==0){
      timeCompare=Pack1_Time;
    } else if(packNum==1){
      timeCompare=Pack2_Time;
    } else if(packNum==2){
      timeCompare=Pack3_Time;
    }
    let now = new Date();
    console.log(timeCompare);
    console.log(now.getTime());
    if(timeCompare<now.getTime()){
      alert("This pack is expired.");
      if(reopen){
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
  if(pack.length==0){
    if(curTokens-packCost[packNum]<0){
      alert("Not Enough Pack Tokens!");
      if(reopen){
        location.reload();
      }
      return;
    }
  }
    
  //updates pack token if pack is empty
  if(pack.length==0){
    let newTokens = curTokens - packCost[packNum];
    await doc.ref.update({
      tokens: newTokens
    });
    document.getElementById("token").innerHTML="Pack Tokens: " + newTokens;
  }

  //shows large card
  let cardPic = document.querySelector(".pack");
  if (num != 0) {
    cardPic.style.width = "300px";
    cardPic.style.filter = `drop-shadow(0 0 20px ${getRandomColor()})`;
    cardPic.addEventListener("click", flipCard(cardPic, pack));
    return;
  }

  //hide old page features for card opening
  let packOptions = document.querySelector(".pack-options");
  packOptions.style.display = "none";
  let pageTitle = document.querySelector(".pageTitle");
  pageTitle.style.display = "none";
  let tokenCount = document.querySelector(".tokenCount");
  tokenCount.style.display = "none";

  let inPack = 0;
  let packSize = packSizes[packNum];
  console.log(packNum);

  //SPECIAL - Pack 3
  if (packNum==2){
    for (let i = 0; i < packSize; i++) {
      if (inPack < packSize && Math.floor(Math.random() * P3Srarity) + 1 == 1) {
        let randCard;
        let backUp = 0;
        let available = false;
        while (!available && backUp <= 100) {
          randCard = SpeSet[Math.floor(Math.random() * (SpeSet.length))];
          if (countCards(allCards.concat(pack),randCard) < Scount) {
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
  if (packNum==1){
    for (let i = 0; i < packSize; i++) {
      if (inPack < packSize && Math.floor(Math.random() * P2Vrarity) + 1 == 1) {
        let randCard;
        let backUp = 0;
        let available = false;
        while (!available && backUp <= 100) {
          randCard = VarSet[Math.floor(Math.random() * (VarSet.length))];
          if (countCards(allCards.concat(pack),randCard) < Vcount) {
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
  if (packNum==0){
    for (let i = 0; i < packSize; i++) {
      if (inPack < packSize && Math.floor(Math.random() * Srarity) + 1 == 1) {
        let randCard;
        let backUp = 0;
        let available = false;
        while (!available && backUp <= 100) {
          randCard = SpeSet[Math.floor(Math.random() * (SpeSet.length))];
          if (countCards(allCards.concat(pack),randCard) < Scount) {
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
  if (packNum==0){
    for (let i = 0; i < packSize; i++) {
      if (inPack < packSize && Math.floor(Math.random() * Vrarity) + 1 == 1) {
        let randCard;
        let backUp = 0;
        let available = false;
        while (!available && backUp <= 100) {
          randCard = VarSet[Math.floor(Math.random() * (VarSet.length))];
          if (countCards(allCards.concat(pack),randCard) < Vcount) {
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
        if (countCards(allCards.concat(pack),randCard) < Lcount) {
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
        if (countCards(allCards.concat(pack),randCard) < Ecount) {
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
        if (countCards(allCards.concat(pack),randCard) < Rcount) {
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
        if (countCards(allCards.concat(pack),randCard) < Ucount) {
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

  cardPic.style.width = "300px";
  cardPic.addEventListener("click", flipCard(cardPic, pack));
  console.log(packNum);
}

//Flips to Next Card When Opening Pack, Calls to Show Results When Pack is Empty
function flipCard(cardPic, pack) {
  if (num == pack.length) {
    cardPic.src = "Pack.png";
    cardPic.style.width = "0";
    console.log("results");
    results(pack);
    num++;
    return;
  } else if (num>=pack.length){
    cardPic.src = "Pack.png";
    cardPic.style.width = "0";
    console.log("remove");
    return;
  }
  cardPic.src = "img/" + pack[num];
  console.log(num);
  num++;
}

//Shows all the Cards from the Pack and adds them to the User's Collection
async function results(pack) {
  console.log(pack);
  let resultBack = document.querySelector(".resultList");
  resultBack.style.display = "flex";

  let resTitle = document.querySelector(".resultTitle");
  resTitle.style.display = "block";

  let resetButton = document.querySelector(".resetBtn");
  resetButton.style.display = "block";

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

  await doc.ref.update({
      cards: newCards
  });

  for (let i = 0; i < pack.length; i++) {
    console.log(i);
    let cardResult = document.querySelector(".i" + i);
    cardResult.src = "img/" + pack[i];
    cardResult.style.width = "100px";
    cardResult.style.margin = "5px";
  }
}

//Shuffles Pack of Cards
function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

//Enlarges a Card from the Pack Results
function enlargePack(card) {
  console.log("enlargePack");
  let cardImg = document.querySelector("." + card);
  let hidePack = document.querySelector(".pack");
  hidePack.src = cardImg.src;
  hidePack.style.width = "300px";
  hidePack.style.marginTop = "25px";
  hidePack.style.marginBottom = "50px";
}

//Hides a Card from the Pack Results
function hidePack() {
  console.log("hidePack");
  let hidePack = document.querySelector(".pack");
  hidePack.src = "Pack.png";
  hidePack.style.width = "0px";
  hidePack.style.marginTop = "0px";
  hidePack.style.marginBottom = "0px";
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
function resetPage(){
  num=0;
  pack=[];
  let resList = document.querySelector(".resultList");
  resList.style.display = "none";
  let resTitle = document.querySelector(".resultTitle");
  resTitle.style.display = "none";
  let resCards = document.querySelector(".resultCards");
  resCards.style.display = "none";
  let resetButton = document.querySelector(".resetBtn");
  resetButton.style.display = "none";
  console.log(packNum);
  reopen=true;
  openPack(packNum);
}


//Store Updater
//Pack 1 Info
document.getElementById("PackName1").innerHTML=Pack1_Name;
document.getElementById("PackDesc1").innerHTML=Pack1_Description;
document.getElementById("Pack1").src=Pack1_Image;
//Pack 2 Info
document.getElementById("PackName2").innerHTML=Pack2_Name;
document.getElementById("PackDesc2").innerHTML=Pack2_Description;
document.getElementById("Pack2").src=Pack2_Image;
//Pack 3 Info
document.getElementById("PackName3").innerHTML=Pack3_Name;
document.getElementById("PackDesc3").innerHTML=Pack3_Description;
document.getElementById("Pack3").src=Pack3_Image;
