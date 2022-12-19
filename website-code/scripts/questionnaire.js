/**
 * This is a script to control all the action in the questionnaire.
 * I added `window.addEventListener...` to make sure the html is 
 * fully loaded before the script runs. When I tried to listen to
 * button clicks without it, it would give me a TypeError, because
 * the html hadn't loaded yet.
 */

 window.addEventListener('DOMContentLoaded', () => {

    let questions = [
        {
            id: "00_Question",
            question: "What is your question? Use this to guide you.",
            required: "Yes",
            input: {
                type: "text",
                condition: "maxlength='100'"
            },
            next: "01_goal"
        },
        {
            id: "01_goal",
            question: "What is your goal?",
            required: "Yes",
            input: {
                type: "checkbox",
                options: [
                    "Describe a dataset's central tendencies, distribution, association, etc.",
                    "Predict values from one dataset to another",
                    "Test hypotheses",
                    "Generate hypotheses for later exploration",
                    "I don't know"
                ]
            },
            next: "02_relationship"
        },
        {
            id: "02_relationship",
            question: "What kind of relationship?",
            required: "Yes",
            input: {
                type: "radio",
                options: [
                    "Association/correlation - no causation implied",
                    "Cause-and-effect",
                    "None (I want to describe my data only)"
                ]
            },
            next: "03_information"
        },
        {
            id: "03_information",
            question: "What information do you need from the statistics helper process?",
            required: "No",
            showCondition: {
                questionID: "01_goal",
                answer: [
                    "Test hypotheses",
                    "I don't know"
                ]
            },
            input: {
                type: "checkbox",
                options: [
                    "The math of how it works",
                    "Critiques and limitations",
                    "An example of implementation",
                    "Overview of method",
                    "Comparison of methods",
                    "How to teach the method or concepts (pedagogy)",
                    "How to implement the method",
                    "All the info you have!"
                ]
            },
            next: "04_have_designed"
        },
        {
            id: "04_have_designed",
            question: "Have you already collected your data or designed your data collection?",
            required: "Yes",
            input: {
                type: "radio",
                options: [
                    "Yes",
                    "No"
                ]
            },
            next: "04_sample_size"
        },
        {
            id: "04_sample_size",
            question: "Do you want to read about sample size choices?",
            required: "Yes",
            showCondition: {
                questionID: "04_have_designed",
                answer: [
                    "No"
                ]
            },
            input: {
                type: "radio",
                options: [
                    "Yes",
                    "No"
                ]
            },
            next: "05_repeated"
        },
        {
            id: "05_repeated",
            question: "Are you measuring teh same thing more than once in time or space?",
            required: "Yes",
            input: {
                type: "radio",
                options: [
                    "Yes",
                    "No, everything is independent",
                    "No, the points are different items"
                ]
            },
            next: "05_relationship"
        },
        {
            id: "05_relationship",
            question: "What relationship shape do you expect?",
            required: "No",
            showCondition: {
                questionID: "02_relationship",
                answer: [
                    "Association/correlation - no causation implied",
                    "Cause-and-effect"
                ]
            },
            input: {
                type: "radio",
                options: [
                    "Linear",
                    "Non-linear",
                    "Something else or I don't know"
                ]
            },
            next: "06_report"
        },
        {
            id: "06_report",
            question: "What do you need to report for your data",
            required: "Yes",
            input: {
                type: "checkbox",
                options: [
                    "I'm not sure yet - show me all possibilities",
                    "Intervals (error bars, variation, etc.)",
                    "How well this works for other things",
                    "Graphs and figures and plots!",
                    "Statistical significance (p values and test statstics)",
                    "No significance tests, I just want to see/show what it looks like",
                    "Comparisons among multiple groups"
                ]
            },
            next: "06_interpret"
        },
        {
            id: "06_interpret",
            question: "What type of mistakes in interpretation are you worried about?",
            required: "Yes",
            input: {
                type: "checkbox",
                options: [
                    "Sample size or statistical power",
                    "Survey/sampling bias",
                    "Meeting assumptions of the test",
                    "Measurement error",
                    "Statsitical significance but not meaningful results"
                ]
            },
            next: ""
        }
    ]

    console.log(questions);

    /**------------------------------------------------------------------------------------------------- */


    let form = document.getElementById("questionnaire-form")
    let fieldset = document.getElementById("question-fieldset")

    let personalizedQuestionAnswerList = [];
    let currentQuestion = {};
    let currentAnswer = {};

    // this is a function to create the HTML elements that the user will see for each question
    function promptQuestion(question) {
        currentQuestion = question;
        let legend = document.createElement("legend")
        fieldset.appendChild(legend);
        legend.innerText = question.question;

        console.log("currentQuestion: ", question);
        if (question.input.type === "text") {
            let input = document.createElement("input");
            input.setAttribute("type", "text");
            input.setAttribute("id", `${question.id}-text-input`)
            //input.setAttribute("required", "required");
            if(question.input.condition === "maxlength='100") input.setAttribute("maxlength", "100");
            let label = document.createElement("label");
            label.setAttribute("id", `${question.id}-label`)
            label.setAttribute("for", `${question.id}-text-input`);
            label.innerText = "Enter your question (maximum 100 characters): "
            fieldset.appendChild(label);
            fieldset.appendChild(input);
        }
        else if (question.input.type === "checkbox") {
            //console.log("checkbox coming!", question.input.type);
            let numOptions = question.input.options.length;
            fieldset.setAttribute("required", "required");
            for (let i = 0; i < numOptions; i++) {
                let option = question.input.options[i];
                //console.log("option: ", option);
                let input = document.createElement("input");
                input.setAttribute("type", "checkbox");
                input.setAttribute("name", `${question.id}-options`);
                input.setAttribute("id", `${question.id}-check${i+1}`);
                let label = document.createElement("label");
                label.setAttribute("id", `${question.id}-label${i+1}`)
                label.setAttribute("for", `${question.id}-check${i+1}`);
                label.innerText = option;
                fieldset.appendChild(input);
                fieldset.appendChild(label);
                fieldset.appendChild(document.createElement("br"));
            }
        }
        else if (question.input.type === "radio") {
            //console.log("radio coming!", question.input.type);
            let numOptions = question.input.options.length;
            for (let i=0; i<numOptions; i++) {
                let option = question.input.options[i];
                //console.log("option: ", option);
                let input = document.createElement("input");
                input.setAttribute("type", "radio");
                input.setAttribute("name", `${question.id}-options`);
                input.setAttribute("id", `${question.id}-radio${i+1}`);
                let label = document.createElement("label");
                label.setAttribute("id", `${question.id}-label${i+1}`)
                label.setAttribute("for", `${question.id}-radio${i+1}`);
                label.innerText = option;
                fieldset.appendChild(input);
                fieldset.appendChild(label);
                fieldset.appendChild(document.createElement("br"));
            }
        }
    }
    
    // this is a function to validate the answer received for the current question so that users are required to answer before moving to next question
    function checkIfCurrentAnswerIsValid() {
        // for text input
        if (currentQuestion.input.type === "text") {
            var inputField = document.querySelector('fieldset input[type=text]');
            if (inputField.value === '') {
              alert('Please enter a value!');
              return false;
            }
        }
        
        // for checkbox input
        if (currentQuestion.input.type === "checkbox") {
            var checkboxes = document.querySelectorAll('fieldset input[type=checkbox]');
            var checked = false;
            for (var i = 0; i < checkboxes.length; i++) {
              if (checkboxes[i].checked) {
                checked = true;
                break;
              }
            }
            if (!checked) {
              alert('Please select at least one option!');
              return false;
            }
        }

        // for radio input
        else if (currentQuestion.input.type === "radio") {
            var radioButtons = document.querySelectorAll('fieldset input[type=radio]');
            var checked = false;
            for (var i = 0; i < radioButtons.length; i++) {
              if (radioButtons[i].checked) {
                checked = true;
                break;
              }
            }
            if (!checked) {
              alert('Please select an option!');
              return false;
            }
        }
        return true;
    }

    // this is a function to get the answer from the user for each question, then append it to a question-answer list
    function getCurrentAnswer() {
        let result = {type: currentQuestion.input.type};
        if (currentQuestion.input.type === "text") {
            result.answer = document.getElementById(`${currentQuestion.id}-text-input`).value;
        }
        else if (currentQuestion.input.type === "checkbox") {
            let checkedArray = [];
            let checkboxes = document.getElementsByName(`${currentQuestion.id}-options`);
            for (let i=0; i<checkboxes.length; i++) {
                let box = checkboxes[i];
                if(box.checked) checkedArray.push(document.getElementById(`${currentQuestion.id}-label${i+1}`).innerText);
            }
            result.answer = checkedArray;
        }
        else if (currentQuestion.input.type === "radio") {
            let checkedArray = [];
            let checkboxes = document.getElementsByName(`${currentQuestion.id}-options`);
            for (let i=0; i<checkboxes.length; i++) {
                let box = checkboxes[i];
                if(box.checked) result.answer = document.getElementById(`${currentQuestion.id}-label${i+1}`).innerText;
            }
        }
        return result;
    }

    // this is a function to determine whether to show question or not
    function determineShowConditionOf(question) {
            if (question.required === "Yes") return true;

            else { // question is not required --> check showCondition
                let qDependsOnID = question.showCondition.questionID;
                let qDependsOnAnswer = question.showCondition.answer;
                console.log("q depends on ID: ", qDependsOnID, " - and answer: ", qDependsOnAnswer);
                let qDependsOnPair = personalizedQuestionAnswerList.find(item => item.question.id === qDependsOnID)
                if (qDependsOnPair === undefined) { // question that q depends on wasn't shown in the first place
                    console.log('qDependsOnPair === undefined');
                    return false; // skip this question
                }
                else { // question that q depends on was shown before
                    if (qDependsOnPair.question.input.type === 'radio' && qDependsOnAnswer.includes(qDependsOnPair.answer.answer)) {
                        console.log("condition is met for radio!");
                        return true;
                    }
                    else if (qDependsOnPair.question.input.type === 'checkbox') {
                        console.log("checking checkbox condition")
                        if (qDependsOnAnswer.length === qDependsOnPair.answer.answer.length // need to check if two answer arrays are equal
                            && qDependsOnAnswer.every(item => qDependsOnPair.answer.answer.includes(item))
                            && qDependsOnPair.answer.answer.every(item => qDependsOnAnswer.includes(item))
                        ) {
                            console.log("condition is met for checkbox!");
                            return true;
                        }
                        else return false;
                    }
                    else {
                        return false;
                    }
                }
            }
    }

    // this is a function to get the value of the next question, to prepare it to be displayed
    function getNextQuestion(question) {
        let nextQ;
        for (let q of questions) {
            //console.log("q.id: ", q.id, "question.next: ", question.next);
            if (q.id === question.next) {
                nextQ = q;
            }
        }
        console.log("nextQ: ", nextQ);
        if (determineShowConditionOf(nextQ) === false) return getNextQuestion(nextQ);
        else return nextQ;
    }

    // this is a function to remove the HTML elements created for the question after pressing next, to prepare for displaying the next question
    function clearWindow() {
        fieldset.innerHTML = "";
        if(currentQuestion.next === "") {
            document.getElementById('questionnaire-form').remove();
            fieldset = document.createElement('fieldset');
            let legend = document.createElement('legend');
            legend.innerText = "A list of question-answer pairs";
            fieldset.appendChild(legend);
            document.body.appendChild(fieldset);
        }
    }

    function moveToNextQuestion() {
        currentAnswer = getCurrentAnswer();
        console.log("currentAnswer: ", currentAnswer);
        personalizedQuestionAnswerList.push({question: currentQuestion, answer: currentAnswer});
        clearWindow();
        let nextQuestion = getNextQuestion(currentQuestion);
        //console.log("currentQ.next: ", currentQuestion.next);
        if(currentQuestion.next !== "") promptQuestion(nextQuestion);
        if(currentQuestion.next === "") {
            console.log("FINAL QUESTION!!");
            let nextButton = document.getElementById("nextButton");
            nextButton.setAttribute("id", "endButton");
            nextButton.innerText = "End";
        }
    }
    
    function promptFinalResults() {
        clearWindow();
        console.log("personalized list: ", personalizedQuestionAnswerList);
        let resultList = document.createElement('ul');
        fieldset.appendChild(resultList);
        for (let i=0; i<personalizedQuestionAnswerList.length; i++) {
            let item = document.createElement('li');
            item.innerText = "QUESTION: " + personalizedQuestionAnswerList[i].question.question + "      ANSWER: " + personalizedQuestionAnswerList[i].answer;
            resultList.appendChild(item);
        }
    }
    
    if (personalizedQuestionAnswerList.length === 0) {
        currentQuestion = questions[0];
        promptQuestion(currentQuestion);
    }
    
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        if(checkIfCurrentAnswerIsValid()) {
            if(currentQuestion.next !== "") {
                moveToNextQuestion();
            }
            else {
                promptFinalResults();
            }
        }
    })
})