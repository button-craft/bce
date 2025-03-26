//HEADER FUNCTIONS

//Required Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCLjx4Ys4qnzMfRog74NExTUHdZism8u-I",
  authDomain: "buttoncards.firebaseapp.com",
  databaseURL: "https://buttoncards-default-rtdb.firebaseio.com",
  projectId: "buttoncards",
  storageBucket: "buttoncards.firebasestorage.app",
  messagingSenderId: "1001795754069",
  appId: "1:1001795754069:web:1cbf4305a68f9b45eb5cdc",
  measurementId: "G-F56PTH5YNL"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

//Load Username into Header
window.onload = async function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        // If no user is logged in, redirect to login page
        window.location.href = 'index.html';
    }
  
    const userRef = db.collection('users');
    const userQuery = await userRef
        .where('name', '==', currentUser.username)
        .get();
    const doc = userQuery.docs[0];
    
    if(currentUser.username=="dc"){
      document.getElementById('username').textContent = `User: DCMetro`;
    } else if(currentUser.username=="gem"){
      document.getElementById('username').textContent = `User: DCGemmaster`;
    } else if(currentUser.username=="jig"){
      document.getElementById('username').textContent = `User: Jiggster`;
    } else if(currentUser.username=="peach"){
      document.getElementById('username').textContent = `User: PeachRabbit`;
    } else if(currentUser.username=="void"){
      document.getElementById('username').textContent = `User: Voidmaxmph`;
    } else if(currentUser.username=="zav"){
      document.getElementById('username').textContent = `User: zaveeya785`;
    } else{
      document.getElementById('username').textContent = `User: SketchyMan`;
    }

    let opened = new Date(doc.data().open);
    let now = new Date();
    now.setMinutes(0, 0, 0);
    opened.setMinutes(0, 0, 0);

    console.log(now);
    console.log(opened);
    let curTokens = doc.data().tokens;
    // Compare the dates
    if (now - opened >= 3600000) { // 86400000 ms = 1 day
      console.log("+1 Token");
      let newTokens = curTokens+1;
      await doc.ref.update({
        open: now.getTime(),
        tokens: newTokens
      });
      curTokens++;
    } else {
      console.log("No New Token");
    }
    let exNow = new Date();
    await doc.ref.update({
        lastLogin: exNow
      });

    document.getElementById('token').textContent = `Pack Tokens: ` + curTokens;
}


async function checkTrades() {
  
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userRef = db.collection('users');
  const userQuery = await userRef
      .where('name', '==', currentUser.username)
      .get();
  const doc = userQuery.docs[0];
  
  if(doc.data().trades.length <= 0){
    return;
  }
  
  //get the trading selector in the menu
  const links = document.querySelectorAll('a');
  links.forEach(link => {
      if (link.textContent === "Trading") {
          //change the background color
          link.style.backgroundColor = 'darkred';
      }
  });
}
checkTrades();

//Logout Button Click
function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}
