
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAArj-fwH0Qi1bBqWVIO_xh5Cm3-HNII-o",
    authDomain: "contactmessage-d1a57.firebaseapp.com",
    databaseURL: "https://contactmessage-d1a57-default-rtdb.firebaseio.com",
    projectId: "contactmessage-d1a57",
    storageBucket: "contactmessage-d1a57.appspot.com",
    messagingSenderId: "103554054647",
    appId: "1:103554054647:web:94e0c401c0fbfe6b2356f2"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Create reference for your database
  var contactMessageDB = firebase.database().ref("contactmessage");

  // Add event listener to form
  document.getElementById("contactMessage").addEventListener("submit", submitForm);

  // Submit form function
  async function submitForm(e) {
    e.preventDefault();

    var fullName = getElementVal('fullname');
    var emailId = getElementVal('email');
    var phone = getElementVal('phone');
    var message = getElementVal('message');

    //basic validation
    if(!emailId || !fullName || !phone || !message ){
        console.error('All fields are required');
        return;
    }


// Save messages to the database
    await saveMessage(fullName, emailId, phone, message);


    try {
        const response = await fetch ('http://localhost:3000/send-email', {
            method: 'POST',
            headers:{
                'Content-type' : 'application/json',
            },
            body: JSON.stringify({
                email: emailId,
                name : fullName,
                subject: phone,
                message : message,
            })
        });
        if(response.ok){
            console.log('Email sent sucessfully');
        }else{
            console.log('Filed to send message');
            }
        } catch (error) {
            console.error('Error', error);
    }

    //show alert
    document.querySelector('.alert').style.display = 'block';
    //remove alert after interval
    setTimeout(() => {
        document.querySelector('.alert').style.display = 'none';
    }, 3000);

    //resert form
    document.getElementById('contactMessage').reset();

    // Save messages to the database
    saveMessage(fullName, emailId, phone, message);
  }

  // Save message function
  const saveMessage = (fullName, emailId, phone, message) => {
    var newContactMessage = contactMessageDB.push();
    newContactMessage.set({
      name: fullName,
      email: emailId,
      phone: phone,
      message: message,
    })
    .then(() => {
      console.log('Message saved successfully');
    })
    .catch((error) => {
      console.log('Error saving message:', error);
    });
  };

  // Helper function to get form values
  const getElementVal = (id) => {
    return document.getElementById(id).value;
  };

