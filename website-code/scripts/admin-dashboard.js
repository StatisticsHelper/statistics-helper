let currentQuestionID = null;
let questions = [];

function displayOptionsRadio(question, answer) {
    let numOptions = question.input.options.length;
    let optionContainer = document.createElement("fieldset");
    for (let i=0; i<numOptions; i++) {
        let option = question.input.options[i];
        let input = document.createElement("input");
        input.setAttribute("type", "radio");
        if (answer && option === answer) input.checked = true;
        input.setAttribute("name", `${question.id}-options`);
        input.setAttribute("id", `${question.id}-radio${i+1}`);
        let label = document.createElement("label");
        label.setAttribute("id", `${question.id}-label${i+1}`)
        label.setAttribute("for", `${question.id}-radio${i+1}`);
        label.innerText = option;
        optionContainer.appendChild(input);
        optionContainer.appendChild(label);
    }
    return optionContainer;
}
function displayOptionsCheckbox(question, answer) {
    let numOptions = question.input.options.length;
    let optionContainer = document.createElement("fieldset");
    for (let i=0; i<numOptions; i++) {
        let option = question.input.options[i];
        let input = document.createElement("input");
        input.setAttribute("type", "checkbox");
        if (answer && answer.includes(option)) input.checked = true;
        input.setAttribute("name", `${question.id}-options`);
        input.setAttribute("id", `${question.id}-check${i+1}`);
        let label = document.createElement("label");
        label.setAttribute("id", `${question.id}-label${i+1}`)
        label.setAttribute("for", `${question.id}-check${i+1}`);
        label.innerText = option;
        optionContainer.appendChild(input);
        optionContainer.appendChild(label);
    }
    return optionContainer;
}
function displayTags(question) {
    let subtitles = document.createElement('fieldset');
    question.tags.subtitles.forEach(item => {
        let element = document.createElement('p')
        element.setAttribute('id', `${question.id}-tag${question.tags.subtitles.indexOf(item)+1}`)
        element.innerText = item;
        subtitles.appendChild(element)
    })
    return subtitles;
}
function displayQuestions() {

    // 1) create a clickable button for each question
    let questionsDisplay = document.getElementById('questions-display');
    questions.forEach(question => {
        let questionButton = document.createElement('button');
        questionButton.setAttribute('id', question.id)
        questionButton.innerText = question.question;
        questionsDisplay.appendChild(questionButton);
    })

    // 2) display info for current question
    questions.forEach(question => {
        let currentQuestion = document.getElementById(question.id) // get button for question
        currentQuestion.addEventListener('click', () => {
            currentQuestionID = question.id;
            let inputID = document.getElementById('input-id');
            let inputQuestion = document.getElementById('input-question');
            let requiredYes = document.getElementById('input-required-yes');
            let requiredNo = document.getElementById('input-required-no');
            let showConditionQuestionID = document.getElementById('show-condition-question-id')
            let showConditionAnswer = document.getElementById('show-condition-answer')
            let inputTypeRadio = document.getElementById('input-type-radio')
            let inputTypeCheckbox = document.getElementById('input-type-checkbox')
            let inputOptions = document.getElementById('input-options')
            let tagsPrefix = document.getElementById('tags-prefix')
            let tagsSubtitles = document.getElementById('tags-subtitles')
            let nextID = document.getElementById('next')

            inputID.setAttribute('value', question.id);
            inputQuestion.setAttribute('value', question.question);

            if (question.required === 'yes' || question.required === 'Yes')
                requiredYes.checked = true;
            else requiredNo.checked = true;

            if (requiredYes.checked) {
                showConditionQuestionID.setAttribute('value', '');
                showConditionAnswer.innerHTML = '';
            } else {
                showConditionQuestionID.setAttribute('value', question.showCondition.questionID);
                let showConditionQuestion = questions.find(q => q.id === question.showCondition.questionID);
                if (showConditionQuestion.input.type === 'radio')
                    showConditionAnswer.innerHTML = displayOptionsRadio(showConditionQuestion, question.showCondition.answer).innerHTML;
                else if (showConditionQuestion.input.type === 'checkbox')
                    showConditionAnswer.innerHTML = displayOptionsCheckbox(showConditionQuestion, question.showCondition.answer).innerHTML;   
            }

            if (question.input.type === 'radio') {
                inputTypeRadio.checked = true;
                inputOptions.innerHTML = displayOptionsRadio(question, null).innerHTML;
            } else if (question.input.type === 'checkbox') {
                inputTypeCheckbox.checked = true;
                inputOptions.innerHTML = displayOptionsCheckbox(question, null).innerHTML;
            }

            tagsPrefix.setAttribute('value', question.tags.prefix);
            tagsSubtitles.innerHTML = displayTags(question).innerHTML;
            nextID.setAttribute('value', question.next);
         
            // 3) edit current question
            editCurrentQuestion();
        })
    })
}

