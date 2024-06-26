//? Get request from db.json file
function displayAllChar() {
    fetch("http://localhost:3000/characters")
        .then((resp) => resp.json())
        .then(data => renderChar(data))
}
displayAllChar()


//? Declaring Variables from DOM
const charURL = 'http://localhost:3000/characters'
const addCharForm = document.querySelector('#add-character-form')
const editCharForm = document.querySelector('#edit-character-form')
let isPopulated = false
const p1Container = document.querySelector('#player1-container')
const p2Container = document.querySelector('#player2-container')
const startFightBtn = document.querySelector('#start-fight-button')
const finisher1Text = document.querySelector('#finisher1')
const finisher2Text = document.querySelector('#finisher2')
const winnerText = document.querySelector('#winner-name')
let isStartFightClicked = false
let battleAreaFull = false



//? Renders all characters from the db.json file to their own cards on the screen
//? Also adds event listeners for edit and delete buttons. Also for clicking the image to select it as your fighter 
function renderChar(charArr) {
    const charCard = document.querySelector("#character-container")
    charCard.innerHTML = ""
    p1Andp2Placeholder()
    
    charArr.forEach((charObj) => {
        
        const charCardDiv = document.createElement('div')
        charCardDiv.className = "character-card"

        charCardDiv.addEventListener('mouseover', changeColor)
        function changeColor() {
            charCardDiv.style.color = '#FFD700'
        }

        charCardDiv.addEventListener('mouseout', changeColorBack)
        function changeColorBack() {
            charCardDiv.style.color = 'white'
        }

        const img = document.createElement('img')
        const h3 = document.createElement('h3')
        const p = document.createElement('p')
        const p2 = document.createElement('p')
        const winsText = document.createElement('p')
        const loseText = document.createElement('p')
        const editCharBtn = document.createElement('button')
        const deleteCharBtn = document.createElement('button')

        img.className = "character-img"
        img.src = charObj.image
        img.id = charObj.id
        h3.textContent = charObj.name
        p.textContent = charObj.finisher1
        p2.textContent = charObj.finisher2
        winsText.textContent = 'Wins: ' + charObj.wins
        loseText.textContent = 'Losses: ' + charObj.loses

        editCharBtn.textContent = "EDIT FIGHTER"
        editCharBtn.id = charObj.id
        deleteCharBtn.textContent = "DELETE FIGHTER"
        deleteCharBtn.id = charObj.id

        if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].includes(charObj.id)) {
            charCardDiv.append(img, h3, p, p2, winsText, loseText, editCharBtn);
        } else {
            charCardDiv.append(img, h3, p, p2, winsText, loseText, editCharBtn, deleteCharBtn);
        }

        charCard.appendChild(charCardDiv)

        editCharBtn.addEventListener('click', (e) => {
            const charFound = charArr.find(char => char.id === e.target.id)

            editCharForm.dataset.id = e.target.id
            editChar(charFound)
        })

        deleteCharBtn.addEventListener('click', (e) => {
            const charFound = charArr.find(char => char.id === e.target.id)
            deleteNewChar(charFound)
        })

        img.addEventListener('click', (e) => {
            // e.target.style.border = '2px solid red'
            const charFound = charArr.find(char => char.id === e.target.id)
            if (!battleAreaFull) {
            if (isPopulated === false) {
                p1Container.innerHTML = ''
                e.target.style.border = '5px solid blue'
                const img = document.createElement('img')
                img.src = charFound.image
                img.id = charFound.id
                p1Container.appendChild(img)
                isPopulated = true
            } else {
                p2Container.innerHTML = ''
                e.target.style.border = '5px solid red'
                const img = document.createElement('img')
                img.src = charFound.image
                img.id = charFound.id
                p2Container.appendChild(img)
                battleAreaFull = true
                isPopulated = false
            }
        }}
    )
    })
}

//? Displays text "Player 1" and "Player 2" in the battle areas when no one is battling 
function p1Andp2Placeholder() {
    p1Container.innerHTML = '';
    p2Container.innerHTML = '';
    const p1Placeholder = document.createElement('p')
    const p2Placeholder = document.createElement('p')
    p1Placeholder.id = 'player1-placeholder'
    p2Placeholder.id = 'player2-placeholder'
    p1Placeholder.textContent = "Player 1"
    p2Placeholder.textContent = "Player 2"
    p1Container.appendChild(p1Placeholder)
    p2Container.appendChild(p2Placeholder)
}

