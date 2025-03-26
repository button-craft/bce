let CHILLYcards = [];
let GEMcards = [];
let DCcards = [];
let VOIDcards = [];
let ZAVcards = [];

let CODES = [2025];
let specialCODES = [];

let addRain = false;
//addRain = true;
let addSnow = false;
addSnow = true;
let addLightning = false;
//addLightning=true;


let VARmiss = ["01-5", "01-4", "01-1", "01-3", "01-2"];

let C = ["01-1", "01-2"];
let U = ["01-3", "01-4"];
let R = ["01-5", "01-6"];
let E = ["01-7"];
let L = ["01-8"];
let Gl = ["V1-1", "V1-2", "V1-3", "V1-4", "V1-5", "V1-6", "V1-7", "V1-8"];
let Ra = ["V2-1", "V2-2", "V2-3", "V2-4", "V2-5", "V2-6", "V2-7", "V2-8"];
let Sn = ["V3-1", "V3-2", "V3-3", "V3-4", "V3-5", "V3-6", "V3-7", "V3-8"];
let Ch = ["V4-1", "V4-2", "V4-3", "V4-4", "V4-5", "V4-6", "V4-7", "V4-8"];
let Ba = ["V5-1", "V5-2", "V5-3", "V5-4", "V5-5", "V5-6", "V5-7", "V5-8"];
let Pt = ["V6-1", "V6-2", "V6-3", "V6-4", "V6-5", "V6-6", "V6-7", "V6-8"];
let Mt1 = ["V7-1", "V7-2", "V7-3", "V7-4", "V7-5", "V7-6", "V7-7", "V7-8"];
let Bt = ["V8-1", "V8-2", "V8-3", "V8-4", "V8-5", "V8-6", "V8-7", "V8-8"];
let Ln = ["V9-1", "V9-2", "V9-3", "V9-4", "V9-5", "V9-6", "V9-7", "V9-8"];
let F = ["F1-01", "F1-02", "F1-03", "F1-04", "F1-05", "F1-06", "F1-07", "F1-08", "F1-09", "F1-10", "F1-14", "F1-16", "F1-24"];
let M = ["M1-1", "M1-2", "M1-3", "M1-4", "M1-5", "M1-6", "M1-7", "M1-8", "M1-9", "M2-1", "M2-2", "M2-3", "M2-4", "M2-5", "M2-6", "M2-7", "M2-8", "M2-9", "M3-1", "M3-2", "M3-3", "M3-4", "M3-5", "M3-6", "M3-7", "M3-8", "M3-9", "M4-1", "M4-2", "M4-3", "M4-4", "M4-5", "M4-6", "M4-7", "M4-8", "M4-9"];
let P = ["P-01", "P-02", "P-03"];
let T = ["T-01", "T-02", "T-03", "T-04", "T-05", "T-06"];
let V = [];
//let Fx = ["F1-19", "F1-21"];


V = V.concat(Ch, Mt1);
if (addRain) {
  V = V.concat(Ra);
}
if (addSnow) {
  V = V.concat(Sn);
}
if (addLightning) {
  //V = V.concat(Ln);
}

let inDeck = ["05-1", "05-2", "05-3", "05-4", "05-5", "05-6", "05-7", "06-1", "06-2", "06-3", "06-4", "06-5", "06-6", "06-7", "B-1", "B-2", "B-3", "B-4", "B-5", "B-6", "V1-1", "V1-2", "V1-3", "V1-4", "V1-5", "V1-6", "V1-7", "V1-8", "04-1", "04-2", "04-3", "04-4", "04-5", "04-6", "04-7", "02-1", "02-2", "02-3", "02-4", "02-5", "02-6"];

CHILLYcards.sort();
GEMcards.sort();
DCcards.sort();
VOIDcards.sort();
ZAVcards.sort();
let OWNEDcards = CHILLYcards.concat(GEMcards, DCcards, VOIDcards, ZAVcards).sort();

