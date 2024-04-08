document.addEventListener('DOMContentLoaded', function () {
    const registrationForm = document.getElementById('registrationForm');

    registrationForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const username = document.getElementById('reg-username').value;
        const password = document.getElementById('reg-password').value.trim();
        const confirmPassword = document.getElementById('confirm-password').value.trim();

        console.log('Password:', password);
        console.log('Confirm Password:', confirmPassword);
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        fetch('/userdatas', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                userName: username,  // Changed to match server.js
                userPassword: password // Changed to match server.js
            }),
        })
            .then(response => response.text())
            .then(data => {
                let data2 = JSON.parse(data)
                if(data2.email == email){     
                    localStorage.setItem('currentUserID', data2._id)
                    console.log(data2._id)
                    fetch('/items', {//creates an inventory object for the user
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "userID": data2._id
                        })
                    }).catch(err => console.log('error: ' + error))
                    alert('User created successfully');
                    window.location.href = '/pages/landingpage';
                }else if(data2.message == 'Username already exists'){
                    alert('User name already exists');
                }else{
                    alert(data);
                }
            })
            .catch((error) => {
                console.error('Error:' + error);
                alert('An error occurred');
            });
    });
});



window.onload = function() {
    let userID = localStorage.getItem("currentUserID")
    if (userID != null || userID != undefined) {
        window.location.href = "/pages/main"
        console.log(userID)
    } else {
        console.log("no user")
    }
};