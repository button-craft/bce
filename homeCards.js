let cardDataArray = [];
let sortMethod = "easiest";
let availableCardCounts = {}; // To track count of different available cards per rarity

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
    availableCardCounts = { 'U': 0, 'R': 0, 'E': 0, 'L': 0, 'V': 0, 'S': 0 };
    
    // First pass: count distinct available cards per rarity
    countAvailableCards(U, 'U', Ucount, allCards);
    countAvailableCards(R, 'R', Rcount, allCards);
    countAvailableCards(E, 'E', Ecount, allCards);
    countAvailableCards(L, 'L', Lcount, allCards);
    countAvailableCards(VarSet, 'V', Vcount, allCards);
    countAvailableCards(SpeSet, 'S', Scount, allCards);
    
    // Second pass: process cards with proper formula
    processCardGroup(U, 'U', Urarity, Ucount, allCards);
    processCardGroup(R, 'R', Rrarity, Rcount, allCards);
    processCardGroup(E, 'E', Erarity, Ecount, allCards);
    processCardGroup(L, 'L', Lrarity, Lcount, allCards);
    processCardGroup(VarSet, 'V', Vrarity, Vcount, allCards);
    processCardGroup(SpeSet, 'S', Srarity, Scount, allCards);
    
    console.log("Cards processed:", cardDataArray.length);
    
  } catch (error) {
    console.error("Error loading card data:", error);
  }
}

// Count distinct available cards per rarity
function countAvailableCards(cardGroup, rarityLabel, maxCount, allCards) {
  cardGroup.forEach(card => {
    
    const cardCount = countCards(allCards, card);
    const availability = Math.max(0, maxCount - cardCount);
    
    // If the card is available, increment the counter
    if (availability > 0) {
      availableCardCounts[rarityLabel]++;
    }
  });
}

function processCardGroup(cardGroup, rarityLabel, rarityOdds, maxCount, allCards) {
  cardGroup.forEach(card => {

    const cardCount = countCards(allCards, card);
    const availability = Math.max(0, maxCount - cardCount);
    
    // Apply the corrected formula:
    // 1/(rarity chance) * 1/(# of different types of cards within that rarity available)
    let pullChance = 0;
    if (availability > 0 && availableCardCounts[rarityLabel] > 0) {
      pullChance = (1/rarityOdds) * (1/availableCardCounts[rarityLabel]);
    }
    
    cardDataArray.push({
      id: card,
      rarity: rarityLabel,
      rarityName: getRarityName(rarityLabel),
      originalOdds: rarityOdds,
      currentCount: cardCount,
      maxCount: maxCount,
      availability: availability,
      pullChance: pullChance,
      isOwned: cardCount > 0
    });
  });
}

