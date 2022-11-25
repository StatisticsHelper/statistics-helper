# Phase 1: Accessible Front-end

Phase 1 of the project is an accessible front-end with no import/export modules or API calls.
I’m dividing Phase 1 into parts that are clearer to plan and deal with.
Each part will build on the previous one, until Phase 1 is complete.
Each part will also be made up of two sections: 1) Specs, and 2) Steps.
Specs describes the goals for the part, and Steps is a series of steps to accomplish the Specs.

## Part 1: Preliminary UI
For Part 1, I'm building a preliminary UI with two features:
1) Display questions to the user and show answers at the end of the quiz.
2) Some questions may (or may not) be shown, depending on answers to previous questions.


**SPECS**

I want to build an online quiz.
When a user answers a question, the next question shows up.
Some of the questions depend on answers to previous questions – 
  that is, a user may answer a multiple-choice question with a certain option (A), 
  which then triggers a question to show up that wouldn’t show up if the user had chosen any other option (B, C, etc.) on the previous question. 
However, the triggered questions don’t necessarily show up right after the current question (i.e., questions are not displayed out of list order).
Some of the questions will be multiple-choice questions. Some of these MCQs will only accept one answer, while some can accept more than one.

**STEPS**
1. Store a pre-specified list of questions.
    - Some of the questions depend on previous ones. Store whether a question is dependent, and the question it depends on.
3. Store a pre-specified list of answers.
    - Answers will be linked to questions, where a single question can be linked to >1 answer.
    - The list contains 4 categories of data for every answer:
      1.  the current question whose answer this is,
      2.  the content of the answer,
      3.  whether this question has a dependent question, and
      4.  whether this answer triggers the dependent question (if it exists).
5. Choose a question from the list to become the current question (e.g., Q#1).
6. Prompt the user with the current question.
7. Store the answer to current question, alongside the current question itself, to display at the end of the quiz.
8. Update questions & answers lists.
    1.  Does the current question have dependent questions?
        - YES?  Continue to Step 6.2.
        - NO?   Move to Step 7.
    3.  Does this answer trigger the dependent question?
        - YES?  Move to Step 7.
        - NO?
            1.  Remove the dependent question from the questions list.
            2.  Remove all answers linked to the dependent question from the answers list.
10. Repeat steps 3-6 until all questions are displayed.
11. Display to the user all of the question-answer pairs when the quiz is over.
