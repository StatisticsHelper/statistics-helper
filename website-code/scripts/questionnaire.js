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
// console.log("personalized list: ", personalList);

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
// console.log(questions);

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

        // console.log("currentQuestion: ", question);
        // console.log("What's coming?", question.input.type);
        if (question.input.type === "text") {
            // console.log("text coming!", question.input.type);
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
            // console.log("checkbox coming!", question.input.type);
            let numOptions = question.input.options.length;
            fieldset.setAttribute("required", "required");
            for (let i = 0; i < numOptions; i++) {
                let option = question.input.options[i];
                // console.log("option: ", option);
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
            // console.log("radio coming!", question.input.type);
            let numOptions = question.input.options.length;
            for (let i=0; i<numOptions; i++) {
                let option = question.input.options[i];
                // console.log("option: ", option);
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
        // console.log("getting tags...")
        let result = {prefix: currentQuestion.tags.prefix};
        if (currentQuestion.input.type === "text") {
            // console.log("text - no tag");
            result.subtitles = "";
        }
        else if (currentQuestion.input.type === "checkbox") {
            let subtitleArray = [];
            for (let i=0; i<currentQuestion.input.options.length; i++) {
                for (let j=0; j<currentAnswer.answer.length; j++) {
                    //// console.log(`${i+1}-th option: `, currentQuestion.input.options[i], `${j+1}-th currentAnswer: `, currentAnswer.answer[j]);
                    if (currentQuestion.input.options[i] === currentAnswer.answer[j]) {
                        // console.log("tag-option: ", i+1);
                        subtitleArray.push(currentQuestion.tags.subtitles[i]);
                    }
                }
            }
            result.subtitles = subtitleArray;
        }
        else if (currentQuestion.input.type === "radio") {
            for (let i=0; i<currentQuestion.input.options.length; i++) {
                //// console.log(`${i+1}-th option: `, currentQuestion.input.options[i], `${i+1}-th currentAnswer: `, currentAnswer.answer);
                if (currentQuestion.input.options[i] === currentAnswer.answer) {
                    // console.log("tag-option: ", i+1);
                    result.subtitles = currentQuestion.tags.subtitles[i];
                }
            }
        }
        return result;
    }

    /**
     * This function adds a QAT object to personalizedQuestionAnswerTagList.
     * I used this instead of Array.push() to check for duplicate entries.
    * @function pushToQATList
    * @param {Object} qat - The element to be added to the array.
    * @returns {undefined}
    */
    function pushToQATList(qat) {
        let sizeOfQATList = personalizedQuestionAnswerTagList.length;
        if (sizeOfQATList === 0) personalizedQuestionAnswerTagList.push(qat);
        else {
            let duplicateFound = personalizedQuestionAnswerTagList.find(item => item.question.id === qat.question.id) !== undefined;
            // console.log("list is not empty, duplicateFound? ", duplicateFound);
            if (duplicateFound === false) personalizedQuestionAnswerTagList.push(qat);
        }
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
                // console.log("q depends on ID: ", qDependsOnID, " - and answer: ", qDependsOnAnswer);
                let qDependsOnPair = personalizedQuestionAnswerTagList.find(item => item.question.id === qDependsOnID)
                if (qDependsOnPair === undefined) { // question that q depends on wasn't shown in the first place
                    // console.log('qDependsOnPair === undefined');
                    return false; // skip this question
                }
                else { // question that q depends on was shown before
                    if (qDependsOnPair.question.input.type === 'radio' && qDependsOnAnswer.includes(qDependsOnPair.answer.answer)) {
                        // console.log("condition is met for radio!");
                        return true;
                    }
                    else if (qDependsOnPair.question.input.type === 'checkbox') {
                        // console.log("checking checkbox condition")
                        if (qDependsOnAnswer.length === qDependsOnPair.answer.answer.length // need to check if two answer arrays are equal
                            && qDependsOnAnswer.every(item => qDependsOnPair.answer.answer.includes(item))
                            && qDependsOnPair.answer.answer.every(item => qDependsOnAnswer.includes(item))
                        ) {
                            // console.log("condition is met for checkbox!");
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
            //// console.log("q.id: ", q.id, "question.next: ", question.next);
            if (q.id === question.next) {
                nextQ = q;
            }
        }
        // console.log("nextQ: ", nextQ);
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
        let sizeOfQATList = personalizedQuestionAnswerTagList.length;
        if( sizeOfQATList > 0 && personalizedQuestionAnswerTagList[sizeOfQATList-1].question.next === "") {
            document.getElementById('questionnaire-form').remove();
            fieldset = document.createElement('fieldset');
            let legend = document.createElement('legend');
            legend.innerText = "A list of question-answer-tag triplets";
            fieldset.appendChild(legend);
            document.body.querySelector("main").appendChild(fieldset);
            document.body.querySelector("main").insertBefore(fieldset, document.getElementById('exportButton'));
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
        // console.log("currentAnswer: ", currentAnswer);
        // console.log("currentTag: ", currentTag);
        pushToQATList({question: currentQuestion, answer: currentAnswer, tag: currentTag});
        clearWindow();
        let nextQuestion = getNextQuestion(currentQuestion);
        if(currentQuestion.next !== "") promptQuestion(nextQuestion);
        if(currentQuestion.next === "") {
            // console.log("FINAL QUESTION!!");
            let nextButton = document.getElementById("nextButton");
            nextButton.setAttribute("id", "endButton");
            nextButton.innerText = "End";
        }
    }

    /**
     * This function moves back to the previous question. It removes the last QAT item (of the previous question),
     *      and prompts it again.
     * @function moveToPreviousQuestion
     */
    function moveToPreviousQuestion() {
        let prevQuestion = personalizedQuestionAnswerTagList[personalizedQuestionAnswerTagList.length-1].question;
        personalizedQuestionAnswerTagList.pop();
        // console.log("prevQuestion: ", prevQuestion);
        clearWindow();
        promptQuestion(prevQuestion);
    }
    
    /**
     * This function prompts the final list of question-answer-tag pairs on the page.
     * @function promptFinalResults
     */
    function promptFinalResults() {
        clearWindow();
        // console.log("personalized list: ", personalizedQuestionAnswerTagList);
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
        // console.log("imported -- last question was: ", personalizedQuestionAnswerTagList[personalizedQuestionAnswerTagList.length - 1]);
        // console.log("personalList: ", personalList, " --- personalizedQATList: ", personalizedQuestionAnswerTagList);
        // console.log("next is: ", nextQuestion === '', nextQuestion);
        // console.log("index is: ", questions.findIndex(q => q.id === nextQuestion), questions)
        currentQuestion = questions[questions.findIndex(q => q.id === nextQuestion)];
        // console.log("Resuming - current is: ", currentQuestion);
        if (nextQuestion === '') {
            promptFinalResults();
        }
        else promptQuestion(currentQuestion);
    }
    else {
        currentQuestion = questions[0];
        promptQuestion(currentQuestion);
        // console.log("Starting -- current is: ", currentQuestion);
    }

    document.getElementById('previousButton')?.addEventListener('click', (event) => {
        event.preventDefault();
        if(personalizedQuestionAnswerTagList.length === 0) alert("Nice try, but there's no previous question!");
        else moveToPreviousQuestion();
    })

    document.getElementById('nextButton')?.addEventListener('click', (event) => {
        event.preventDefault();
        if(checkIfCurrentAnswerIsValid()) {
            if(currentQuestion.next !== "") {
                moveToNextQuestion();
            }
            else {
                currentAnswer = getCurrentAnswer();
                currentTag = getTagFromCurrentAnswer();
                // console.log("currentAnswer: ", currentAnswer);
                // console.log("currentTag: ", currentTag);
                pushToQATList({question: currentQuestion, answer: currentAnswer, tag: currentTag});
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
            
            // console.log("exporting -- currQ: ", currentQuestion);
            
            if(checkIfCurrentAnswerIsValid()) {
                currentAnswer = getCurrentAnswer();
                currentTag = getTagFromCurrentAnswer();
                // console.log("exporting -- currA: ", currentAnswer);
                // console.log("exporting -- currT: ", currentTag);
                pushToQATList({question: currentQuestion, answer: currentAnswer, tag: currentTag});
            }
            
            localStorage.setItem("exportList", JSON.stringify(personalizedQuestionAnswerTagList));
            exportJson(event);
        });
        /*  ---------------------------------------------------------------------------------------------
                                    END - EXPORT
        ---------------------------------------------------------------------------------------------   */

    /*  ---------------------------------------------------------------------------------------------
                                    BEGIN - DISPLAY RELEVANT PAPERS
        ---------------------------------------------------------------------------------------------   */
        let relevantResourcesSection = document.getElementById('relevant-resources-list');
        
        // set the file path
        const filePath = '../pyzotero/items.json';

        fetch(filePath)
        .then(async response => {
            let papers = await response.json();
            display(papers);
            paginateDisplay(papers, 50);
            //displayRelevant(papers, 10, 19);
        })
        .catch(error => console.error("Error happened while reading Pyzotero paper list", error));

        // This function presupposes that all elements are loaded onto HTML.
        function paginateDisplay(papers, pageSize) {
            // figure out the number of pages
            let numberOfPages = Math.ceil(papers.length / pageSize);

            // create a button for each page
            let buttonsSection = document.getElementById('pagination-buttons');
            for (let page = 0; page < numberOfPages; page++) {
                let pageButton = document.createElement('button');
                pageButton.setAttribute('id', `page-${page+1}-button`);
                pageButton.innerText = page + 1;
                let initialIndex = page * pageSize;
                let finalIndex = initialIndex + pageSize - 1;
                pageButton.addEventListener('click', () => displayRelevant(papers, page, pageSize));
                buttonsSection.appendChild(pageButton);
            }

            // by default, display the first page
            displayRelevant(papers, 0, pageSize);
        }

        // This function presupposes that all elements are loaded onto HTML
        //  but they're all hidden in display.
        // It shows relevant presources whenever a user clicks a page number.
        // I added two arguments so that it decides which papers to display
        //  in a paginated display system with a certain number of pages
        //  and a number of resources to display per page (e.g., 50).
        function displayRelevant(papers, page, pageSize) {
            // nothing to do if there are no resources to display
            if (!papers || papers.length === 0) {
                console.log("No papers found");
                return;
            }
            let initialIndex = page * pageSize;
            let finalIndex = initialIndex + pageSize - 1;
            let relevantPapers = papers.slice(initialIndex, finalIndex + 1);
            console.log(`began displaying ${relevantPapers.length} papers from [${initialIndex}] to [${finalIndex}]: ${relevantPapers}`);
            
            // first, make sure all articles are hidden
            papers.forEach( paper => {
                let article = document.getElementById(`resource-${papers.indexOf(paper)}`);
                if (article != null) article.style.display = 'none';
                let hrule = document.getElementById(`resource-${papers.indexOf(paper)}-hrule`);
                if (hrule != null) hrule.style.display = 'none';
            });
            
            // then, display only the relevant articles
            relevantPapers.forEach( paper => {
                console.log(`we have paper at index: ${relevantPapers.indexOf(paper)} of relevantPapers and index: ${papers.indexOf(paper)} of papers.`);
                console.log(`displaying article at index: ${papers.indexOf(paper)}`);
                let article = document.getElementById(`resource-${papers.indexOf(paper)}`);
                if (article != null) article.style.display = 'block';
                let hrule = document.getElementById(`resource-${papers.indexOf(paper)}-hrule`);
                if (hrule != null) hrule.style.display = 'block';
            });
            console.log(`finished displaying ${relevantPapers.length} papers from [${initialIndex}] to [${relevantPapers.length - 1}]: ${relevantPapers}`);

            // modify header so it shows current page number
            let currentPageHeader = document.getElementById('relevant-resources-list-header');
            currentPageHeader.innerText = `List of Resources (current page: ${page+1})`;
        }

        // This function takes an array of objects
        //  namely, papers fetched from the Pyzotero API,
        //  and displays them on screen.
        function display(papers) {

            papers.forEach (paper => {

                /**
                 * Create new article for the current resource
                 */
                let article = document.createElement('article');
                article.setAttribute('id', `resource-${papers.indexOf(paper)}`);
                relevantResourcesSection.appendChild(article);

                /**
                 * Create header (to contain title & toggle button) for current resource
                 */
                let resourceHeader = document.createElement('h3');
                article.appendChild(resourceHeader);

                /**
                 * Create title for current resource
                 */
                let title = document.createElement('span');
                title.innerText = `${paper.data.title}`;

                /**
                 * Create button to toggle display of collapsible table (relevant info, look below)
                 */
                let toggleInfoButton = document.createElement('button');
                toggleInfoButton.setAttribute('id', `resource-${papers.indexOf(paper)}-toggle`);
                toggleInfoButton.setAttribute('type', 'button');
                toggleInfoButton.setAttribute('aria-expanded', 'false');
                toggleInfoButton.setAttribute('aria-controls', `resource-${papers.indexOf(paper)}-info`);
                
                /**
                 * Put title in toggle button, and put them both in resource header
                 */
                toggleInfoButton.appendChild(title);
                resourceHeader.appendChild(toggleInfoButton);

                /**
                 * Create a table for relevant info 
                 */
                let resourceInfo = document.createElement('table');
                resourceInfo.setAttribute('id', `resource-${papers.indexOf(paper)}-info`);
                resourceInfo.setAttribute('role', 'presentation') // block screen reader from reading this as table
                resourceInfo.setAttribute('aria-labelledby', `resource-${papers.indexOf(paper)}-toggle`);
                resourceInfo.setAttribute('style', 'display: none');
                article.appendChild(resourceInfo);

                /**
                 * Set button to toggle display 
                 */
                toggleInfoButton.addEventListener('click', () => {
                    if (resourceInfo.style.display === 'block') {
                        toggleInfoButton.setAttribute('aria-expanded', 'false');
                        resourceInfo.style.display = 'none';
                    }    
                    else {
                        toggleInfoButton.setAttribute('aria-expanded', 'true');
                        resourceInfo.style.display = 'block';
                    }    
                })    

                /**
                 * Create relevant info for current resource 
                 */

                // type
                let type = paper.data.itemType;
                let typeSection = document.createElement('section');
                typeSection.setAttribute('id', `resource-${papers.indexOf(paper)}-info-type`);
                let typeSectionHeader = document.createElement('h4');
                typeSectionHeader.innerText = 'Resource Type';
                typeSection.appendChild(typeSectionHeader);
                let typeSectionContent = document.createElement('p');
                typeSectionContent.innerText = type;
                typeSection.appendChild(typeSectionContent);

                // authors
                let authors = paper.data.creators;
                let authorsSection = document.createElement('section');
                authorsSection.setAttribute('id', `resource-${papers.indexOf(paper)}-info-authors`);
                let authorsSectionHeader = document.createElement('h4');
                authorsSectionHeader.innerText = 'Author(s)';
                authorsSection.appendChild(authorsSectionHeader);
                let authorsSectionContent = document.createElement('p');
                authors?.forEach(author => {
                    authorsSectionContent.innerHTML += `${author.firstName} ${author.lastName} <br>`;
                });    
                authorsSection.appendChild(authorsSectionContent);

                // abstract
                let abstract = paper.data.abstractNote;
                let abstractSection = document.createElement('section');
                abstractSection.setAttribute('id', `resource-${papers.indexOf(paper)}-info-abstract`);
                let abstractSectionHeader = document.createElement('h4');
                abstractSectionHeader.innerText = 'Abstract';
                abstractSection.appendChild(abstractSectionHeader);
                let abstractSectionContent = document.createElement('p');
                abstractSectionContent.innerText = abstract;
                abstractSection.appendChild(abstractSectionContent);

                // year
                let year = paper.data.year;
                let yearSection = document.createElement('section');
                yearSection.setAttribute('id', `resource-${papers.indexOf(paper)}-info-year`);
                let yearSectionHeader = document.createElement('h4');
                yearSectionHeader.innerText = 'Year';
                yearSection.appendChild(yearSectionHeader);
                let yearSectionContent = document.createElement('p');
                yearSectionContent.innerText = year;
                yearSection.appendChild(yearSectionContent);

                /**
                 * Create rows for all info
                 */
                let typeRow = document.createElement('tr');
                typeRow.appendChild(typeSection);
                let authorsRow = document.createElement('tr');
                authorsRow.appendChild(authorsSection);
                let abstractRow = document.createElement('tr');
                abstractRow.appendChild(abstractSection);
                let yearRow = document.createElement('tr');
                yearRow.appendChild(yearSection);

                /**
                 * Put info rows in the table
                 */
                resourceInfo.appendChild(typeRow);
                resourceInfo.appendChild(authorsRow);
                resourceInfo.appendChild(abstractRow);
                resourceInfo.appendChild(yearRow);

                // add horizontal rule to separate papers visually
                let hrule = document.createElement('hr');
                hrule.setAttribute('id', `resource-${papers.indexOf(paper)}-hrule`);
                relevantResourcesSection.appendChild(hrule);

            });
        }
})