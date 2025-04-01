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
    processCardGroup(V1.concat(V2, V3), 'V', Vrarity, Vcount, allCards);
    processCardGroup(S1.concat(S2, S3, S4), 'S', Srarity, Scount, allCards);
    
  } catch (error) {
    console.error("Error loading card data:", error);
  }
}

function processCardGroup(cardGroup, rarityLabel, rarityOdds, maxCount, allCards) {
  cardGroup.forEach(card => {
    const cardCount = countCards(allCards, card);
    const availability = Math.max(0, maxCount - cardCount);
    let pullChance = 0;
    if (availability > 0) {
      pullChance = (1 / rarityOdds) * 100;
    }
    
    if (availability > 0) {
      cardDataArray.push({
        id: card,
        rarity: rarityLabel,
        originalOdds: rarityOdds,
        currentCount: cardCount,
        maxCount: maxCount,
        availability: availability,
        pullChance: pullChance
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
    
    const idCell = document.createElement('td');
    idCell.textContent = card.id;
    row.appendChild(idCell);
    
    const imageCell = document.createElement('td');
    const image = document.createElement('img');
    image.src = `img/${card.id}.png`;
    image.classList.add('card-image');
    image.onclick = function() { enlarge(card.id); };
    imageCell.appendChild(image);
    row.appendChild(imageCell);
    
    const rarityCell = document.createElement('td');
    rarityCell.textContent = getRarityName(card.rarity);
    rarityCell.classList.add(`rarity-${card.rarity}`);
    row.appendChild(rarityCell);
    
    const oddsCell = document.createElement('td');
    oddsCell.textContent = `1/${card.originalOdds} (${(1/card.originalOdds*100).toFixed(2)}%)`;
    row.appendChild(oddsCell);
    
    const countCell = document.createElement('td');
    countCell.textContent = card.currentCount;
    row.appendChild(countCell);
    
    const maxCell = document.createElement('td');
    maxCell.textContent = card.maxCount;
    row.appendChild(maxCell);
    
    const availCell = document.createElement('td');
    const progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar');
    
    const progress = document.createElement('div');
    progress.classList.add('progress');
    const percentage = (card.availability / card.maxCount) * 100;
    progress.style.width = `${percentage}%`;
    progress.textContent = card.availability;
    
    progressBar.appendChild(progress);
    availCell.appendChild(progressBar);
    row.appendChild(availCell);
    
    const chanceCell = document.createElement('td');
    chanceCell.textContent = `${card.pullChance.toFixed(2)}%`;
    row.appendChild(chanceCell);
    
    cardListElement.appendChild(row);
  });
}

function sortCardData() {
  const sortSelect = document.querySelector('.sortSelect');
  sortMethod = sortSelect.value;
  
  switch(sortMethod) {
    case "easiest":
      cardDataArray.sort((a, b) => b.pullChance - a.pullChance);
      break;
    case "hardest":
      cardDataArray.sort((a, b) => a.pullChance - b.pullChance);
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
