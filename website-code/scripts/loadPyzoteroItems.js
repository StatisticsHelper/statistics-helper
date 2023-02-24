export function loadPyzoteroItems () {

    // set the file path
    const filePath = '../pyzotero/items.pretty.json';

    // create a new FileReader object
    const reader = new FileReader();

    // Read the file as text
    reader.readAsText(filePath);
    
    // Set the onload handler
    reader.onload = () => {
        // Parse the JSON content
        let papers = JSON.parse(reader.result);
        console.log("Papers uploaded successfully!", papers);
        localStorage.setItem("paperList", JSON.stringify(papers));
    }

}