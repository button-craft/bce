//LOGIN FUNCTIONS

//Check if User is Already Signed In
window.onload = function() {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
        const user = JSON.parse(rememberedUser);
        document.getElementById('loginUsername').value = user.username;
    }

    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'home.html';
    }
}

//Show Error Message
function showMessage(elementId, message, isError = true) {
    const messageElement = document.getElementById(elementId);
    messageElement.textContent = message;
    messageElement.style.display = 'block';
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 3000);
}

//Login User if Username/Password is Valid
async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const userRef = db.collection('users');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userQuery = await userRef
        .where('name', '==', username.toLowerCase())
        .get();
    if (!userQuery.empty) {
        const doc = userQuery.docs[0];
        const userPass = doc.data().password;
        
        if (userPass==password) {
            localStorage.setItem('rememberedUser', JSON.stringify({ username: username }));
            
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify({
                username: doc.data().name
            }));
            
            window.location.href = 'home.html';
        } else {
            showMessage('loginMessage', 'Invalid Password');
        }
    } else {
        showMessage('loginMessage', 'User Does Not Exist');
    }
    return false;
}
