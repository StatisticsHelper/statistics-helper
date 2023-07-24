export function importJson (event) {
    event.preventDefault();
    const fileInput = document.getElementById('json-file'); 

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
    downloadQAT();
    downloadResources();
};

function downloadQAT () {
    let exportList = JSON.parse(localStorage.getItem("exportList"));
    localStorage.removeItem("exportList");

    // Convert the QAT array to a JSON string
    const jsonStringQAT = JSON.stringify(exportList);

    // Create a link element
    const qatLink = document.createElement('a');

    // Set the link's href attribute to a data URI that contains the JSON string
    qatLink.href = `data:text/json;charset=utf-8,${encodeURIComponent(jsonStringQAT)}`;

    // Set the link's download attribute to the desired file name
    qatLink.download = 'personalizedQuestionAnswerTagList.json';

    // Append the link to the document
    document.body.appendChild(qatLink);

    // Use the link's click() method to trigger the download
    qatLink.click();

    // Remove the link from the document
    document.body.removeChild(qatLink);
}

function downloadResources () {
    let exportResources = JSON.parse(localStorage.getItem("exportResources"));
    localStorage.removeItem("exportResources");

    // Convert the resource arrays to an RIS string
    const risList = convertToRIS(exportResources);

    // Create a link element
    const resourceLink = document.createElement('a');

    // Set the link's href attribute to a data URI that contains the RIS string
    resourceLink.href = `data:text/plain;charset=utf-8,${encodeURIComponent(risList)}`;

    // Set the link's download attribute to the desired file name
    resourceLink.download = 'resourceList.ris';

    // Append the link to the document
    document.body.appendChild(resourceLink);

    // Use the link's click() method to trigger the download
    resourceLink.click();

    // Remove the link from the document
    document.body.removeChild(resourceLink);
}

function convertToRIS(resources) {
    console.log(resources.length);

    // create string to store result RIS
    let result = "";

    // convert to RIS & store in result
    for (let i = 0; i < resources.length; i++) {
        let currentResource = resources[i];
        let resourceType = currentResource.data.itemType;
    
        if (resourceType == "journalArticle")   result += journalArticleToRIS(currentResource);
        else if (resourceType == "book")        result += bookToRIS(currentResource);
        else if (resourceType == "bookSection") result += bookSectionToRIS(currentResource);
        else if (resourceType == "webpage")     result += webpageToRIS(currentResource);
        else if (resourceType == "forumPost")   result += webpageToRIS(currentResource);
        else if (resourceType == "blogPost")    result += webpageToRIS(currentResource);
    }

    // return result
    console.log(result);
    return result;
}

function journalArticleToRIS(article) {
    let TY = "TY  - JOUR";
    let AU = "";
    for (let i = 0; i < article.data.creators.length; i++)  {
        AU += `AU  - ${article.data.creators[i].firstName} ${article.data.creators[i].lastName}`
        if (i < article.data.creators.length - 1)
            AU += `\n`
    }
    let AB = `AB  - ${article.data.abstractNote}`
    let DA = `DA  - ${article.data.date}`
    let UR = `UR  - ${article.data.url}`
    let TI = `TI  - ${article.data.title}`
    let T2 = `T2  - ${article.data.publicationTitle}`
    let VL = `VL  - ${article.data.volume}`
    let SN = `SN  - ${article.data.ISSN}`
    let SP = `SP  - ${article.data.pages}`

    return `${TY}\n${AU}\n${AB}\n${DA}\n${UR}\n${TI}\n${T2}\n${VL}\n${SN}\n${SP}\nER  -\n`
}

function bookToRIS(book) {
    let TY = "TY  - BOOK";
    let AU = "";
    for (let i = 0; i < book.data.creators.length; i++)  {
        AU += `AU  - ${book.data.creators[i].firstName} ${book.data.creators[i].lastName}`
        if (i < book.data.creators.length - 1)
            AU += `\n`
    }
    let TI = `TI  - ${book.data.title}`
    let PB = `PB  - ${book.data.publisher}`
    let DA = `DA  - ${book.data.date}`
    let SN = `SN  - ${book.data.ISBN}`


    return `${TY}\n${AU}\n${TI}\n${PB}\n${DA}\n${SN}\nER  -\n`
}

function bookSectionToRIS(bookSection) {
    let TY = "TY  - CHAP"
    let AU = ""
    for (let i = 0; i < bookSection.data.creators.length; i++)  {
        AU += `AU  - ${bookSection.data.creators[i].firstName} ${bookSection.data.creators[i].lastName}`
        if (i < bookSection.data.creators.length - 1)
            AU += `\n`
    }
    let TI = `TI  - ${bookSection.data.title}`
    let T2 = `T2  - ${bookSection.data.bookTitle}`
    let PB = `PB  - ${bookSection.data.publisher}`
    let DA = `DA  - ${bookSection.data.date}`
    let SN = `SN  - ${bookSection.data.ISBN}`
    let SP = `SP  - ${bookSection.data.pages}`

    return `${TY}\n${AU}\n${TI}\n${T2}\n${PB}\n${DA}\n${SN}\n${SP}`
}

function webpageToRIS(webpage) {
    let TY = "TY  - WEB";
    let AU = ""
    for (let i = 0; i < webpage.data.creators.length; i++)  {
        AU += `AU  - ${webpage.data.creators[i].firstName} ${webpage.data.creators[i].lastName}`
        if (i < webpage.data.creators.length - 1)
            AU += `\n`
    }
    let TI = `TI  - ${webpage.data.title}`
    let UR = `UR  - ${webpage.data.url}`

    return `${TY}\n${AU}\n${TI}\n${UR}`
}