let List01 = ["01-1", "01-2", "01-3", "01-4", "01-5", "01-6", "01-7", "01-8", "01-A", "01-SA"];


let allSets = [null, List01];
let FULLcards = List01.sort();

let AllV = [];
let SP = P.concat(T);
CODES = CODES.concat(specialCODES);

let pageLogo = document.querySelector(".logoLink").getAttribute("href");
let player;

let FULLdupes = FULLcards.slice(0);
for (let i = 0; i < FULLdupes.length; i++) {
  FULLdupes[i] = 0;
}
for (let i = 0; i < OWNEDcards.length; i++) {
  FULLdupes[FULLcards.indexOf(OWNEDcards[i])]++;
}


if (pageLogo != "collections.html") {
  player = document.querySelector(".active").getAttribute("href");
  collectTab();
}




async function collectTab() {
  const userRef = db.collection('users');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  let pastCard = "";

  if (player == "collectGem.html") {
    const userQuery = await userRef
          .where('name', '==', 'gem')
          .get();
    
    const doc = userQuery.docs[0];
    let GEMcards = doc.data().cards.sort();
    console.log(doc.data());
    
    for (let i = 0; i < GEMcards.length; i++) {
      console.log(i);
      let cardResult = document.querySelector(".c" + i);
      cardResult.src = "img/" + GEMcards[i] + ".png";
      cardResult.style.width = "110px";
      if (GEMcards[i] == pastCard) {
        let lastCardResult = document.querySelector(".c" + (i - 1));
        lastCardResult.style.border = "2px yellow solid";
        cardResult.style.border = "2px yellow solid";
      }
      pastCard = GEMcards[i];
    }
  }

  if (player == "collectDC.html") {
    const userQuery = await userRef
          .where('name', '==', 'dc')
          .get();
    
    const doc = userQuery.docs[0];
    let DCcards = doc.data().cards.sort();
    console.log(doc.data());
    
    for (let i = 0; i < DCcards.length; i++) {
      console.log(i);
      let cardResult = document.querySelector(".c" + i);
      cardResult.src = "img/" + DCcards[i] + ".png";
      cardResult.style.width = "110px";
      if (DCcards[i] == pastCard) {
        let lastCardResult = document.querySelector(".c" + (i - 1));
        lastCardResult.style.border = "2px yellow solid";
        cardResult.style.border = "2px yellow solid";
      }
      pastCard = DCcards[i];
    }
  }

  if (player == "collectVoid.html") {
    const userQuery = await userRef
          .where('name', '==', 'void')
          .get();
    
    const doc = userQuery.docs[0];
    let VOIDcards = doc.data().cards.sort();
    console.log(doc.data());
    
    for (let i = 0; i < VOIDcards.length; i++) {
      console.log(i);
      let cardResult = document.querySelector(".c" + i);
      cardResult.src = "img/" + VOIDcards[i] + ".png";
      cardResult.style.width = "110px";
      if (VOIDcards[i] == pastCard) {
        let lastCardResult = document.querySelector(".c" + (i - 1));
        lastCardResult.style.border = "2px yellow solid";
        cardResult.style.border = "2px yellow solid";
      }
      pastCard = VOIDcards[i];
    }
  }

  if (player == "collectZav.html") {
    const userQuery = await userRef
          .where('name', '==', 'zav')
          .get();
    
    const doc = userQuery.docs[0];
    let ZAVcards = doc.data().cards.sort();
    console.log(doc.data());
    
    for (let i = 0; i < ZAVcards.length; i++) {
      console.log(i);
      let cardResult = document.querySelector(".c" + i);
      cardResult.src = "img/" + ZAVcards[i] + ".png";
      cardResult.style.width = "110px";
      if (ZAVcards[i] == pastCard) {
        let lastCardResult = document.querySelector(".c" + (i - 1));
        lastCardResult.style.border = "2px yellow solid";
        cardResult.style.border = "2px yellow solid";
      }
      pastCard = ZAVcards[i];
    }
  }

  if (player == "collectAll.html") {
    const userQuery = await userRef
          .get();
    
    let OWNEDcards = userQuery.docs[0].data().cards.concat(userQuery.docs[1].data().cards, userQuery.docs[2].data().cards, userQuery.docs[3].data().cards).sort();
    console.log('owned');
    
    for (let i = 0; i < OWNEDcards.length; i++) {
      console.log(i);
      let cardResult = document.querySelector(".c" + i);
      cardResult.src = "img/" + OWNEDcards[i] + ".png";
      cardResult.style.width = "110px";
      if (FULLdupes[FULLcards.indexOf(OWNEDcards[i])] >= 2) {
        if (U.includes(OWNEDcards[i]) && FULLdupes[FULLcards.indexOf(OWNEDcards[i])] >= 8) {
          cardResult.style.border = "2px darkorange solid";
          if (FULLdupes[FULLcards.indexOf(OWNEDcards[i])] >= 8 + 1) {
            cardResult.style.border = "2px purple solid";
          }
        }
        else if (R.includes(OWNEDcards[i]) && FULLdupes[FULLcards.indexOf(OWNEDcards[i])] >= 5) {
          cardResult.style.border = "2px darkorange solid";
          if (FULLdupes[FULLcards.indexOf(OWNEDcards[i])] >= 5 + 1) {
            cardResult.style.border = "2px purple solid";
          }
        }
        else if (E.includes(OWNEDcards[i]) && FULLdupes[FULLcards.indexOf(OWNEDcards[i])] >= 3) {
          cardResult.style.border = "2px darkorange solid";
          if (FULLdupes[FULLcards.indexOf(OWNEDcards[i])] >= 3 + 1) {
            cardResult.style.border = "2px purple solid";
          }
        }
        else if (L.includes(OWNEDcards[i]) && FULLdupes[FULLcards.indexOf(OWNEDcards[i])] >= 1) {
          cardResult.style.border = "2px darkorange solid";
          if (FULLdupes[FULLcards.indexOf(OWNEDcards[i])] >= 2 + 1) {
            cardResult.style.border = "2px purple solid";
          }
        }
        else if ((ListF1.includes(OWNEDcards[i]) || ListF2.includes(OWNEDcards[i])) && FULLdupes[FULLcards.indexOf(OWNEDcards[i])] >= 1) {
          cardResult.style.border = "2px darkorange solid";
          if (FULLdupes[FULLcards.indexOf(OWNEDcards[i])] >= 1 + 1) {
            cardResult.style.border = "2px purple solid";
          }
        }
        else if (M.includes(OWNEDcards[i]) && FULLdupes[FULLcards.indexOf(OWNEDcards[i])] >= 1) {
          cardResult.style.border = "2px darkorange solid";
          if (FULLdupes[FULLcards.indexOf(OWNEDcards[i])] >= 1 + 1) {
            cardResult.style.border = "2px purple solid";
          }
        }
        else if (P.includes(OWNEDcards[i]) && FULLdupes[FULLcards.indexOf(OWNEDcards[i])] >= 1) {
          cardResult.style.border = "2px darkorange solid";
          if (FULLdupes[FULLcards.indexOf(OWNEDcards[i])] >= 1 + 1) {
            cardResult.style.border = "2px purple solid";
          }
        }
        else if (AllV.includes(OWNEDcards[i]) && FULLdupes[FULLcards.indexOf(OWNEDcards[i])] >= 1) {
          cardResult.style.border = "2px darkorange solid";
          if (FULLdupes[FULLcards.indexOf(OWNEDcards[i])] >= 2 + 1) {
            cardResult.style.border = "2px purple solid";
          }
        }
        else {
          cardResult.style.border = "2px yellow solid";
        }
      }
      pastCard = OWNEDcards[i];
    }

    let print = [];
    let wait = false;
    //UNCOMMON
    while (!wait) {
      let randNum = Math.floor(Math.random() * U.length);
      if (OWNEDcards.includes(U[randNum])) {
        print.push(U[randNum]);
        wait = true;
      }
    }
    wait = false;
    //RARE
    while (!wait) {
      let randNum = Math.floor(Math.random() * R.length);
      if (OWNEDcards.includes(R[randNum])) {
        print.push(R[randNum]);
        wait = true;
      }
    }
    wait = false;
    while (!wait) {
      let randNum = Math.floor(Math.random() * R.length);
      if (OWNEDcards.includes(R[randNum])) {
        print.push(R[randNum]);
        wait = true;
      }
    }
    wait = false;
    //EPIC
    while (!wait) {
      let randNum = Math.floor(Math.random() * E.length);
      if (OWNEDcards.includes(E[randNum])) {
        print.push(E[randNum]);
        wait = true;
      }
    }
    //VARIANT
    let randNum = Math.floor(Math.random() * V.length);
    print.push(V[randNum]);


    console.log(print);
  }

  if (player == "collectSets.html") {

    updateP();
  }

  if (player == "collectMission.html") {
    for (let i = 0; i < VARmiss.length - 1; i++) {
      console.log(i);
      let cardResult = document.querySelector(".card" + i);
      cardResult.src = "img/" + VARmiss[i] + ".png";
    }

    document.querySelector(".missionReward").src = "img/" + VARmiss[VARmiss.length - 1] + ".png";
  }
}

