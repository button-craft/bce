async function loadCards() {
  const userRef = db.collection('users');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  let prevCard = "";
  let userCards = [];

  let colList = document.querySelector('.collectionList');
  let userList = colList.id;
  if(userList=="all"){
    awardChecker();
  }
  if(userList!=="all" && userList!=="sets" && userList!=="mission"){
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
    
  } else if(userList=="mission"){
    const missRef = db.collection('mission');
    const missQuery = await missRef.get();
    userCards = missQuery.docs[0].data().cards;
    console.log(userCards);
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
  
  // Clear existing cards
  colList.innerHTML = '';
  
  // Dynamically generate card elements for all cards
  for (let i = 0; i < userCards.length; i++) {
    // Create new list item and image for each card
    const listItem = document.createElement('li');
    const image = document.createElement('img');
    
    // Set image properties
    image.className = `c${i}`;
    image.src = "img/" + userCards[i] + ".png";
    image.style.width = "110px";
    image.style.border = "none";
    image.setAttribute('onClick', `enlarge('c${i}')`);
    
    // Check for duplicate cards
    if (userCards[i] == prevCard) {
      let prevCardResult = document.querySelector(`.c${i - 1}`);
      if (prevCardResult) {
        prevCardResult.style.border = "2px yellow solid";
      }
      image.style.border = "2px yellow solid";
    } else {
      let curStr = storeCards.splice(i, 1);
      if (storeCards.includes(curStr[0])) {
        console.log(curStr[0]);
        image.style.border = "2px yellow solid";
      }
      storeCards.splice(i, 0, curStr[0]);
    }
    
    // Add image to list item
    listItem.appendChild(image);
    
    // Add list item to collection list
    colList.appendChild(listItem);
    
    prevCard = userCards[i];
  }
  
  // Update or create the card count display
  let countDisplay = document.getElementById('cardCount');
  if (!countDisplay) {
    countDisplay = document.createElement('div');
    countDisplay.id = 'cardCount';
    countDisplay.style.textAlign = 'center';
    countDisplay.style.color = 'darkblue';
    countDisplay.style.marginTop = '10px';
    countDisplay.style.fontWeight = 'bold';
    
    // Insert count after the collection list
    colList.parentNode.insertBefore(countDisplay, colList.nextSibling);
  }
  
  // Update the count text
  countDisplay.textContent = `Total Cards: ${userCards.length}`;
}

// Call loadCards on page load to automatically sort by "order"
window.onload = function() {
  // Set default sort to "num" (order)
  const sortSelect = document.querySelector(".sortSelect");
  if (sortSelect) {
    sortSelect.value = "num";
  }
  
  // First load the user info (from header.js)
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) {
    // If no user is logged in, redirect to login page
    window.location.href = 'index.html';
    return;
  }

  // Then load cards
  loadCards();
  
  // Also check trades (from header.js)
  checkTrades();
};
