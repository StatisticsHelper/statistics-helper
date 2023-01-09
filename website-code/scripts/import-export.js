export function importJson (event) {
    event.preventDefault();
    alert('uploading -- under construction');
    const form = document.getElementById("resumeForm");
    const fileInput = document.getElementById('json-file');
    console.log("uploading check", form, fileInput);

    // Get the file input element
    console.log("uploading check", fileInput);

    // Check if a file was selected
    if (fileInput.files.length > 0) {
        // Get the selected file
        const file = fileInput.files[0];
        
        // Create a FileReader object
        const reader = new FileReader();

        // Read the file as text
        reader.readAsText(file);
        
        // Set the onload handler
        reader.onload = () => {
            // Parse the JSON content
            let importList = JSON.parse(reader.result);
            if(Array.isArray(importList)) {
                console.log("JSON uploaded successfully!", importList);
                localStorage.setItem("personalList", JSON.stringify(importList));
                window.location.replace("html/questionnaire.html");
            }
            else {
                console.log("What you uploaded was not an array of question-answer-tag triplet objects.");
            }
        };
    }
    else {
        alert("You didn't upload a json file.");
    }
};

export function exportJson (event) {
    event.preventDefault();
    console.log("event is: ", event)
    let exportList = JSON.parse(localStorage.getItem("exportList"));
    localStorage.removeItem("exportList");
    console.log("import-export module - QAT list: ", exportList);

    // Convert the personalizedQuestionAnswerTagList array to a JSON string
    const jsonString = JSON.stringify(exportList);

    // Create a link element
    const link = document.createElement('a');

    // Set the link's href attribute to a data URI that contains the JSON string
    link.href = `data:text/json;charset=utf-8,${encodeURIComponent(jsonString)}`;

    // Set the link's download attribute to the desired file name
    link.download = 'personalizedQuestionAnswerTagList.json';

    // Append the link to the document
    document.body.appendChild(link);

    // Use the link's click() method to trigger the download
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
};