async function updateP() {
  let compareCards;
  let filledCards;
  let listName = document.querySelector(".players");
  const userRef = db.collection('users');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  if (listName.value == "gem") {
    const userQuery = await userRef
          .where('name', '==', 'gem')
          .get();
    
    const doc = userQuery.docs[0];
    compareCards = doc.data().cards.sort();

    filledCards = OWNEDcards.concat(inDeck);
  }
  if (listName.value == "dc") {
    const userQuery = await userRef
          .where('name', '==', 'dc')
          .get();
    
    const doc = userQuery.docs[0];
    compareCards = doc.data().cards.sort();
    
    filledCards = OWNEDcards.concat(inDeck);
  }
  if (listName.value == "void") {
    const userQuery = await userRef
          .where('name', '==', 'void')
          .get();
    
    const doc = userQuery.docs[0];
    compareCards = doc.data().cards.sort();
    
    filledCards = OWNEDcards.concat(inDeck);
  }
  if (listName.value == "zav") {
    const userQuery = await userRef
          .where('name', '==', 'zav')
          .get();
    
    const doc = userQuery.docs[0];
    compareCards = doc.data().cards.sort();
    
    filledCards = OWNEDcards.concat(inDeck);
  }
  if (listName.value == "all") {
    compareCards = OWNEDcards;
    filledCards = inDeck;
  }

  console.log("HERE");

  for (let setList = 1; setList < allSets.length; setList++) {
    let setBox = document.querySelector(".s" + setList);
    setBox.style.backgroundColor = "blue";
    setBox.style.border = "4px darkblue solid";
    let setCards = allSets[setList];
    console.log(setCards);

    for (let i = 0; i < setCards.length; i++) {
      let cardResult = document.querySelector(".s" + setList + "c" + i);
      cardResult.style.border = "none";
      cardResult.style.opacity = "1";

      if (compareCards.includes(setCards[i])) {
        cardResult.src = "img/" + setCards[i] + ".png";
        cardResult.style.width = "110px";
      }
      else {
        if (filledCards.includes(setCards[i])) {
          cardResult.src = "img/" + setCards[i] + ".png";
          cardResult.style.border = "2px lightcyan solid";
          cardResult.style.opacity = "0.6";
        }
        else {
          cardResult.src = "Back.png";
        }
        cardResult.style.width = "110px";
      }
      if (setCards[i].includes("-A")) {
        let cardResult = document.querySelector(".s" + setList + "c" + i);
        cardResult.style.border = "2px red solid";
      }
      if (setCards[i].includes("-SA")) {
        let cardResult = document.querySelector(".s" + setList + "c" + i);
        cardResult.style.border = "2px black solid";
      }
    }
  }
}


