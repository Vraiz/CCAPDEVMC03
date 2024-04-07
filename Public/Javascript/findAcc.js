const form = document.getElementById("findAcc");
const submit = document.getElementById("submit")
const username = document.getElementById("username");
const password = document.getElementById("password");
const repeatPass = document.getElementById("repeatPass");

const logUser = document.getElementById("logUser");
const logPass = document.getElementById("logPass");
const loginButton = document.getElementById("login");
const errorlog = document.getElementById("errorDisplayLog")
const errorReg = document.getElementById("errorDisplayReg")
const mainPage = '/pages/gacha'





const readData = async () => {
    let userdatas = await fetch('/userdatas')
    let userdata = await userdatas.json();
    return userdata;
};

/*
const readUser = async (uID) => {
    let userdatas = await fetch('http://localhost:3000/userdatas/' + uID)
    let userdata = await userdatas.json();
    return userdata;
};
*/


function clearFields() {
    username.value = ''
    password.value = ''
    repeatPass.value = ''
}
function clearlogFields() {
    logUser.value = ''
    logPass.value = ''
}


//reg
async function checkUsername(username = String) {
    let userdatas = await readData()
    let i, userCount = userdatas.length
    for(i = 0; i<userCount; i++){
        if (username == userdatas[i].userName){
            return -1
        }
    }
    return i
}

//log
async function login(username = String, password = String) {
    let userData = await readData()
    let i, userCount = userData.length
    for(i = 0; i < userCount; i++){
        if(username == userData[i].userName) {
            if(password == userData[i].userPassword){
                return userData[i]
            }else{
                return {
                    "_id": "-2",
                }
            }
        }
    }
    return {
        "_id": "-1",
    }
}

submit.addEventListener("click", async (e) =>{
    e.preventDefault()
    console.log("click")
    if (username.value.trim().length == 0 || password.value.trim().length == 0 || repeatPass.value.trim().length == 0){
        errorReg.textContent = "don't leave empty fiedls empty"
    }else {
        if (repeatPass.value == password.value) {
            let taken = await checkUsername(username.value)
            console.log(taken)
            if(taken == -1){
                errorReg.textContent = username.value + " is already taken "
            }else {
                fetch('/userdatas', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "userName": username.value,
                        "userPassword": password.value
                    })
                }).catch(err => console.log('error'))
                .then(res => {
                    return res.json()
                }).then(data => {
                    localStorage.setItem('currentUserID', data._id)
                    
                    fetch('/items', {//creates an inventory object for the user
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "userID": data._id
                        })
                    }).catch(err => console.log('error'))
                    window.location.href = mainPage
                })
                errorReg.textContent = "success"
            }
        }
        else {
            errorReg.textContent = "passwords do not match"
        }
    }
    clearFields()
})


loginButton.addEventListener("click", async (e) =>{
    e.preventDefault()
    if (logUser.value.trim().length == 0 || logPass.value.trim().length == 0){
        errorlog.textContent = "don't leave fields empty"
    } else {
        let userData = await login(logUser.value, logPass.value)
        if (userData != null && userData._id != "-1"){
            localStorage.setItem('currentUserID', userData._id)
            errorlog.textContent = "success"
            window.location.href = mainPage
        } else {
            if(userData._id == "-1"){
                errorlog.textContent = "user not found"
            }else if(userData._id == "-2"){
                errorlog.textContent = "wrong password"
            }else{
                errorlog.textContent = "error"
            }
        }
    }
    clearlogFields()
})

window.onload = function() {
    //localStorage.clear()
    let userID = localStorage.getItem("currentUserID")
    if (userID != null) {
        window.location.href = mainPage
        console.log(userID)
    } else {
        console.log("no user")
    }

};