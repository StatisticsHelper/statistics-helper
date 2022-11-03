# Workplan for Statistics Helper

## Information about the project
The aim of this project is to deliver a website that prompts users with a questionnaire and curates a personalized list of resources/tools based on each user's answer.
Click [here](https://osf.io/5y8fb/) to see project abstract.

| Document Created  | November 3, 2022                  |
| ----------------- | --------------------------------- |
| Project Title     | OU Libraries Statistics Helper    |
| Project Leader    | Claire Curry                      |
| Institution       | University of Oklahoma Libraries  |
| Project Developer | Ahmed Sharaf                      |
| Start & End Dates | September 19, 2022 - May 31, 2023 |

## Past Accomplishments

### prior to Sept 19
* A layout for the website has been designed and can be found [here](https://www.figma.com/file/ydIbxApss3UoDBTOBezinF/mockups?node-id=0%3A1).
* An initial resource list has been prepared and can be found [here](https://www.zotero.org/groups/2547147/statistics_helper/library).
* A list of questions has been prepared and can be found [here](https://docs.google.com/spreadsheets/d/10-GktYN9V5_X4UK-dhelnibxPpyNgm3WT5lhReykDDI/edit#gid=2126185293).
* A GitHub organization has been created and can be found [here](https://github.com/StatisticsHelper).

### September 19 to November 3
* Hired & onboarded developer to build the website.
* Developer drafted architecture diagram & workplan for the website.
* Developer set up the development & hosting environments for the website (GH repo & hosting server).
* Developer created a test tool to get familiarized with Zotero API using JavaScript.
* Developer trained to utilize tools for creating an accessible website.

## Future Milestones

### 1) Accessible front-end
Expected by: December 15, 2022

Deliverables:
1) A UI that takes user from homepage through the questionnaire and to the page containing the list of resources.
    * For each question, the page should display the tags determined based on previously answered questions for now.
    * No import/export modules for now.
2) The UI meets WCAG 2.1 for accessibility.
    * Developer will meet with MicroAssist consulting to test the UI for accessibility.



### 2) Import/export functions enabled on the front-end
Expected by: February 15, 2023

Deliverables:
1) At the end of the questionnaire, users are allowed to export (download) a JSON file containing question-answer pairs.
2) During each question, users will be allowed to export (download) the question-answer JSON file containing previously answered questions.
3) In the home page, users are allowed to import (upload)
4) The UI (with import/export) meets WCAG 2.1 for accessibility.
    * Developer will meet with MicroAssist consulting to test the UI for accessibility.



### 3) A fully functional prototype
Expected by: April 15, 2023

Deliverables:
1) API calls made after every question to update the list with Zotero-library resources
    * This is based on the list of tags that used to be displayed in Milestone 1.
3) During each question, users will be allowed to export (download) two files:
    i.  a JSON file of question-answer pairs up to the previous question.
    ii. a `.ris` file (bibliography format) that users can load into Zotero to display their personalized list of resources.
4) The prototype meets WCAG 2.1 for accessibility.
    * Developer will meet with MicroAssist consulting to test the UI for accessibility.



### 4) Styling & final touches:
Expected by: May 7, 2023

Deliverables:
1) A website ready to use and is fully styled.
2) The website meets WCAG 2.1 for accessibility.
    * Developer will meet with MicroAssist consulting to test the UI for accessibility.



### 5) Testing & deployment:
Expected by: May 31, 2023

Deliverables:
1) Continuous testing to make sure the website has no issues.
2) Website deployed & can be used by the public.