async function select() {

  for (let i = 0; i < 99; i++) {
    let cardResult = document.querySelector(".c" + i);
    cardResult.src = "Pack.png";
    cardResult.style.width = "0px";
    cardResult.style.border = "0";
  }


  let LlistName = document.querySelector(".Lplayers").options[document.querySelector(".Lplayers").selectedIndex].value;
  let RlistName = document.querySelector(".Rplayers").options[document.querySelector(".Rplayers").selectedIndex].value;
  let Llist;
  let Rlist;
  const userRef = db.collection('users');

  console.log(LlistName);
  console.log(RlistName);

  const userQuery = await userRef
    .where('name', '==', LlistName)
    .get();
  const doc = userQuery.docs[0];
  Llist = doc.data().cards.sort();

  const userQuery2 = await userRef
    .where('name', '==', RlistName)
    .get();
  const doc2 = userQuery2.docs[0];
  Rlist = doc2.data().cards.sort();


  console.log(Llist + " " + Rlist);


  let noLdupes = [];
  let Ldupes = [];
  let prevCard = null;
  for (let i = 0; i < Llist.length; i++) {
    if (Llist[i] != prevCard) {
      noLdupes.push(Llist[i]);
    }
    else {
      Ldupes.push(Llist[i]);
    }
    prevCard = Llist[i];
  }

  console.log(noLdupes);

  let num = 0;
  for (let i = 0; i < noLdupes.length; i++) {
    if (!Rlist.includes(noLdupes[i])) {
      console.log("test");
      let cardResult = document.querySelector(".c" + num);
      cardResult.src = "img/" + noLdupes[i] + ".png";
      cardResult.style.width = "110px";
      if (Ldupes.includes(noLdupes[i])) {
        cardResult.style.border = "2px yellow solid";
      }
      num++;
    }
  }
}


