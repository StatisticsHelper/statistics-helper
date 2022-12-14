/**
 * This is a script to control all the action in the questionnaire.
 * I added `window.addEventListener...` to make sure the html is 
 * fully loaded before the script runs. When I tried to listen to
 * button clicks without it, it would give me a TypeError, because
 * the html hadn't loaded yet.
 */

import {exportJson} from './import-export.js'

let personalList = JSON.parse(localStorage.getItem("personalList"));
localStorage.removeItem("personalList");
console.log("personalized list: ", personalList);

let questions = [
    {
        id: "00_Question",
        question: "What is your question? Use this to guide you.",
        required: "Yes",
        input: {
            type: "text",
            condition: "maxlength='100'"
        },
        tags: {
            prefix: "",
            subtitles: []
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
        tags: {
            prefix: "goal",
            subtitles: [
                "descriptive",
                "predictive",
                "inferential",
                "exploratory",
                ""
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
        tags: {
            prefix: "causation",
            subtitles: [
                "association (none implied)",
                "cause-and-effect",
                "none (descriptive)"
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
        tags: {
            prefix: "paper type",
            subtitles: [
                "description of method",
                "critique",
                "good example",
                "general reference",
                "review/comparison/metaanalysis",
                "how to teach",
                "guide to use",
                ""
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
        tags: {
            prefix: "study design",
            subtitles: [
                "",
                "a priori"
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
        tags: {
            prefix: "study design",
            subtitles: [
                "sample size",
                ""
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
        tags: {
            prefix: "study design",
            subtitles: [
                "repeated measures/randomized block/random effects",
                "repeated measures/randomized block",
                "correlation structures"
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
        tags: {
            prefix: "relationship",
            subtitles: [
                "linear",
                "nonlinear"
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
        tags: {
            prefix: "interpretation and meaning",
            subtitles: [
                "",
                "confidence intervals/parameter estimation",
                "cross validation",
                "plotting",
                "significance",
                "exploratory only",
                "post hoc comparisons",
                "diagnostics",
                "unsupervised clustering",
                "effect size, variable importance, loadings"
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
        tags: {
            prefix: "interpretation and meaning",
            subtitles: [
                "statistical power",
                "survey/sampling bias",
                "meeting assumptions",
                "measurement error",
                ""
            ]
        },
        next: ""
    }
]
console.log(questions);

let fieldset = document.getElementById("question-fieldset")
let personalizedQuestionAnswerTagList = [];
let currentQuestion = {};
let currentAnswer = {};
let currentTag = {};    

 window.addEventListener('DOMContentLoaded', () => {

    
    /*  ---------------------------------------------------------------------------------------------
                                    BEGIN - FUNCTION DECLARATIONS
        ---------------------------------------------------------------------------------------------   */

    /** 
     * This function reates and appends HTML elements for a form based on the type of input specified in a question object.
     * @function promptQuestion
     * @param {object} question - The question object containing information about the question and its input.
     * @param {string} question.id - The unique ID of the question.
     * @param {string} question.question - The text of the question.
     * @param {object} question.input - An object containing information about the type and options for the input.
     * @param {string} question.input.type - The type of input. Can be "text", "checkbox", or "radio".
     * @param {string} [question.input.condition] - A condition for the input, if applicable. Currently only applies to text input.
     * @param {string[]} [question.input.options] - An array of options for checkbox or radio input.
     */
    function promptQuestion(question) {
        currentQuestion = question;
        let legend = document.createElement("legend")
        fieldset.appendChild(legend);
        legend.innerText = question.question;

        console.log("currentQuestion: ", question);
        console.log("What's coming?", question.input.type);
        if (question.input.type === "text") {
            console.log("text coming!", question.input.type);
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
            console.log("checkbox coming!", question.input.type);
            let numOptions = question.input.options.length;
            fieldset.setAttribute("required", "required");
            for (let i = 0; i < numOptions; i++) {
                let option = question.input.options[i];
                console.log("option: ", option);
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
            console.log("radio coming!", question.input.type);
            let numOptions = question.input.options.length;
            for (let i=0; i<numOptions; i++) {
                let option = question.input.options[i];
                console.log("option: ", option);
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
    
    /**
     * This function validates the answer to the current question based on the input type.
     * @function checkIfCurrentAnswerIsValid
     * @returns {boolean} - Returns true if the answer is valid, false if not.
     */
    function checkIfCurrentAnswerIsValid() {
        // for text input
        if (currentQuestion.input.type === "text") {
            var inputField = document.querySelector('fieldset input[type=text]');
            if (inputField.value === '') {
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
              return false;
            }
        }
        return true;
    }

    /**
     * This function retrieves the answer for the current question based on the input type, 
     *       then appends it to the `personalizedQuestionAnswerTagList` array.
     * @function getCurrentAnswer
     * @returns {Object} - Returns an object containing the type of input and the answer.
     */
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
            let radios = document.getElementsByName(`${currentQuestion.id}-options`);
            for (let i=0; i<radios.length; i++) {
                let box = radios[i];
                if(box.checked) result.answer = document.getElementById(`${currentQuestion.id}-label${i+1}`).innerText;
            }
        }
        return result;
    }

    /**
     * This function retrieves the tag associated with the current answer based on the input type, 
     *       then appends it to the personalizedQuestionAnswerTagList array.
     * @function getTagFromCurrentAnswer
     * @returns {Object} - Returns an object containing the prefix and subtitles of the tag.
     */
    function getTagFromCurrentAnswer() {
        console.log("getting tags...")
        let result = {prefix: currentQuestion.tags.prefix};
        if (currentQuestion.input.type === "text") {
            console.log("text - no tag");
            result.subtitles = "";
        }
        else if (currentQuestion.input.type === "checkbox") {
            let subtitleArray = [];
            for (let i=0; i<currentQuestion.input.options.length; i++) {
                for (let j=0; j<currentAnswer.answer.length; j++) {
                    //console.log(`${i+1}-th option: `, currentQuestion.input.options[i], `${j+1}-th currentAnswer: `, currentAnswer.answer[j]);
                    if (currentQuestion.input.options[i] === currentAnswer.answer[j]) {
                        console.log("tag-option: ", i+1);
                        subtitleArray.push(currentQuestion.tags.subtitles[i]);
                    }
                }
            }
            result.subtitles = subtitleArray;
        }
        else if (currentQuestion.input.type === "radio") {
            for (let i=0; i<currentQuestion.input.options.length; i++) {
                //console.log(`${i+1}-th option: `, currentQuestion.input.options[i], `${i+1}-th currentAnswer: `, currentAnswer.answer);
                if (currentQuestion.input.options[i] === currentAnswer.answer) {
                    console.log("tag-option: ", i+1);
                    result.subtitles = currentQuestion.tags.subtitles[i];
                }
            }
        }
        return result;
    }

    /**
     * This function determines whether to show a question or not based on the required field in the question object 
     *       and the showCondition field in the question object.
     * @function determineShowConditionOf
     * @param {Object} question - a question object
     * @returns {Boolean} - true if question should be shown, false if question should be skipped
    */
    function determineShowConditionOf(question) {
            if (question.required === "Yes") return true;

            else { // question is not required --> check showCondition
                let qDependsOnID = question.showCondition.questionID;
                let qDependsOnAnswer = question.showCondition.answer;
                console.log("q depends on ID: ", qDependsOnID, " - and answer: ", qDependsOnAnswer);
                let qDependsOnPair = personalizedQuestionAnswerTagList.find(item => item.question.id === qDependsOnID)
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

    /**
     * This function retrieves the next question to be displayed based on the `next` property of the current question. 
     *      If the `showCondition` property of the next question is not met, the function will recursively 
     *      call itself with the next question as the argument.
     * @function getNextQuestion
     * @param {Object} question - The current question object.
     * @returns {Object} - Returns the next question object that should be displayed.
     */
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

    /**
     * This function removes the HTML elements created for the current question after pressing the next button,
     *      to prepare for displaying the next question. If the next question does not exist, 
     *      removes the questionnaire form and creates a new fieldset with a legend for a list of 
     *      question-answer-tag triplets.
     * @function clearWindow - 
     */
    function clearWindow() {
        fieldset.innerHTML = "";
        if( personalizedQuestionAnswerTagList[personalizedQuestionAnswerTagList.length-1].question.next === "") {
            document.getElementById('questionnaire-form').remove();
            fieldset = document.createElement('fieldset');
            let legend = document.createElement('legend');
            legend.innerText = "A list of question-answer-tag triplets";
            fieldset.appendChild(legend);
            document.body.appendChild(fieldset);
            document.body.insertBefore(fieldset, document.getElementById('exportButton'));
        }
    }

    /**
     * This function retrieves the current answer, current tag, and pushes it to the personalizedQuestionAnswerTagList array.
     *      Then, it clears the window, retrieves the next question, and prompts it.
     *      If the current question is the final one, it changes the text and id of the button to 'End'.
     * @function moveToNextQuestion
     */
    function moveToNextQuestion() {
        currentAnswer = getCurrentAnswer();
        currentTag = getTagFromCurrentAnswer();
        console.log("currentAnswer: ", currentAnswer);
        console.log("currentTag: ", currentTag);
        personalizedQuestionAnswerTagList.push({question: currentQuestion, answer: currentAnswer, tag: currentTag});
        clearWindow();
        let nextQuestion = getNextQuestion(currentQuestion);
        if(currentQuestion.next !== "") promptQuestion(nextQuestion);
        if(currentQuestion.next === "") {
            console.log("FINAL QUESTION!!");
            let nextButton = document.getElementById("nextButton");
            nextButton.setAttribute("id", "endButton");
            nextButton.innerText = "End";
        }
    }
    
    /**
     * This function prompts the final list of question-answer-tag pairs on the page.
     * @function promptFinalResults
     */
    function promptFinalResults() {
        clearWindow();
        console.log("personalized list: ", personalizedQuestionAnswerTagList);
        let resultList = document.createElement('ul');
        fieldset.appendChild(resultList);
        for (let i=0; i<personalizedQuestionAnswerTagList.length; i++) {
            let item = document.createElement('li');
            item.innerText = "QUESTION: " + personalizedQuestionAnswerTagList[i].question.question + "\n" 
            + "ANSWER: " + JSON.stringify(personalizedQuestionAnswerTagList[i].answer.answer) + "\n"
            + "TAG-prefix: " + personalizedQuestionAnswerTagList[i].tag.prefix + "\n" 
            + "TAG-subtitle(s): " + JSON.stringify(personalizedQuestionAnswerTagList[i].tag.subtitles) + "\n\n\n";
            resultList.appendChild(item);
        }
    }

    /*  ---------------------------------------------------------------------------------------------
                                    END - FUNCTION DECLARATIONS
        ---------------------------------------------------------------------------------------------   */
    /**
     * Start prompting questions
     */
    if (personalList !== null) {
        personalizedQuestionAnswerTagList = personalList;
        let nextQuestion = personalizedQuestionAnswerTagList[personalizedQuestionAnswerTagList.length - 1].question.next;
        console.log("imported -- last question was: ", personalizedQuestionAnswerTagList[personalizedQuestionAnswerTagList.length - 1]);
        console.log("personalList: ", personalList, " --- personalizedQATList: ", personalizedQuestionAnswerTagList);
        console.log("next is: ", nextQuestion === '', nextQuestion);
        console.log("index is: ", questions.findIndex(q => q.id === nextQuestion), questions)
        currentQuestion = questions[questions.findIndex(q => q.id === nextQuestion)];
        console.log("Resuming - current is: ", currentQuestion);
        if (nextQuestion === '') {
            promptFinalResults();
        }
        else promptQuestion(currentQuestion);
    }
    else {
        currentQuestion = questions[0];
        promptQuestion(currentQuestion);
        console.log("Starting -- current is: ", currentQuestion);
    }


    /**
     * The submit event listener prevents the default refresh of the page upon submission
     * and calls the `checkIfCurrentAnswerIsValid` function.
     */
    document.getElementById('nextButton')?.addEventListener('click', (event) => {
        event.preventDefault();
        if(checkIfCurrentAnswerIsValid()) {
            if(currentQuestion.next !== "") {
                moveToNextQuestion();
            }
            else {
                currentAnswer = getCurrentAnswer();
                currentTag = getTagFromCurrentAnswer();
                console.log("currentAnswer: ", currentAnswer);
                console.log("currentTag: ", currentTag);
                personalizedQuestionAnswerTagList.push({question: currentQuestion, answer: currentAnswer, tag: currentTag});
                promptFinalResults();
            }
        }
        else if (currentQuestion.input.type === "text")         alert('Please enter a value!');
        else if (currentQuestion.input.type === "checkbox")     alert('Please select at least one option!');
        else if (currentQuestion.input.type === "radio")        alert('Please select an option!');
        else                                                    alert('The question input is not any of: text, checkbox, or radio!');
    })

    /*  ---------------------------------------------------------------------------------------------
                                    BEGIN - EXPORT
        ---------------------------------------------------------------------------------------------   */
    document.getElementById('exportButton')?.addEventListener('click', (event) => {

        console.log("exporting -- currQ: ", currentQuestion);

        if(checkIfCurrentAnswerIsValid()) {
            currentAnswer = getCurrentAnswer();
            currentTag = getTagFromCurrentAnswer();
            console.log("exporting -- currA: ", currentAnswer);
            console.log("exporting -- currT: ", currentTag);
            personalizedQuestionAnswerTagList.push({question: currentQuestion, answer: currentAnswer, tag: currentTag});
        }

        localStorage.setItem("exportList", JSON.stringify(personalizedQuestionAnswerTagList));
        exportJson(event);
    });
    /*  ---------------------------------------------------------------------------------------------
                                    END - EXPORT
        ---------------------------------------------------------------------------------------------   */
})