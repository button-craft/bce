let cardDataArray = [];
let sortMethod = "easiest";

async function initPage() {
  await loadCardData();
  displayCards();
}

async function loadCardData() {
  try {
    const userRef = db.collection('users');
    const allQuery = await userRef.get();
    let allCards = allQuery.docs[0].data().cards.concat(
      allQuery.docs[1].data().cards, 
      allQuery.docs[2].data().cards, 
      allQuery.docs[3].data().cards,
      allQuery.docs[4].data().cards, 
      allQuery.docs[5].data().cards);
    
    cardDataArray = [];
    
    processCardGroup(U, 'U', Urarity, Ucount, allCards);
    processCardGroup(R, 'R', Rrarity, Rcount, allCards);
    processCardGroup(E, 'E', Erarity, Ecount, allCards);
    processCardGroup(L, 'L', Lrarity, Lcount, allCards);
    processCardGroup(V3, 'V', Vrarity, Vcount, allCards);
    processCardGroup(S3.concat(S4), 'S', Srarity, Scount, allCards);
    
  } catch (error) {
    console.error("Error loading card data:", error);
  }
}

function processCardGroup(cardGroup, rarityLabel, rarityOdds, maxCount, allCards) {
  cardGroup.forEach(card => {
    if (card.startsWith('S1-') || card.startsWith('S2-') || 
        card.startsWith('V1-') || card.startsWith('V2-')) {
      return;
    }
    
    const cardCount = countCards(allCards, card);
    const availability = Math.max(0, maxCount - cardCount);
    
    if (availability > 0) {
      // Calculate true pull chance: (1/rarityOdds) * (availability/maxCount)
      // Higher value = easier to pull
      const pullChance = (1/rarityOdds) * (availability/maxCount);
      
      // For display, show odds as 1 in X
      const pullOdds = Math.round(1/pullChance);
      
      cardDataArray.push({
        id: card,
        rarity: rarityLabel,
        originalOdds: rarityOdds,
        currentCount: cardCount,
        maxCount: maxCount,
        availability: availability,
        pullChance: pullChance,
        pullOdds: pullOdds
      });
    }
  });
}

function displayCards() {
  sortCardData();
  
  const cardListElement = document.getElementById('cardList');
  cardListElement.innerHTML = '';
  
  cardDataArray.forEach(card => {
    const row = document.createElement('tr');
    
    const imageCell = document.createElement('td');
    const image = document.createElement('img');
    image.src = `img/${card.id}.png`;
    image.classList.add('card-image');
    image.onclick = function() { enlarge(card.id); };
    imageCell.appendChild(image);
    row.appendChild(imageCell);
    
    const availCell = document.createElement('td');
    const progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar');
    
    const progress = document.createElement('div');
    progress.classList.add('progress');
    const percentage = (card.availability / card.maxCount) * 100;
    progress.style.width = `${percentage}%`;
    progress.textContent = `${card.availability}/${card.maxCount}`;
    
    progressBar.appendChild(progress);
    availCell.appendChild(progressBar);
    row.appendChild(availCell);
    
    const difficultyCell = document.createElement('td');
    difficultyCell.textContent = `1 in ${card.pullOdds}`;
    row.appendChild(difficultyCell);
    
    cardListElement.appendChild(row);
  });
}

function sortCardData() {
  const sortSelect = document.querySelector('.sortSelect');
  sortMethod = sortSelect.value;
  
  switch(sortMethod) {
    case "easiest":
      cardDataArray.sort((a, b) => b.pullChance - a.pullChance); // Higher pullChance = easier
      break;
    case "hardest":
      cardDataArray.sort((a, b) => a.pullChance - b.pullChance); // Lower pullChance = harder
      break;
  }
}

function sortCards() {
  displayCards();
}

function countCards(cards, cardId) {
  return cards.filter(card => card === cardId).length;
}

function enlarge(cardId) {
  let showEnlarge = document.querySelector(".large");
  showEnlarge.src = `img/${cardId}.png`;
  showEnlarge.style.display = "block";
  window.scrollTo(0, 0);
}

function hide() {
  let hideEnlarge = document.querySelector(".large");
  hideEnlarge.src = "Pack.png";
  hideEnlarge.style.display = "none";
}

window.onload = initPage;
