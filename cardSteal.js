// Card Stealer Functions

// Get current user info
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
const currentUsername = currentUser.username.toLowerCase();
let selectedCards = [];
let targetUser = '';

// Load the selected user's cards
async function loadCards() {
  // Get all card elements that exist in the DOM
  const cardElements = document.querySelectorAll('[class^="c"]');
  
  // Clear any previously displayed cards
  cardElements.forEach(cardElement => {
    cardElement.src = "Pack.png";
    cardElement.style.width = "0px";
    cardElement.style.border = "0";
  });

  // Get the selected user
  targetUser = document.querySelector(".stealSelect").value;
  
  // Don't allow stealing from yourself
  if (targetUser === currentUsername) {
    window.alert("You cannot steal cards from yourself!");
    return;
  }

  // Get the target user's cards
  const userRef = db.collection('users');
  const userQuery = await userRef
        .where('name', '==', targetUser)
        .get();
  
  if (userQuery.empty) {
    window.alert("User not found!");
    return;
  }
  
  const doc = userQuery.docs[0];
  let userCards = doc.data().cards.sort();
  
  // Display the cards (only up to the number of card elements we have)
  const maxCards = Math.min(userCards.length, cardElements.length);
  for (let i = 0; i < maxCards; i++) {
    let cardResult = document.querySelector(".c" + i);
    if (cardResult) {
      cardResult.src = "img/" + userCards[i] + ".png";
      cardResult.style.width = "110px";
      cardResult.dataset.cardId = userCards[i]; // Store the card ID for stealing
    }
  }
}

// Steal a card when clicked
async function stealCard(cardClass) {
  const cardElement = document.querySelector("." + cardClass);
  const cardId = cardElement.dataset.cardId;
  
  if (!cardId) {
    return; // No card to steal
  }
  
  // Confirm steal
  if (!confirm(`Are you sure you want to steal this card: ${cardId}?`)) {
    return;
  }
  
  try {
    // Get current user's cards
    const userRef = db.collection('users');
    const currentUserQuery = await userRef
          .where('name', '==', currentUsername)
          .get();
    
    if (currentUserQuery.empty) {
      window.alert("Error: Your user account not found!");
      return;
    }
    
    const currentDoc = currentUserQuery.docs[0];
    let currentCards = currentDoc.data().cards;
    
    // Get target user's cards
    const targetUserQuery = await userRef
          .where('name', '==', targetUser)
          .get();
    
    if (targetUserQuery.empty) {
      window.alert("Error: Target user not found!");
      return;
    }
    
    const targetDoc = targetUserQuery.docs[0];
    let targetCards = targetDoc.data().cards;
    
    // Find and remove the card from target user
    const cardIndex = targetCards.indexOf(cardId);
    if (cardIndex === -1) {
      window.alert("Error: Card not found in target user's collection!");
      return;
    }
    
    targetCards.splice(cardIndex, 1);
    
    // Add the card to current user
    currentCards.push(cardId);
    
    // Update both users in Firebase
    await targetDoc.ref.update({
      cards: targetCards
    });
    
    await currentDoc.ref.update({
      cards: currentCards
    });
    
    // Notify success and refresh cards
    window.alert(`Successfully stolen card: ${cardId}!`);
    loadCards(); // Refresh the display
    
  } catch (error) {
    console.error("Error stealing card:", error);
    window.alert("An error occurred while stealing the card. Please try again.");
  }
}

// Initialize menu
function loadMenu() {
  // Get the select menu element
  const selectMenu = document.querySelector('select[name="stealSelect"]');
  
  // Remove current user from the list
  const options = selectMenu.querySelectorAll('option');
  
  options.forEach(option => {
    if (option.value.toLowerCase() === currentUsername) {
      option.remove();
    }
  });
}

// Call loadMenu on page load
loadMenu();
