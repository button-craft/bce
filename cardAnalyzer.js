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
    
    // Log the card arrays to check their content
    console.log("Uncommon cards:", U.length);
    console.log("Rare cards:", R.length);
    console.log("Epic cards:", E.length);
    console.log("Legendary cards:", L.length);
    console.log("V3 cards:", V3.length);
    console.log("S3+S4 cards:", S3.concat(S4).length);
    
    processCardGroup(U, 'U', Urarity, Ucount, allCards);
    processCardGroup(R, 'R', Rrarity, Rcount, allCards);
    processCardGroup(E, 'E', Erarity, Ecount, allCards);
    processCardGroup(L, 'L', Lrarity, Lcount, allCards);
    processCardGroup(V3, 'V', Vrarity, Vcount, allCards);
    processCardGroup(S3.concat(S4), 'S', Srarity, Scount, allCards);
    
    console.log("Cards processed:", cardDataArray.length);
    console.log("Cards by rarity:", 
                "U:", cardDataArray.filter(c => c.rarity === 'U').length,
                "R:", cardDataArray.filter(c => c.rarity === 'R').length,
                "E:", cardDataArray.filter(c => c.rarity === 'E').length,
                "L:", cardDataArray.filter(c => c.rarity === 'L').length,
                "V:", cardDataArray.filter(c => c.rarity === 'V').length,
                "S:", cardDataArray.filter(c => c.rarity === 'S').length);
    
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
    
    // Include cards even if availability is 0, but add a flag
    const pullChance = (availability > 0) ? (1/rarityOdds) * (availability/maxCount) : 0;
    const pullOdds = (pullChance > 0) ? Math.round(1/pullChance) : Infinity;
    
    cardDataArray.push({
      id: card,
      rarity: rarityLabel,
      originalOdds: rarityOdds,
      currentCount: cardCount,
      maxCount: maxCount,
      availability: availability,
      pullChance: pullChance,
      pullOdds: pullOdds,
      available: availability > 0
    });
  });
}

function displayCards() {
  sortCardData();
  
  const cardListElement = document.getElementById('cardList');
  cardListElement.innerHTML = '';
  
  // Count cards by rarity being displayed
  let displayedCards = {U: 0, R: 0, E: 0, L: 0, V: 0, S: 0};
  
  cardDataArray.forEach(card => {
    // Skip cards with zero availability only when in "easiest" mode
    if (sortMethod === "easiest" && card.availability === 0) {
      return;
    }
    
    // Count cards by rarity being displayed
    displayedCards[card.rarity]++;
    
    const row = document.createElement('tr');
    
    const imageCell = document.createElement('td');
    const image = document.createElement('img');
    image.src = `img/${card.id}.png`;
    image.classList.add('card-image');
    image.onclick = function() { enlarge(card.id); };
    
    // Apply grayscale to cards with 0 availability
    if (card.availability === 0) {
      image.style.filter = "grayscale(100%)";
      image.style.opacity = "0.6";
    }
    
    imageCell.appendChild(image);
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
    }
    
    progressBar.appendChild(progress);
    availCell.appendChild(progressBar);
    row.appendChild(availCell);
    
    const difficultyCell = document.createElement('td');
    difficultyCell.textContent = card.availability > 0 ? `1 in ${card.pullOdds}` : "N/A";
    row.appendChild(difficultyCell);
    
    cardListElement.appendChild(row);
  });
  
  console.log("Cards displayed by rarity:", displayedCards);
}

function sortCardData() {
  const sortSelect = document.querySelector('.sortSelect');
  sortMethod = sortSelect.value;
  
  switch(sortMethod) {
    case "easiest":
      cardDataArray.sort((a, b) => b.pullChance - a.pullChance);
      break;
    case "hardest":
      cardDataArray.sort((a, b) => {
        // For hardest, show cards with 0 availability at the end
        if (a.availability === 0 && b.availability > 0) return 1;
        if (b.availability === 0 && a.availability > 0) return -1;
        return a.pullChance - b.pullChance;
      });
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
