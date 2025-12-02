window.addEventListener('DOMContentLoaded', () => {

    /**
     * This function prompts the list of resources from a json file.
     * @function promptResources
     */
    let updatedResources = [];
    function promptResources() {
        // set the file path
        const filePath = '../backend/items.json';

        fetch(filePath)
        .then(async response => {
            let resources = await response.json();
            //console.log(resources);
            //display(resources);
            updatedResources = filterReadyForWebsite(resources);
            //console.log("updatedResources: ", updatedResources);
            paginateDisplay(updatedResources, 25);
            //displayRelevant(resources, 10, 19);
        })
        .catch(error => console.error("Error happened while reading Zotero resource list", error));
    }

    // This function filters out all resources that are not ready for website display
    function filterReadyForWebsite(resources) {
        // before anything, filter resources based on ones that have "00. Ready for website" tag        
        //let newResources = resources; // just to test multiple pagination buttons
        let newResources = resources.filter(resource => {
            if (resource.data.tags?.some(resourceTag => resourceTag.tag.toLowerCase().includes("ready for website"))) return resource;
        });

        return newResources
    }

    // This function presupposes that all elements are loaded onto HTML.
    function paginateDisplay(resources, pageSize) {

        // first, display all resources
        display(resources);
        
        // figure out the number of pages
        let numberOfPages = Math.ceil(resources.length / pageSize);

        // create a button for each page, if there are no buttons already there.
        let buttonsSection = document.getElementById('pagination-buttons');
        buttonsSection.innerHTML = '';
        for (let page = 0; page < numberOfPages; page++) {
            let pageButton = document.createElement('button');
            pageButton.setAttribute('class', 'pagination-button');
            pageButton.setAttribute('id', `page-${page+1}-button`);
            pageButton.innerText = page + 1;
            pageButton.addEventListener('click', () => {
                // Reset background color of previous button
                displayRelevant(resources, page, pageSize);
                for (let i = 0; i < numberOfPages; i++)
                    if (i != page && document.getElementById(`page-${i+1}-button`)) {
                        document.getElementById(`page-${i+1}-button`).setAttribute('class', 'pagination-button');
                    }
                    else if (i == page) {
                        document.getElementById(`page-${i+1}-button`).setAttribute('class', 'pagination-button-clicked');
                    }
            });
            buttonsSection.appendChild(pageButton);
        }

        // by default, display the first page
        if (document.getElementById(`page-1-button`)) {
            document.getElementById(`page-1-button`).click();
        }
    }

    // This function presupposes that all elements are loaded onto HTML
    //  but they're all hidden in display.
    // It shows relevant presources whenever a user clicks a page number.
    // I added two arguments so that it decides which resources to display
    //  in a paginated display system with a certain number of pages
    //  and a number of resources to display per page (e.g., 50).
    function displayRelevant(resources, page, pageSize) {
        // nothing to do if there are no resources to display
        if (!resources || resources.length === 0) {
            console.log("No resources found");
            return;
        }
        let initialIndex = page * pageSize;
        let finalIndex = initialIndex + pageSize - 1;
        let relevantResources = resources.slice(initialIndex, finalIndex + 1);
        
        // first, make sure all articles are hidden
        resources.forEach( resource => {
            let article = document.getElementById(`resource-${resources.indexOf(resource)}`);
            if (article != null) article.style.display = 'none';
            let hrule = document.getElementById(`resource-${resources.indexOf(resource)}-hrule`);
            if (hrule != null) hrule.style.display = 'none';
        });
        
        // then, display only the relevant articles
        relevantResources.forEach( resource => {
            let article = document.getElementById(`resource-${resources.indexOf(resource)}`);
            if (article != null) article.style.display = 'block';
            let hrule = document.getElementById(`resource-${resources.indexOf(resource)}-hrule`);
            if (hrule != null) hrule.style.display = 'block';
        });
    }

    // This function takes an array of objects
    //  namely, resources fetched from the Zotero API,
    //  and displays them on screen.
    function display(resources) {

        //console.log("allPapers: ", resources.length, resources);
        let relevantResourcesSection = document.getElementById('relevant-resources-list');      
        resources.forEach (resource => {

            /**
             * Create new article for the current resource
             */
            let article = document.createElement('article');
            article.setAttribute('id', `resource-${resources.indexOf(resource)}`);
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
            title.innerText = `${resource.data.title}`;

            /**
             * Create button to toggle display of collapsible table (relevant info, look below)
             */
            let toggleInfoButton = document.createElement('button');
            toggleInfoButton.setAttribute('class', 'resource-button');
            toggleInfoButton.setAttribute('id', `resource-${resources.indexOf(resource)}-toggle`);
            toggleInfoButton.setAttribute('type', 'button');
            toggleInfoButton.setAttribute('aria-expanded', 'false');
            toggleInfoButton.setAttribute('aria-controls', `resource-${resources.indexOf(resource)}-info`);
            
            /**
             * Put title in toggle button, and put them both in resource header
             */
            toggleInfoButton.appendChild(title);
            resourceHeader.appendChild(toggleInfoButton);

            /**
             * Create a table for relevant info 
             */
            let resourceInfo = document.createElement('table');
            resourceInfo.setAttribute('id', `resource-${resources.indexOf(resource)}-info`);
            resourceInfo.setAttribute('role', 'presentation') // block screen reader from reading this as table
            resourceInfo.setAttribute('style', 'display: none');
            article.appendChild(resourceInfo);

            /**
             * Set button to toggle display 
             */
            toggleInfoButton.addEventListener('click', () => {
                if (resourceInfo.style.display === 'block') {
                    toggleInfoButton.setAttribute('aria-expanded', 'false');
                    toggleInfoButton.setAttribute('class', 'resource-button');
                    resourceInfo.style.display = 'none';
                }    
                else {
                    toggleInfoButton.setAttribute('aria-expanded', 'true');
                    toggleInfoButton.setAttribute('class', 'resource-button-clicked');
                    resourceInfo.style.display = 'block';
                }    
            })    

            /**
             * Create relevant info for current resource 
             */

            // type
            let type = resource.data.itemType;
            let typeSection = document.createElement('section');
            typeSection.setAttribute('id', `resource-${resources.indexOf(resource)}-info-type`);
            let typeSectionHeader = document.createElement('h4');
            typeSectionHeader.innerText = 'Resource Type';
            typeSection.appendChild(typeSectionHeader);
            let typeSectionContent = document.createElement('p');
            typeSectionContent.innerText = type;
            typeSection.appendChild(typeSectionContent);

            // authors
            let authors = resource.data.creators;
            let authorsSection = document.createElement('section');
            authorsSection.setAttribute('id', `resource-${resources.indexOf(resource)}-info-authors`);
            let authorsSectionHeader = document.createElement('h4');
            authorsSectionHeader.innerText = 'Author(s)';
            authorsSection.appendChild(authorsSectionHeader);
            let authorsSectionContent = document.createElement('p');
            authors?.forEach(author => {
                authorsSectionContent.innerHTML += `${author.firstName} ${author.lastName} <br>`;
            });    
            authorsSection.appendChild(authorsSectionContent);

            // abstract
            let abstract = resource.data.abstractNote;
            let abstractSection = document.createElement('section');
            abstractSection.setAttribute('id', `resource-${resources.indexOf(resource)}-info-abstract`);
            let abstractSectionHeader = document.createElement('h4');
            abstractSectionHeader.innerText = 'Abstract';
            abstractSection.appendChild(abstractSectionHeader);
            let abstractSectionContent = document.createElement('p');
            abstractSectionContent.innerText = abstract;
            abstractSection.appendChild(abstractSectionContent);

            // year
            let year = resource.data.date;
            let yearSection = document.createElement('section');
            yearSection.setAttribute('id', `resource-${resources.indexOf(resource)}-info-year`);
            let yearSectionHeader = document.createElement('h4');
            yearSectionHeader.innerText = 'Year';
            yearSection.appendChild(yearSectionHeader);
            let yearSectionContent = document.createElement('p');
            yearSectionContent.innerText = year;
            yearSection.appendChild(yearSectionContent);

            // URL
            let url = resource.data.url;
            let urlSection = document.createElement('section');
            urlSection.setAttribute('id', `resouce-${resources.indexOf(resource)}-info-url`);
            let urlSectionHeader = document.createElement('h4');
            urlSectionHeader.innerText = 'URL';
            urlSection.appendChild(urlSectionHeader);
            let urlSectionContent = document.createElement('a');
            urlSectionContent.setAttribute('href', url);
            urlSectionContent.innerText = url;
            urlSection.appendChild(urlSectionContent);

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
            let urlRow = document.createElement('tr');
            urlRow.appendChild(urlSection);

            /**
             * Put info rows in the table
             */
            resourceInfo.appendChild(typeRow);
            resourceInfo.appendChild(authorsRow);
            resourceInfo.appendChild(abstractRow);
            resourceInfo.appendChild(yearRow);
            resourceInfo.appendChild(urlRow);


            /**
             * If itemType === 'journalArticle':
             *      add publication title, volume, and pages.
             */
            if (type === 'journalArticle') {

                // publication title
                let publicationTitle = resource.data.publicationTitle;
                let publicationTitleSection = document.createElement('section');
                publicationTitleSection.setAttribute('id', `resource-${resources.indexOf(resource)}-info-publication-title`);
                let publicationTitleSectionHeader = document.createElement('h4');
                publicationTitleSectionHeader.innerText = 'Publication Title';
                publicationTitleSection.appendChild(publicationTitleSectionHeader);
                let publicationTitleSectionContent = document.createElement('p');
                publicationTitleSectionContent.innerText = publicationTitle;
                publicationTitleSection.appendChild(publicationTitleSectionContent);

                // volume
                let volume = resource.data.volume;
                let volumeSection = document.createElement('section');
                volumeSection.setAttribute('id', `resource-${resources.indexOf(resource)}-info-volume`);
                let volumeSectionHeader = document.createElement('h4');
                volumeSectionHeader.innerText = 'Volume';
                volumeSection.appendChild(volumeSectionHeader);
                let volumeSectionContent = document.createElement('p');
                volumeSectionContent.innerText = volume;
                volumeSection.appendChild(volumeSectionContent);

                // pages
                let pages = resource.data.pages;
                let pagesSection = document.createElement('section');
                pagesSection.setAttribute('id', `resource-${resources.indexOf(resource)}-info-pages`);
                let pagesSectionHeader = document.createElement('h4');
                pagesSectionHeader.innerText = 'Pages';
                pagesSection.appendChild(pagesSectionHeader);
                let pagesSectionContent = document.createElement('p');
                pagesSectionContent.innerText = pages;
                pagesSection.appendChild(pagesSectionContent);
                
                // create rows for extra info
                let publicationTitleRow = document.createElement('tr');
                publicationTitleRow.appendChild(publicationTitleSection);
                let volumeRow = document.createElement('tr');
                volumeRow.appendChild(volumeSection);
                let pagesRow = document.createElement('tr');
                pagesRow.appendChild(pagesSection);

                // put extra info rows in the table
                resourceInfo.appendChild(publicationTitleRow);
                resourceInfo.appendChild(volumeRow);
                resourceInfo.appendChild(pagesRow);

            }

            // add horizontal rule to separate resources visually
            let hrule = document.createElement('hr');
            hrule.setAttribute('id', `resource-${resources.indexOf(resource)}-hrule`);
            relevantResourcesSection.appendChild(hrule);

        });
    }

    promptResources();

});