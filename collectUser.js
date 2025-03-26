//USER'S COLLECTION FUNCTIONS


//Loads in Cards to List from User's Collection
async function loadCards() {
  const userRef = db.collection('users');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  let prevCard = "";
  let userCards = [];

  let colList = document.querySelector('.collectionList');
  let userList = colList.id;
  if(userList!=="all" && userList!=="sets"){
    console.log(userList);
    const userQuery = await userRef
          .where('name', '==', userList)
          .get();
    const doc = userQuery.docs[0];
    userCards = doc.data().cards;
    
    let sortType = document.querySelector(".sortSelect");
    if(sortType.value=="num"){
      userCards=userCards.sort();
    } else if(sortType.value=="numRev"){
      userCards=userCards.sort();
      userCards=userCards.reverse();
    } else if(sortType.value=="rec"){
      userCards=userCards.reverse();
    } else if(sortType.value=="rar"){
      userCards=sortByLastDigit(userCards.sort());
    } else if(sortType.value!=="old"){
      userCards=userCards.sort();
    }
    
  } else{
    const userQuery = await userRef.get();
    userCards = userQuery.docs[0].data().cards.concat(
      userQuery.docs[1].data().cards, 
      userQuery.docs[2].data().cards, 
      userQuery.docs[3].data().cards,
      userQuery.docs[4].data().cards, 
      userQuery.docs[5].data().cards).sort();
  }
  
  if(userList=="sets"){
    colList.style.display = "none";
    loadSets(userCards);
    return;
  }
  console.log(userCards);
  let storeCards = userCards.slice();
  
  for (let i = 0; i < userCards.length; i++) {
    console.log(i);
    let cardResult = document.querySelector(".c" + i);
    cardResult.src = "img/" + userCards[i] + ".png";
    cardResult.style.width = "110px";
    cardResult.style.border = "none";
    if (userCards[i] == prevCard) {
      let prevCardResult = document.querySelector(".c" + (i - 1));
      prevCardResult.style.border = "2px yellow solid";
      cardResult.style.border = "2px yellow solid";
    } else {
      let curStr = storeCards.splice(i, 1);
      if (storeCards.includes(curStr[0])) {
        console.log(curStr[0]);
        cardResult.style.border = "2px yellow solid";
      }
      storeCards.splice(i, 0, curStr[0]);
    }
    prevCard = userCards[i];
  }
}
loadCards();

//Loads All Sets if That Collect Sets Page is Opened
async function loadSets(allCards) {
  let compareCards;
  let filledCards;
  let listName = document.querySelector(".players");
  const userRef = db.collection('users');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  if (listName.value == "all") {
    compareCards = allCards;
    filledCards = allCards;
  } else {
    const userQuery = await userRef
          .where('name', '==', listName.value)
          .get();
    
    const doc = userQuery.docs[0];
    compareCards = doc.data().cards.sort();
    filledCards = allCards;
  }

  console.log("HERE");

  for (let setList = 1; setList < allSets.length; setList++) {
    let setBox = document.querySelector(".s" + setList);
    setBox.style.display = "flex";
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
      if (setCards[i].includes("-P")) {
        let cardResult = document.querySelector(".s" + setList + "c" + i);
        cardResult.style.border = "2px blue solid";
      }
    }
  }
}

//Enlarges Card
function enlarge(card) {
  console.log("enlarge" + card + "<-");
  let cardImg = document.querySelector("." + card);
  let showEnlarge = document.querySelector(".large");
  showEnlarge.src = cardImg.src;
  showEnlarge.style.display = "block";
  window.scrollTo(0, 0);
}

//Hides the Enlarged Card
function hide() {
  console.log("hide");
  let hideEnlarge = document.querySelector(".large");
  hideEnlarge.src = "Pack.png";
  hideEnlarge.style.display = "none";
}

//Clicker Button
async function clicked() {
  const userRef = db.collection('users');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  console.log(currentUser);
  const userQuery = await userRef
        .where('name', '==', currentUser.username)
        .get();
  const doc = userQuery.docs[0];
  
  let time = new Date(doc.data().clickTime);
  let now = new Date();
  time.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  console.log(now.getTime());
  if (!(now - time >= 86400000)) { // 86400000 ms = 1 day
    window.alert("You have already earned your Clicker Pack Token today!");
    return;
  }
  
  if(Math.floor(Math.random() * 1000) + 1 == 1){
    console.log("+1 Token");
    let newTokens = doc.data().tokens +1;
    await doc.ref.update({
      clickTime: now.getTime(),
      tokens: newTokens
    });
    window.alert("YOU EARNED 1 PACK TOKEN!");
    location.reload();
  } else {
    let click = document.querySelector(".clicker");
    click.style.backgroundColor=getRandomColor();
  }
}

//Generates Random Color for Clicker Button
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

//Sorts array of cards by last digit
function sortByLastDigit(arr) {
    return arr.sort((a, b) => {
        const lastCharA = a.slice(-1);
        const lastCharB = b.slice(-1);
        const lastDigitA = isNaN(lastCharA) ? 20 : parseInt(lastCharA, 10);
        const lastDigitB = isNaN(lastCharB) ? 20 : parseInt(lastCharB, 10);
        return lastDigitA - lastDigitB;
    });
}

