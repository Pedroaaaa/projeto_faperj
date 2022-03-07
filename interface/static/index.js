(() => {
    function loadThemes() {
        const themes = document.getElementById("theme");
        fetch('http://localhost:31415/themes',{method:"get"})
        .then(function(response) {
            response.json().then(function(data) {
                for(const theme of data) {
                    themes.innerHTML += `<label><input type="radio" name="theme" value="${theme.id}"> ${theme.theme}</label>`;
                }
            })
        })
    }
    function loadCharacters() {
        const characters = document.getElementById("character");
        fetch('http://localhost:31415/characters',{method:"get"})
        .then(function(response) {
            response.json().then(function(data) {
                for(const character of data) {
                    characters.innerHTML += `<label><input type="radio" name="character" value="${character.id}"> ${character.charName}</label>`;
                }
            })
        })
    }
    if(document.getElementById("theme")) loadThemes();
    if(document.getElementById("character")) loadCharacters();

    function saveQuestion() {
        let prompt = document.querySelector("[name='statement']").value;
        if(prompt === '') {
            prompt = null;
        }
        const alternatives = document.querySelectorAll("[name='alternatives']")
        const answers = []
        for(const alternative of alternatives) {
            if(alternative.value) {
                answers.push(alternative.value)
            }
        }
        const correct = document.querySelector("[name='correct']").value;

        if(!alternatives[correct].value) {
            window.alert("The correct answer cannot be null")
            return;
        }
        

        let themeId = 0;
        for(theme of document.getElementsByName("theme")) {
            if(theme.checked) {
                themeId = theme.value;
            }
        };
        let characterId = 0
        for(character of document.getElementsByName("character")) {
            if(character.checked) {
                characterId = character.value;
            }
        };
        const difficulty = document.querySelector("#difficultyRange").value;
        const question = {
            prompt,
            answers,
            correct,
            themeId,
            characterId,
            difficulty
        };
        sendQuestion(question);
    }

    function sendQuestion(question) {
        const url = 'http://localhost:31415/questions';
        const opcoes = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(question)
        };
        fetch(url, opcoes)
            .then(async response => {
                const message = await response.json();
                if (!response.ok) {
                    window.alert("HTTP status " + response.status + "\n\n" + message["Error message"]);
                } else {
                    window.alert("HTTP status " + response.status + "\n\n" + message.Status);
                    clean();
                }
            })
    }

    function clean() {
        document.querySelector("[name='statement']").value = "";
        for(const alternative of document.querySelectorAll("[name='alternatives']")) {
            if(alternative) {
                alternative.value = "";
            }
        }
        document.querySelector("[name='correct']").value = "";
        for(theme of document.getElementsByName("theme")) {
            if(theme.checked) {
                theme.checked = false;
            }
        };
        for(character of document.getElementsByName("character")) {
            if(character.checked) {
                character.checked = false;
            }
        };
        document.querySelector("#difficultyRange").value = 3;
        document.getElementById("difficultyOutput").innerText = 3;
    }

    const save = document.querySelector("#save");
    save.addEventListener('click', saveQuestion);
})()