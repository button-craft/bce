  const userRef = db.collection('users');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  console.log(currentUser);
  const userQuery = await userRef
        .where('name', '==', currentUser.username)
        .get();
  const doc = userQuery.docs[0];
  
  let newTokens = doc.data().tokens +1;
    await doc.ref.update({
      clickTime: now.getTime(),
      tokens: newTokens
    });