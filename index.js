import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://fir-bcae7-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListsInDB = ref(database, 'shoppingList')

const button = document.getElementById('add-button')
const input = document.getElementById('input-field')
const shoppingList  = document.getElementById('shopping-list') 

const buttonDeleteTimeout = 800;
let deleteTimer;
 
onValue(shoppingListsInDB, snapshot => {
    shoppingList.innerHTML = ''

    if (!snapshot.exists()) {return};

    let items = Object.entries(snapshot.val())  
    

    items.forEach(item  => {
        addItem(item)
    })
})

button.addEventListener('click', () => {

    if(input.value.trim() === ""){
        return
    }

    push(shoppingListsInDB, input.value)
    input.value = ""
})

function addItem(item) {
    const newItem = document.createElement('li');
    newItem.classList.add('item');
    newItem.textContent = item[1];

    newItem.addEventListener("mousedown", event => handleEvent(event, item));
    newItem.addEventListener("touchstart", event => handleEvent(event, item));

    newItem.addEventListener("mouseup", event => cancelTimeout());
    newItem.addEventListener("touchend", event => cancelTimeout());

    shoppingList.appendChild(newItem);
}

function handleEvent(event, item) {
    clearTimeout(deleteTimer);
    deleteTimer = setTimeout(() => {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${item[0]}`);
        event.target.classList.remove('show');
        event.target.classList.add('fade');
        setTimeout(() => {
            remove(exactLocationOfItemInDB);
        }, 270);
    }, buttonDeleteTimeout);
}

function cancelTimeout() {
    clearTimeout(deleteTimer);
}
