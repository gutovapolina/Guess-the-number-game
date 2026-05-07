let records = []

const loadRecords = () => {
    const saved = localStorage.getItem("guessGameRecords")
    if (saved) {
        records = JSON.parse(saved)
    }
}

const saveRecords = () => {
    localStorage.setItem("guessGameRecords", JSON.stringify(records))
}

const addRecord = (name, attempts) => {
    const newRecord = {
        name: name,
        attempts: attempts,
        date: new Date().toLocaleString()
    }
    records.push(newRecord)
    records.sort((a, b) => a.attempts - b.attempts)
    if (records.length > 10) {
        records = records.slice(0, 10)
    }
    saveRecords()
    showRecords()
}

const showRecords = () => {
    const recordsDiv = document.getElementById("records")
    if (records.length === 0) {
        recordsDiv.innerHTML = "<p>нет рекордов - сыграй и стань первым!</p>"
        return
    }
    let tableRows = ""
    records.map((record, index) => {
        tableRows += `<tr><td>${index + 1}</td><td>${record.name}</td><td>${record.attempts}</td><td>${record.date}</td></tr>`
    })
    const html = `<table border="1" cellpadding="5"><tr><th>#</th><th>Имя</th><th>Попытки</th><th>Дата</th><tr>${tableRows}</table>`
    recordsDiv.innerHTML = html
}

let secretNumber = 0
let attemptsCount = 0

const startNewGame = () => {
    secretNumber = Math.floor(Math.random() * 100) + 1
    attemptsCount = 0
    const messageEl = document.getElementById("message")
    messageEl.textContent = "Я загадала число от 1 до 100 попробуй угадать!"
    messageEl.style.color = "black"
    document.getElementById("guessInput").value = ""
    document.getElementById("guessInput").disabled = false
    document.getElementById("guessBtn").disabled = false
    document.getElementById("attemptsCount").textContent = "0"
}

const checkGuess = () => {
    const inputEl = document.getElementById("guessInput")
    const guess = Number(inputEl.value)
    const messageEl = document.getElementById("message")

    if (isNaN(guess) || guess < 1 || guess > 100) {
        messageEl.textContent = "❌ Введи число от 1 до 100!"
        messageEl.style.color = "red"
        inputEl.value = ""
        return
    }

    attemptsCount++
    document.getElementById("attemptsCount").textContent = attemptsCount

    if (guess === secretNumber) {
        messageEl.textContent = ` Победа! Ты угадал число ${secretNumber} за ${attemptsCount} попыток!`
        messageEl.style.color = "green"
        inputEl.disabled = true
        document.getElementById("guessBtn").disabled = true

        let playerName = prompt("Поздравляю! Введи своё имя для таблицы рекордов:")
        if (!playerName || playerName.trim() === "") {
            playerName = "Аноним"
        }
        addRecord(playerName.trim(), attemptsCount)
    } else if (guess < secretNumber) {
        messageEl.textContent = `${guess} - это число меньше загаданного - пробуй ещё🦄`
        messageEl.style.color = "blue"
        inputEl.value = ""
    } else {
        messageEl.textContent = `${guess} - это число больше загаданного - пробуй ещё🦄`
        messageEl.style.color = "blue"
        inputEl.value = ""
    }
}

const init = () => {
    loadRecords()
    showRecords()
    startNewGame()
    document.getElementById("guessBtn").onclick = checkGuess
    document.getElementById("newGameBtn").onclick = startNewGame
    document.getElementById("guessInput").onkeypress = (event) => {
        if (event.key === "Enter") {
            checkGuess()
        }
    }
}

init()