async function displayCards() {
  sortCardData();

  const userRef = db.collection('users');
  const allQuery = await userRef.get();
  let allCards = allQuery.docs[0].data().cards.concat(
    allQuery.docs[1].data().cards, 
    allQuery.docs[2].data().cards, 
    allQuery.docs[3].data().cards,
    allQuery.docs[4].data().cards, 
    allQuery.docs[5].data().cards);
  
  const cardListElement = document.getElementById('cardList');
  cardListElement.innerHTML = '';
  
  // Add a header row
  const headerRow = document.createElement('tr');
  const headerCell = document.createElement('td');
  headerCell.colSpan = 3;
  headerCell.style.backgroundColor = "#242c37ff";
  headerCell.style.textAlign = "center";
  headerCell.innerHTML = `<strong>Showing all ${cardDataArray.length} cards sorted by ${sortMethod === "easiest" ? "easiest" : "hardest"} to pull</strong>`;
  headerRow.appendChild(headerCell);
  cardListElement.appendChild(headerRow);
  
  // Display message if no cards found
  if (cardDataArray.length === 0) {
    const noCardsRow = document.createElement('tr');
    const noCardsCell = document.createElement('td');
    noCardsCell.colSpan = 3;
    noCardsCell.innerHTML = '<strong>No cards found to display</strong>';
    noCardsCell.style.padding = '20px';
    noCardsRow.appendChild(noCardsCell);
    cardListElement.appendChild(noCardsRow);
    return;
  }
  
  // Assign proper ranks handling ties
  let currentRank = 1;
  let previousPullChance = null;
  let skipCount = 0;
  
  // First pass to assign ranks
  cardDataArray.forEach((card, index) => {
    if (index > 0) {
      if (card.pullChance !== previousPullChance) {
        // New rank
        currentRank += skipCount + 1;
        skipCount = 0;
      } else {
        // Same rank
        skipCount++;
      }
    }
    card.rank = currentRank;
    previousPullChance = card.pullChance;
  });
  
  // Display all cards
  cardDataArray.forEach(card => {
    const row = document.createElement('tr');
    
    const imageCell = document.createElement('td');
    const image = document.createElement('img');

    let parts = card.id.split('-');
    let PawardCard = parts[0] + '-P';
    
    // Check if the card is owned by anyone
    if (card.isOwned || allCards.includes(PawardCard)) {
      image.src = `img/${card.id}.png`;
    } else {
      image.src = "Back.png"; // Anonymous placeholder
    }
    
    image.classList.add('card-image');
    image.onclick = function() { 
      if (card.isOwned || allCards.includes(PawardCard)) {
        enlarge(card.id);
      }
    };
    
    const cardText = document.createElement('div');
    cardText.style.fontSize = "12px";
    cardText.style.marginTop = "5px";
    
    if (card.isOwned || allCards.includes(PawardCard)) {
      cardText.innerHTML = `<strong>${card.id}</strong><br>${card.rarityName}`;
    } else {
      cardText.innerHTML = `<strong>Anonymous</strong><br>${card.rarityName}`;
    }
    
    // Apply grayscale to cards with 0 availability
    if (card.availability === 0) {
      image.style.filter = "grayscale(100%)";
      image.style.opacity = "0.6";
    }
    
    imageCell.appendChild(image);
    imageCell.appendChild(cardText);
    row.appendChild(imageCell);
    
    const availCell = document.createElement('td');
    const progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar');
    
    const progress = document.createElement('div');
    progress.classList.add('progress');
    
    // Different style for unavailable cards
    if (card.availability === 0) {
      progress.style.backgroundColor = "#777";
      progress.style.width = "100%";
      progress.textContent = "Unavailable";
    } else {
      const percentage = (card.availability / card.maxCount) * 100;
      progress.style.width = `${percentage}%`;
      progress.textContent = `${card.availability}/${card.maxCount}`;
      
      // Color gradient from red (low availability) to green (high availability)
      const hue = (percentage / 100) * 120; // 0 is red, 120 is green
      progress.style.backgroundColor = `hsl(${hue}, 80%, 45%)`;
    }
    
    progressBar.appendChild(progress);
    availCell.appendChild(progressBar);
    row.appendChild(availCell);
    
    const rankCell = document.createElement('td');
    const rankText = `RANK #${card.rank}`;
    rankCell.innerHTML = `<strong>${rankText}</strong>`;
    
    // Make the rank more prominent
    rankCell.style.fontSize = "16px";
    rankCell.style.fontWeight = "bold";
    rankCell.style.textAlign = "center";
    
    row.appendChild(rankCell);
    
    cardListElement.appendChild(row);
  });
}

function sortCardData() {
  const sortSelect = document.querySelector('.sortSelect');
  sortMethod = sortSelect.value;
  
  switch(sortMethod) {
    case "easiest":
      // First sort by availability (0 or not)
      cardDataArray.sort((a, b) => {
        // First sort by availability
        if (a.availability === 0 && b.availability > 0) return 1;
        if (b.availability === 0 && a.availability > 0) return -1;
        
        // Then by pull chance (higher is easier)
        return b.pullChance - a.pullChance;
      });
      break;
      
    case "hardest":
      // First sort by availability (0 or not)
      cardDataArray.sort((a, b) => {
        // First sort by availability
        if (a.availability === 0 && b.availability > 0) return 1;
        if (b.availability === 0 && a.availability > 0) return -1;
        
        // Then by pull chance (lower is harder)
        return a.pullChance - b.pullChance;
      });
      break;
  }
}

function sortCards() {
  displayCards();
}

function getRarityName(rarityCode) {
  switch(rarityCode) {
    case 'L': return 'Legendary';
    case 'E': return 'Epic';
    case 'R': return 'Rare';
    case 'U': return 'Uncommon';
    case 'V': return 'Variant';
    case 'S': return 'Special';
    default: return rarityCode;
  }
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
