// Player Statistics Processing

// Store player data
let playerStats = [];

// Initialize page when loaded
window.onload = async function() {
  // Load user info first (from header.js)
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) {
    window.location.href = 'index.html';
    return;
  }
  
  await loadPlayerStats();
  displayStats();
};

// Load stats for all players
async function loadPlayerStats() {
  try {
    const userRef = db.collection('users');
    const allQuery = await userRef.get();
    
    playerStats = [];
    
    // Process each player
    allQuery.docs.forEach(doc => {
      const playerData = doc.data();
      const displayName = getDisplayName(playerData.name);
      
      // Calculate card count
      const cardCount = playerData.cards ? playerData.cards.length : 0;
      
      // Get token count
      const tokenCount = playerData.tokens || 0;
      
      // Calculate inventory value
      const inventoryValue = calculateInventoryValue(playerData.cards || []);
      
      // Store player stats
      playerStats.push({
        name: playerData.name,
        displayName: displayName,
        cardCount: cardCount,
        tokenCount: tokenCount,
        inventoryValue: inventoryValue
      });
    });
    
  } catch (error) {
    console.error("Error loading player stats:", error);
  }
}

// Calculate inventory value based on card rarities
function calculateInventoryValue(cards) {
  let totalValue = 0;
  
  cards.forEach(card => {
    // Check for special cards
    if (card.endsWith('-P')) {
      totalValue += 150; // Prime Award
    } else if (card.endsWith('-A')) {
      totalValue += 75;  // Award
    } else if (card.startsWith('V9-')) {
      totalValue += 100; // Monument (V9 prefix)
    }
    // Then check rarity types
    else if (L && L.includes(card)) {
      totalValue += 85; // Legendary
    } else if (E && E.includes(card)) {
      totalValue += 40; // Epic
    } else if (R && R.includes(card)) {
      totalValue += 12; // Rare
    } else if (U && U.includes(card)) {
      totalValue += 4;  // Uncommon
    } else if (C && C.includes(card)) {
      totalValue += 1;  // Common
    } else if (card.startsWith('V') || card.startsWith('S')) {
      totalValue += 10; // Other Specials and Variants
    } else {
      totalValue += 1;  // Default to Common for unknown cards
    }
  });
  
  return totalValue;
}

// Display player statistics in tables
function displayStats() {
  // Card count table
  displayCardCountStats();
  
  // Token count table
  displayTokenCountStats();
  
  // Inventory value table
  displayInventoryValueStats();
}

// Display card count rankings
function displayCardCountStats() {
  const tableBody = document.getElementById('cardCountBody');
  tableBody.innerHTML = '';
  
  // Sort by card count (highest to lowest)
  const sortedPlayers = [...playerStats].sort((a, b) => b.cardCount - a.cardCount);
  
  // Create table rows
  sortedPlayers.forEach((player, index) => {
    const row = document.createElement('tr');
    
    // Rank cell with medal for top 3
    const rankCell = document.createElement('td');
    if (index === 0) {
      rankCell.innerHTML = `<span class="medal-1">🥇 1</span>`;
    } else if (index === 1) {
      rankCell.innerHTML = `<span class="medal-2">🥈 2</span>`;
    } else if (index === 2) {
      rankCell.innerHTML = `<span class="medal-3">🥉 3</span>`;
    } else {
      rankCell.textContent = index + 1;
    }
    
    // Player name cell
    const nameCell = document.createElement('td');
    nameCell.textContent = player.displayName;
    
    // Card count cell
    const countCell = document.createElement('td');
    countCell.textContent = player.cardCount;
    
    // Add cells to row
    row.appendChild(rankCell);
    row.appendChild(nameCell);
    row.appendChild(countCell);
    
    // Add row to table
    tableBody.appendChild(row);
  });
}

// Display token count rankings
function displayTokenCountStats() {
  const tableBody = document.getElementById('tokenCountBody');
  tableBody.innerHTML = '';
  
  // Sort by token count (highest to lowest)
  const sortedPlayers = [...playerStats].sort((a, b) => b.tokenCount - a.tokenCount);
  
  // Create table rows
  sortedPlayers.forEach((player, index) => {
    const row = document.createElement('tr');
    
    // Rank cell with medal for top 3
    const rankCell = document.createElement('td');
    if (index === 0) {
      rankCell.innerHTML = `<span class="medal-1">🥇 1</span>`;
    } else if (index === 1) {
      rankCell.innerHTML = `<span class="medal-2">🥈 2</span>`;
    } else if (index === 2) {
      rankCell.innerHTML = `<span class="medal-3">🥉 3</span>`;
    } else {
      rankCell.textContent = index + 1;
    }
    
    // Player name cell
    const nameCell = document.createElement('td');
    nameCell.textContent = player.displayName;
    
    // Token count cell
    const countCell = document.createElement('td');
    countCell.textContent = player.tokenCount;
    
    // Add cells to row
    row.appendChild(rankCell);
    row.appendChild(nameCell);
    row.appendChild(countCell);
    
    // Add row to table
    tableBody.appendChild(row);
  });
}

// Display inventory value rankings
function displayInventoryValueStats() {
  // Get the table body element
  const tableBody = document.getElementById('valueBody');
  
  // Clear existing content
  tableBody.innerHTML = '';
  
  // Sort players by inventory value (highest to lowest)
  const sortedPlayers = [...playerStats].sort((a, b) => b.inventoryValue - a.inventoryValue);
  
  // Create and append rows for each player
  sortedPlayers.forEach((player, index) => {
    // Create a new table row
    const row = document.createElement('tr');
    
    // --- RANK CELL ---
    const rankCell = document.createElement('td');
    // Add medals for top 3
    if (index === 0) {
      rankCell.innerHTML = `<span class="medal-1">🥇 1</span>`;
    } else if (index === 1) {
      rankCell.innerHTML = `<span class="medal-2">🥈 2</span>`;
    } else if (index === 2) {
      rankCell.innerHTML = `<span class="medal-3">🥉 3</span>`;
    } else {
      rankCell.textContent = index + 1;
    }
    row.appendChild(rankCell);
    
    // --- NAME CELL ---
    const nameCell = document.createElement('td');
    nameCell.textContent = player.displayName;
    row.appendChild(nameCell);
    
    // --- VALUE CELL ---
    const valueCell = document.createElement('td');
    valueCell.textContent = player.inventoryValue.toLocaleString();
    row.appendChild(valueCell);
    
    // Add the completed row to the table
    tableBody.appendChild(row);
  });
}

// Helper function to get display names
function getDisplayName(username) {
  switch(username) {
    case 'dc': return 'DCMetro';
    case 'gem': return 'DCGemmaster';
    case 'jig': return 'Jiggster';
    case 'peach': return 'PeachRabbit';
    case 'void': return 'Voidmaxmph';
    case 'zav': return 'zaveeya785';
    default: return username;
  }
}
