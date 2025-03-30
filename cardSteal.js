// Card Stealer Functions
// Get current user info
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
const currentUsername = currentUser.username.toLowerCase();
let targetUser = '';
// Load the selected user's cards
async function loadCards() {
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
  
  // Clear the list and rebuild it
  const stealList = document.getElementById("stealList");
  stealList.innerHTML = '';
  
  // Add cards to the list
  for (let i = 0; i < userCards.length; i++) {
    const li = document.createElement('li');
    const img = document.createElement('img');
    
    img.src = "img/" + userCards[i] + ".png";
    img.className = "c" + i;
    img.style.width = "110px";
    img.dataset.cardId = userCards[i];
    img.onclick = function() { stealCard("c" + i); };
    
    li.appendChild(img);
    stealList.appendChild(li);
  }
}
// Steal a card when clicked
async function stealCard(cardClass) {
  const cardElement = document.querySelector("." + cardClass);
  const cardId = cardElement.dataset.cardId;
  
  if (!cardId) {
    return; // No card to steal
  }
  
  // Check if card is Atlanta (ID "1-3")
  if (cardId === "1-3") {
    window.alert("Card 'Atlanta' cannot be stolen at this time.");
    return;
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
