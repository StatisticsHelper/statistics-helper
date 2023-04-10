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
    let exportResources = JSON.parse(localStorage.getItem("exportResources"));
    localStorage.removeItem("exportList");
    localStorage.removeItem("exportResources");
    console.log("import-export module - QAT list: ", exportList);
    console.log("import-export module - resource list: ", exportResources);

    // Convert the QAT and resource arrays to a JSON string
    const jsonStringQAT = JSON.stringify(exportList);
    const jsonStringResources = JSON.stringify(exportResources);
    
    // 1. Download QAT list
    
    // Create a link element
    const qatLink = document.createElement('a');

    // Set the link's href attribute to a data URI that contains the JSON strings
    qatLink.href = `data:text/json;charset=utf-8,${encodeURIComponent(jsonStringQAT)}`;

    // Set the link's download attribute to the desired file name
    qatLink.download = 'personalizedQuestionAnswerTagList.json';

    // Append the link to the document
    document.body.appendChild(qatLink);

    // Use the link's click() method to trigger the download
    qatLink.click();

    // Remove the link from the document
    document.body.removeChild(qatLink);

    // 2. Download Resource list

    // Create a link element
    const resourceLink = document.createElement('a');

    // Set the link's href attribute to a data URI that contains the JSON strings
    resourceLink.href = `data:text/json;charset=utf-8,${encodeURIComponent(jsonStringResources)}`;

    // Set the link's download attribute to the desired file name
    resourceLink.download = 'resourceList.json';

    // Append the link to the document
    document.body.appendChild(resourceLink);

    // Use the link's click() method to trigger the download
    resourceLink.click();

    // Remove the link from the document
    document.body.removeChild(resourceLink);
};