// landingpage.js

function handleLogin() {
    const userElement = document.getElementById('username');
    const passwordElement = document.getElementById('password');

    if (!userElement || !passwordElement) {
        console.error('Login form elements not found!');
        return;
    }

    const username = userElement.value;
    const password = passwordElement.value;

    fetch('/userdatas/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName: username, userPassword: password }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Assuming your server responds with { success: true, userID: "someId" } on successful login
                localStorage.setItem('currentUserID', data.userID);
                window.location.href = '/pages/main';
                // Redirect or update UI as necessary
            } else {
                // If your server responds with { success: false } on failed login
                alert("wrong username or password");
            }
        })
        .catch(error => {
            console.error('Error during login:', error);
            alert('An error occurred during login');
        });
}


// Add event listener to the login form submit event
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            handleLogin();
        });
    }
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