async function selectTrade() {

  for (let i = 0; i < 99; i++) {
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




function enlarge(card) {
  console.log("enlarge" + card + "<-");
  let cardImg = document.querySelector("." + card);
  let hidePack = document.querySelector(".pack");
  hidePack.src = cardImg.src;
  hidePack.style.width = "300px";
  hidePack.style.marginTop = "25px";
  window.scrollTo(0, 0);
  let owners = document.querySelector(".owned");
  owners.style.color = "darkblue";
  owners.style.marginBottom = "0px";
  owners.innerHTML = "";

  let imgIndex = cardImg.src.indexOf("img/");
  let imgName;
  if (imgIndex !== -1) {
    imgName = cardImg.src.substring(imgIndex + 4, cardImg.src.indexOf(".png"));
    console.log(imgName);
  }

  console.log(cardImg.src);
  console.log(imgName);
  if (CHILLYcards.includes(imgName)) {
    owners.innerHTML += "Chilly, ";
  }
  if (DCcards.includes(imgName)) {
    owners.innerHTML += "DCMetro, ";
  }
  if (GEMcards.includes(imgName)) {
    owners.innerHTML += "DCGem, ";
  }
  if (VOIDcards.includes(imgName)) {
    owners.innerHTML += "VoidMax, ";
  }
  if (ZAVcards.includes(imgName)) {
    owners.innerHTML += "Zaveeya, ";
  }
  console.log("hi");
  owners.innerHTML = owners.innerHTML.substring(0, owners.innerHTML.length - 2);
}

function hide() {
  console.log("hide");
  let hidePack = document.querySelector(".pack");
  hidePack.src = "Pack.png";
  hidePack.style.width = "0px";
  hidePack.style.marginTop = "0px";
  let owners = document.querySelector(".owned");
  owners.style.color = "#00CCEE";
  owners.innerHTML = "";
}


// ---------- OPENING PACKS FUNCTION ----------

let packSize = 6;
let num = 0;
let pack = [];
let code = "";

function openPack(packNum) {

  let cardPic = document.querySelector(".pack");
  if (num != 0) {
    cardPic.style.width = "300px";
    cardPic.addEventListener("click", flipCard(cardPic, pack));
    return;
  }

  let packOptions = document.querySelector(".pack-options");
  packOptions.style.display = "none";
  let pageTitle = document.querySelector(".pageTitle");
  pageTitle.style.display = "none";

  let inPack = 0;

  //MEGA
  if (inPack < packSize && Math.floor(Math.random() * 8) + 1 == 1) {
    let randCard;
    let backUp = 0;
    let cleared = true;
    while (cleared && backUp <= 100) {
      randCard = M[Math.floor(Math.random() * (M.length))];
      if (FULLdupes[FULLcards.indexOf(randCard)] < 1) {
        cleared = false;
      }
      backUp++;
    }
    if (backUp <= 99) {
      pack.push(randCard + ".png");
      inPack++;
    }
    console.log(randCard);
  }

  //FIGURE
  if (inPack < packSize && Math.floor(Math.random() * 14) + 1 == 1) {
    let randCard;
    let backUp = 0;
    let cleared = true;
    while (cleared && backUp <= 100) {
      randCard = F[Math.floor(Math.random() * (F.length))];
      if (FULLdupes[FULLcards.indexOf(randCard)] < 1) {
        cleared = false;
      }
      backUp++;
    }
    if (backUp <= 99) {
      pack.push(randCard + ".png");
      inPack++;
    }
    console.log(randCard);
  }

  //SPECIAL
  if (inPack < packSize && Math.floor(Math.random() * 12) + 1 == 1) {
    console.log("SPECIAL");
    let randCard;
    let backUp = 0;
    let cleared = true;
    while (cleared && backUp <= 100) {
      randCard = SP[Math.floor(Math.random() * (SP.length))];
      if (FULLdupes[FULLcards.indexOf(randCard)] < 1) {
        cleared = false;
        console.log("Got Special");
      }
      backUp++;
    }
    if (backUp <= 99) {
      pack.push(randCard + ".png");
      inPack++;
    }
    console.log(randCard);
  }

  //VARIANT
  for (let i = 0; i < packSize; i++) {
    if (inPack < packSize && Math.floor(Math.random() * 10) + 1 == 1) {
      let randCard;
      let backUp = 0;
      let cleared = true;
      while (cleared && backUp <= 100) {
        randCard = V[Math.floor(Math.random() * (V.length))];
        if (FULLdupes[FULLcards.indexOf(randCard)] < 2) {
          cleared = false;
        }
        backUp++;
      }
      if (backUp <= 99) {
        pack.push(randCard + ".png");
        inPack++;
      }
      console.log(randCard);
    }
  }

  //LEGENDARY
  if (inPack < packSize && Math.floor(Math.random() * 12) + 1 == 1) {
    let randCard;
    let backUp = 0;
    let cleared = true;
    while (cleared && backUp <= 100) {
      randCard = L[Math.floor(Math.random() * (L.length))];
      if (FULLdupes[FULLcards.indexOf(randCard)] < 1) {
        cleared = false;
      }
      backUp++;
    }
    if (backUp <= 99) {
      pack.push(randCard + ".png");
      inPack++;
    }
    console.log(randCard);
  }

  //EPIC
  for (let i = 0; i < packSize; i++) {
    if (inPack < packSize && Math.floor(Math.random() * 20) + 1 == 1) {
      let randCard;
      let backUp = 0;
      let cleared = true;
      while (cleared && backUp <= 100) {
        randCard = E[Math.floor(Math.random() * (E.length))];
        if (FULLdupes[FULLcards.indexOf(randCard)] < 3) {
          cleared = false;
        }
        backUp++;
      }
      if (backUp <= 99) {
        pack.push(randCard + ".png");
        inPack++;
      }
      console.log(randCard);
    }
  }

  //RARE
  for (let i = 0; i < packSize; i++) {
    if (inPack < packSize && Math.floor(Math.random() * 7) + 1 == 1) {
      let randCard;
      let backUp = 0;
      let cleared = true;
      while (cleared && backUp <= 100) {
        randCard = R[Math.floor(Math.random() * (R.length))];
        if (FULLdupes[FULLcards.indexOf(randCard)] < 5) {
          cleared = false;
        }
        backUp++;
      }
      if (backUp <= 99) {
        pack.push(randCard + ".png");
        inPack++;
      }
      console.log(randCard);
    }
  }

  //UNCOMMON
  for (let i = 0; i < packSize; i++) {
    if (inPack < packSize && Math.floor(Math.random() * 3) + 1 == 1) {
      let randCard;
      let backUp = 0;
      let cleared = true;
      while (cleared && backUp <= 100) {
        randCard = U[Math.floor(Math.random() * (U.length))];
        if (FULLdupes[FULLcards.indexOf(randCard)] < 8) {
          cleared = false;
        }
        backUp++;
      }
      if (backUp <= 99) {
        pack.push(randCard + ".png");
        inPack++;
      }
      console.log(randCard);
    }
  }

  //COMMON
  for (let i = inPack; i < packSize; i++) {
    pack.push(C[Math.floor(Math.random() * (C.length))] + ".png");
  }


  //pack.push("R-" + (Math.floor(Math.random() * 6) + 1) + ".png");


  shuffle(pack);
  console.log(pack);

  cardPic.style.width = "300px";
  cardPic.addEventListener("click", flipCard(cardPic, pack));
}

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

async function results(pack) {
  console.log(pack);
  let resultBack = document.querySelector(".resultList");
  resultBack.style.display = "flex";

  let resTitle = document.querySelector(".resultTitle");
  resTitle.style.display = "block";

  const userRef = db.collection('users');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userQuery = await userRef
        .where('name', '==', currentUser.username.toLowerCase())
        .get();

  const doc = userQuery.docs[0];
  let currentCards = doc.data().cards;
  let newCards = currentCards;
  console.log(doc.data());

  
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

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

function enlargePack(card) {
  console.log("enlargePack");
  let cardImg = document.querySelector("." + card);
  let hidePack = document.querySelector(".pack");
  hidePack.src = cardImg.src;
  hidePack.style.width = "300px";
  hidePack.style.marginTop = "25px";
  hidePack.style.marginBottom = "50px";
}

function hidePack() {
  console.log("hidePack");
  let hidePack = document.querySelector(".pack");
  hidePack.src = "Pack.png";
  hidePack.style.width = "0px";
  hidePack.style.marginTop = "0px";
  hidePack.style.marginBottom = "0px";
}

function showPack(){
  packSize = 6;
  
  let codeTitle = document.querySelector(".codeTitle");
  codeTitle.innerHTML = "";

  let cardPic = document.querySelector(".pack");
  cardPic.style.width = "300px";
}

// let C = ["1-1","1-2" ,"2-1","2-2" ,"3-1","3-2" ,"4-1","4-2" ,"5-1","5-2" ,"6-1","6-2" ,"7-1","7-2","7-3" ];
// let U = ["1-3","1-4" ,"2-3"       ,"3-3","3-4" ,"4-3","4-4" ,"5-3","5-4" ,"6-3","6-4" ,"7-4","7-5"       ];
// let R = ["1-5","1-6" ,"2-4"       ,"3-5"       ,"4-5"       ,"5-5"       ,"6-5"       ,"7-6","7-7"       ];
// let E = ["1-7"       ,"2-5"       ,"3-6"       ,"4-6"       ,"5-6"       ,"6-6"       ,"7-8"             ];
// let L = ["1-8"       ,"2-6"       ,"3-7"       ,"4-7"       ,"5-7"       ,"6-7"       ,"7-9"             ];
// let V = ["V1-1","V1-2","V1-3","V1-4","V1-5","V1-6","V1-7","V1-8"];
// let F = ["F1-1","F1-2","F1-3","F1-4","F1-5","F1-6","F1-7","F1-8","F1-9","F1-10"];