//? Populates the input areas for the character you want to edit after you click the edit button
function editChar(charObjToEdit) {
    editCharForm.name.value = charObjToEdit.name
    editCharForm.image.value = charObjToEdit.image
    editCharForm.finisher1.value = charObjToEdit.finisher1
    editCharForm.finisher2.value = charObjToEdit.finisher2
}

//? Deletes character from DOM and db.json if you click delete button on the character card
function deleteNewChar(charToDelete){
    fetch(`http://localhost:3000/characters/${charToDelete.id}`, {
        method: 'DELETE'
    })
    .then((resp) => resp.json())
    .then(data => displayAllChar())
}

//? Form event listener for editing a character
editCharForm.addEventListener('submit', e => {
    e.preventDefault()

    const updatedChar = {
        name: e.target.name.value,
        image: e.target.image.value,
        finisher1: e.target.finisher1.value,
        finisher2: e.target.finisher2.value
    }

    fetch(charURL + "/" + editCharForm.dataset.id, {
        method: "PATCH",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(updatedChar)
    })
        .then(res => res.json())
        .then(data => {
            editCharForm.name.value = ""
            editCharForm.image.value = ""
            editCharForm.finisher1.value = ""
            editCharForm.finisher2.value = ""
            displayAllChar()
        })


})

//? Event listener and function to handle a new character being pushed to DOM and added to db.json
addCharForm.addEventListener('submit', e => handleAddNewChar(e))

function handleAddNewChar(e) {
    e.preventDefault()

    const newCharObj = {
        name: e.target.name.value,
        image: e.target.image.value,
        wins: 0,
        loses: 0,
        finisher1: e.target.finisher1.value,
        finisher2: e.target.finisher2.value
    }

    fetch(charURL, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'content-type': 'application/json'
        },
        body: JSON.stringify(newCharObj)
    })
        .then(res => res.json())
        .then(data => displayAllChar())

    addCharForm.name.value = ""
    addCharForm.image.value = ""
    addCharForm.finisher1.value = ""
    addCharForm.finisher2.value = ""
}

//? Event listener to begin the fight with nested function to handle who wins fight
startFightBtn.addEventListener('click', (e) => {
    if (!isStartFightClicked) {
        const p1Id = p1Container.querySelector('img').id
        const p2Id = p2Container.querySelector('img').id

        fetch("http://localhost:3000/characters")
            .then((resp) => resp.json())
            .then(data => {
                const player1 = data.find(char => char.id === p1Id)
                const player2 = data.find(char => char.id === p2Id)
                charBattle(player1, player2)                 //nested function to handle who wins 
                startFightBtn.textContent = "End Fight"
                isStartFightClicked = true
            })
    } else {
        p1Container.innerHTML = ""
        p2Container.innerHTML = ""
        winnerText.textContent = ""
        finisher1Text.textContent = ""
        finisher2Text.textContent = ""
        startFightBtn.textContent = "Start Fight!"
        isStartFightClicked = false
        battleAreaFull = false
        displayAllChar()
    }
})

//? Function to determine who wins using math random. Has nested event listener to choose a finishing move
function charBattle(player1, player2) {
    let randNum = Math.floor(Math.random() * 100) + 1;
    let winner;
    let loser;
    if (randNum < 50) {
        winnerText.textContent = `The winner is ${player1.name}! Choose your finisher!`
        finisher1Text.textContent = `${player1.finisher1}`
        finisher2Text.textContent = `${player1.finisher2}`
        winner = player1
        loser = player2
    } else {
        winnerText.textContent = `The winner is ${player2.name}! Choose your finisher!`
        finisher1Text.textContent = `${player2.finisher1}`
        finisher2Text.textContent = `${player2.finisher2}`
        winner = player2
        loser = player1
    }

   
    finisher1Text.addEventListener('click', e => {
        winnerText.textContent = `${winner.name} finished ${loser.name} using ${winner.finisher1}`
        finisher1Text.textContent = ''
        finisher2Text.textContent = ''
    })
    finisher2Text.addEventListener('click', e => {
        winnerText.textContent = `${winner.name} finished ${loser.name} using ${winner.finisher2}`
        finisher1Text.textContent = ''
        finisher2Text.textContent = ''
    })
    winLoseUpdate(winner,loser)
}

//? Updates the amount of wins or losses a character has and renders update to DOM and db.json
function winLoseUpdate(winner, loser) {

    fetch(charURL + "/" + winner.id, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ wins: winner.wins + 1 }) 
    })
        .then(res => res.json())
        .then(data => data)

    fetch(charURL + "/" + loser.id, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ loses: loser.loses + 1 }) 
    })
        .then(res => res.json())
        .then(data => data)
}