function editCurrentQuestion() {

    let question = questions.find(q => q.id === currentQuestionID);
    //console.log('hi', question, currentQuestionID)

    // names of html elements to work on
    let inputID = document.getElementById('input-id');
    let inputQuestion = document.getElementById('input-question');
    let requiredYes = document.getElementById('input-required-yes');
    let requiredNo = document.getElementById('input-required-no');
    let showConditionQuestionID = document.getElementById('show-condition-question-id')
    let showConditionAnswer = document.getElementById('show-condition-answer')
    let inputTypeRadio = document.getElementById('input-type-radio')
    let inputTypeCheckbox = document.getElementById('input-type-checkbox')
    let inputOptions = document.getElementById('input-options')
    let tagsPrefix = document.getElementById('tags-prefix')
    let tagsSubtitles = document.getElementById('tags-subtitles')
    let nextID = document.getElementById('next')

    // admin needs to click Save first
    document.getElementById('save-button').addEventListener('click', () => {
        if (inputID.value !== question.id)                                          editID(inputID.value);
        if (inputQuestion.value !== question.question)                              editText(value);
        if ((requiredYes.checked && question.required === 'No')
            || (requiredNo.checked && question.required === 'Yes'))                 editRequired();
        if (question.showCondition 
            && showConditionQuestionID.value !== question.showCondition.questionID) editShowConditionQuestionID(value);
        if ((inputTypeRadio.checked && question.type === 'checkbox')
            || (inputTypeCheckbox.checked && question.type === 'radio'))            editInputType();
        if (tagsPrefix.value !== question.tags.prefix)                              editTagsPrefix(value);
        if (nextID.value !== question.next)                                         editNextID(value);

        saveToJSON();
    })
}

function editID(value) {
    let question = questions.find(q => q.id === currentQuestionID);
    
    // 1) check & edit question that has current question as 'next'
    let prevQ = questions.find(q => q.next === currentQuestionID);
    if (prevQ) prevQ.next = value;

    // 2) check if show condition of any question depends on this
    let condQ = questions.find(q => q.showCondition?.questionID === currentQuestionID)
    if (condQ && condQ.showCondition) condQ.showCondition.questionID = value;

    // 3) update ID
    question.id = value;

    console.log(currentQuestionID, questions.find(q=>q.id===currentQuestionID), questions.find(q=>q.id===value), questions)
}

function editText(value) {

}
function editRequired() {

}
function editShowConditionQuestionID(value) {

}
function editTagsPrefix(value) {

}
function editNextID(value) {

}

function saveToJSON() {

}

window.addEventListener('DOMContentLoaded', () => {
    // Function to fetch the questions array from the JSON file
    async function fetchQuestions() {
        try {
            // defaults to ../html if path is './questions.json' (but json is in ../scripts)   
            const response = await fetch('../scripts/questions.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const questions = await response.json();
            return questions;
        }
        catch (error) {
            console.error('Error fetching questions:', error);
            return null;
        }
    }

    fetchQuestions()
    .then((result) => {
        if (result) {
            questions = result;
            displayQuestions();
        }
    })
});