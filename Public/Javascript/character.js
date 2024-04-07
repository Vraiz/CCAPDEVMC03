
const errorLog = document.getElementById("errorLog"); //Copy over
const switcher = document.getElementById("switch");
var switched

var userID //Copy over
var loggedIN //Copy over//New~!


const readData = async () => {
    let rollDataR = await fetch('/userdatas/' + userID)
    let rollData = await rollDataR.json();
    return rollData;
}

const readItemDatas = async () => {
    let itemDataR = await fetch('/items');
    let itemData = await itemDataR.json();
    return itemData;
}

function getItemIndex(itemDatas) {//Important copy over
    let i;
    let userID = localStorage.getItem("currentUserID")
    for(i=0; i<itemDatas.length; i++){
        console.log(itemDatas[i].userID)
        if(userID == itemDatas[i].userID){
            return i;
        }
    }
    return -1;
}

async function updateCurrency(){
    let UserData = await readData()
    $('#rolls').text("Rolls: " + UserData.Rolls.toString())
    $('#credits').text("¢: " + UserData.credits.toString())
}

function divMaker(name = String, description = String, image = String, rarity = Number, price = Number, index = Number) {
    let RareColor
    let RareStars

    switch (rarity){
        case 1:
            RareColor = "white"
            RareStars = "★"
            break;
        case 2:
            RareColor = "green"
            RareStars = "★★"
            break;
        case 3:
            RareColor = "blue"
            RareStars = "★★★"
            break;    
        case 4:
            RareColor = "purple"
            RareStars = "★★★★"
            break;
        case 5:
            RareColor = "orange"
            RareStars = "★★★★★"
            break;          
    }
    
    let mainDiv = document.createElement("div");
    $(mainDiv).addClass("charBox owned " + RareColor);
    $(mainDiv).attr('id', index);
    $(mainDiv).data('index', price);
    $(mainDiv).data('rarity', rarity);
    $(mainDiv).data('name', name);
    $(mainDiv).data('price', price);

    let charImage = document.createElement("div");
    $(charImage).addClass("charImage");
    $(charImage).css("background-image", "url(" + image + ")");
    $(charImage).css("background-size", "70%");
    console.log(image + " test")

    let charName = document.createElement("div");
    $(charName).addClass("CharName");
    $(charName).html(name + '<br/>' + "<em class='stars'>" + RareStars + "</em>");

    let charDesc = document.createElement("div");
    $(charName).addClass("charDesc");
    $(charDesc).html(description);

    let actionButton = document.createElement("div");//sell or buy
    $(actionButton).html("Sell: " + price);
    $(actionButton).addClass("actionButton");
    

    $(mainDiv).append(actionButton);
    $(mainDiv).append(charImage);
    $(mainDiv).append(charName);
    $(mainDiv).append(charDesc);
    $("#charHolder").append(mainDiv);
    

}

async function loadItems() {
    let i, j, k = 0;
    let itemRaw = await readItemDatas();
    let index = getItemIndex(itemRaw);

    if(index != -1){
        let Items = itemRaw[index]

        let sArray = Items.itemRarity
        let itemIndex = Items.itemIndex
        let max, temp

        for(let i = 0; i < Items.itemRarity.length; i++) {
            let max = i;
            for(let j = i+1; j < Items.itemRarity.length; j++){
                if(sArray[j] > sArray[max]) {
                    max=j; 
                }
            }
            if (max != i) {
                temp = sArray[i]; 
                sArray[i] = sArray[max];
                sArray[max] = temp;      

                temp = itemIndex[i]; 
                itemIndex[i] = itemIndex[max];
                itemIndex[max] = temp;
            }
        }
        console.log(sArray)

        for(i=0; i<Items.itemIndex.length;i++){
        for(j=0; j<Items.itemCount[itemIndex[i]];j++){
                divMaker(Items.itemName[itemIndex[i]], Items.itemDesc[itemIndex[i]], Items.itemIMG[itemIndex[i]], sArray[i], Items.itemPrice[itemIndex[i]], itemIndex[i])
                k++
            }
        }
    }else {
        console.log("ERROR")
    }

}



$("#charHolder").on('click', ".actionButton", async function() { 
    let element = $(this).parent()
    $(element).css("display", "none") //Hide part not needed for store

    let divNumber = 0
    $('#charHolder').children().each(function () {
        if($(this).is(':visible') == true){
            divNumber++
        }
    })
    console.log(divNumber + "pichapie")
    if (divNumber == 0){
        $("#backplate").text("You don't own any characters");
    }

    let userData = await readData()
    let itemRaw = await readItemDatas();
    let index = getItemIndex(itemRaw);
    let sellIndex
    let price, i

    let itemName = $(element).data('name');
    let itemRarity = $(element).data('rarity');
    
    console.log(sellIndex)

    if(index != -1 && index != null){
        let inventory = itemRaw[index]
        price = $(element).data('price');

        for(i=0;i<inventory.itemIndex.length;i++){
            if(itemName == inventory.itemName && itemRarity == inventory.itemRarity){
                sellIndex = i
            }
        }
       
        if (inventory.itemCount[sellIndex]>1){
            inventory.itemCount[sellIndex]--;
        } else {
            inventory.itemName.splice(sellIndex, 1)
            inventory.itemDesc.splice(sellIndex, 1)
            inventory.itemPrice.splice(sellIndex, 1)
            inventory.itemCount.splice(sellIndex, 1)
            inventory.itemIMG.splice(sellIndex, 1)
            inventory.itemRarity.splice(sellIndex, 1)
            inventory.itemIndex.pop()
        }
        console.log(inventory.itemCount)

        //copy this
        fetch(('/items/' + inventory._id), {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "itemName": inventory.itemName,
                "itemDesc": inventory.itemDesc,
                "itemPrice": inventory.itemPrice,
                "itemCount": inventory.itemCount,
                "itemIMG": inventory.itemIMG,
                "itemRarity": inventory.itemRarity,
                "itemIndex": inventory.itemIndex
            })
        })
        //copy this

        fetch(('/userdatas/' + userID), {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "credits": userData.credits + price,
            })
        }).then(updateCurrency)
        $(element).remove()
    }else {
        console.log("ERROR")
    }

})

$("#switch").on('click', async (e) =>{

    if(switched == true){
        switched = false
        $("#switch").text("Owned")
        $(".owned").css("display", "block")
        $(".featured").css("display", "none")
    }else {
        switched = true
        $("#switch").text("Featured")
        $(".owned").css("display", "none")
        $(".featured").css("display", "block")
        $("#backplate").text("");
    }

    let divNumber = 0
    $('#charHolder').children().each(function () {
        if($(this).is(':visible') == true){
            divNumber++
        }
    })
    console.log(divNumber + "pichapie")
    if (divNumber == 0){
        $("#backplate").text("You don't own any characters");
    }
})


//copy over new!
window.onload = async function() {
    userID = localStorage.getItem("currentUserID")
    if (userID != null) {
        let userData = await readData()
        if(userID == userData._id) {//checks if no changes have been made
            console.log(localStorage.getItem("currentUserID"))
            loggedIN = true
            $(".owned").css("display", "none")
            switched = false
            loadItems()//IMPORTANT
            updateCurrency()
        } else {
            console.log("Error")
            loggedIN = false
        }
            
    } else {
        console.log("no user")
        loggedIN = false
    }


};