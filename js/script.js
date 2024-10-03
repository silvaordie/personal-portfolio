let projects = [];
let natureChart;
let technologyChart;
let toolChart;

export function initializePortfolio(){
    projects = [];
    
    // Fetch project data from the JSON file
    fetch('../data/projects/projects.json')
        .then(response => response.json())
        .then(data => {
            projects = data;
            displayProjects(projects);
            populateFilter(projects, "nature-filter");
            populateFilter(projects, "technology-filter");
            populateFilter(projects, "tools-filter");

            const topNatures = getTopItems('natures', projects);
            const topTechnologies = getTopItems('technologies', projects);
            const topTools = getTopItems('tools', projects);
        
            natureChart = createPieChart('nature', topNatures, 'Top Natures');
            technologyChart = createPieChart('technology', topTechnologies, 'Top Technologies');
            toolChart = createPieChart('tools', topTools, 'Top Tools');
        })
        .catch(error => console.error("Error loading JSON:", error));

        const natureFilter = document.getElementById('nature-filter');
        const technologyFilter = document.getElementById('technology-filter');
        const toolsFilter = document.getElementById('tools-filter');
        const modal_close_button = document.getElementById('close-modal-button');//.getElementById('close');
    
        modal_close_button.addEventListener('click', function() {
            onclick=closeModal()
        });
  
        // Attach onchange event to filters programmatically
        natureFilter.addEventListener('change', function() {
            addFilter('nature', this.value);
        });
    
        technologyFilter.addEventListener('change', function() {
            addFilter('technology', this.value);
        });
    
        toolsFilter.addEventListener('change', function() {
            addFilter('tools', this.value);
        });

    return projects
}
function addFilter(type, value) {

    if (!value) return; // Ignore empty selections

    switch (type) {
        case "nature":
            if (!activeNatureFilters.includes(value)) {
                activeNatureFilters.push(value);
                const card = createActiveFilterCard(value, type);
                document.getElementById("active-filters").appendChild(card);
            }
            break;
        case "technology":
            if (!activeTechnologyFilters.includes(value)) {
                activeTechnologyFilters.push(value);
                const card = createActiveFilterCard(value, type);
                document.getElementById("active-filters").appendChild(card);
            }
            break;
        case "tools":
            if (!activeToolsFilters.includes(value)) {
                activeToolsFilters.push(value);
                const card = createActiveFilterCard(value, type);
                document.getElementById("active-filters").appendChild(card);
            }
            break;
    }
    populateFilter(projects, "nature-filter");
    populateFilter(projects, "tools-filter");
    populateFilter(projects, "technology-filter");
    populateFilter(projects, "tools-filter");
    filterProjects();
}
function createActiveFilterCard(value, type) {
    const card = document.createElement("div");
    card.className = "active-filter-card";
    card.textContent = value;
    const removeBtn = document.createElement("span");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "x";
    removeBtn.onclick = () => removeFilter(type, value);
    card.appendChild(removeBtn);
    return card;
}

function removeFilter(type, value) {
    switch (type) {
        case "nature":
            activeNatureFilters = activeNatureFilters.filter(filter => filter !== value);
            break;
        case "technology":
            activeTechnologyFilters = activeTechnologyFilters.filter(filter => filter !== value);
            break;
        case "tools":
            activeToolsFilters = activeToolsFilters.filter(filter => filter !== value);
            break;
    }
    
    document.getElementById("active-filters").innerHTML = ""; // Clear active filters display
    activeNatureFilters.forEach(filter => document.getElementById("active-filters").appendChild(createActiveFilterCard(filter, "nature")));
    activeTechnologyFilters.forEach(filter => document.getElementById("active-filters").appendChild(createActiveFilterCard(filter, "technology")));
    activeToolsFilters.forEach(filter => document.getElementById("active-filters").appendChild(createActiveFilterCard(filter, "tools")));
   
    populateFilter(projects, "nature-filter");
    populateFilter(projects, "technology-filter");
    populateFilter(projects, "tools-filter");
    filterProjects();
}

function filterProjects() {
    const filteredProjects = projects.filter(project => {
        const matchesNature = activeNatureFilters.length === 0 || 
            project.natures.some(nature => activeNatureFilters.includes(nature));
        const matchesTechnology = activeTechnologyFilters.length === 0 || 
            project.technologies.some(tech => activeTechnologyFilters.includes(tech));
        const matchesTools = activeToolsFilters.length === 0 || 
            project.tools.some(tool => activeToolsFilters.includes(tool));

        return matchesNature && matchesTechnology && matchesTools;
    });

    displayProjects(filteredProjects);
}

function displayProjects(filteredProjects = projects) {
    const projectContainer = document.getElementById("project-container");
    projectContainer.innerHTML = ""; // Clear previous projects

    filteredProjects.forEach(project => {
        const card = document.createElement('div');
        card.classList.add('project-card');
    
        // Create the top section for the project title
        const titleSection = document.createElement('div');
        titleSection.classList.add('project-card-top');
        const title = document.createElement('h3');
        title.textContent = project.title;
        titleSection.appendChild(title);
        card.appendChild(titleSection);
    
        // Create the main content section
        const contentSection = document.createElement('div');
        contentSection.classList.add('project-card-content');
    
        // Create the description section
        const descriptionSection = document.createElement('div');
        descriptionSection.classList.add('project-card-description');
        const description = document.createElement('p');
        description.textContent = project.overview;
        descriptionSection.appendChild(description);
    
        // Append description to content section
        contentSection.appendChild(descriptionSection);
    
        // Create the project information section (nature, technologies, tools)
        const infoSection = document.createElement('div');
        infoSection.classList.add('project-card-info');
    
        // Natures with colored circles
        const natureContainer = document.createElement('div');
        natureContainer.classList.add('project-nature');
        project.natures.forEach(nature => {
            const natureItem = document.createElement('span');
            natureItem.classList.add('tool-item');
    
            const colorCircle = document.createElement('span');
            colorCircle.classList.add('color-circle');
            colorCircle.style.backgroundColor = getOrAssignColor(nature, 'natures');
    
            natureItem.appendChild(colorCircle);
            natureItem.appendChild(document.createTextNode(nature));
            natureContainer.appendChild(natureItem);
        });
        infoSection.appendChild(natureContainer);
    
        // Technologies with colored circles
        const techContainer = document.createElement('div');
        techContainer.classList.add('project-technologies');
        project.technologies.forEach(tech => {
            const techItem = document.createElement('span');
            techItem.classList.add('tool-item');
    
            const colorCircle = document.createElement('span');
            colorCircle.classList.add('color-circle');
            colorCircle.style.backgroundColor = getOrAssignColor(tech, 'technologies');
    
            techItem.appendChild(colorCircle);
            techItem.appendChild(document.createTextNode(tech));
            techContainer.appendChild(techItem);
        });
        infoSection.appendChild(techContainer);
    
        // Tools with colored circles
        const toolsContainer = document.createElement('div');
        toolsContainer.classList.add('project-tools');
        project.tools.forEach(tool => {
            const toolItem = document.createElement('span');
            toolItem.classList.add('tool-item');
    
            const colorCircle = document.createElement('span');
            colorCircle.classList.add('color-circle');
            colorCircle.style.backgroundColor = getOrAssignColor(tool, 'tools');
    
            toolItem.appendChild(colorCircle);
            toolItem.appendChild(document.createTextNode(tool));
            toolsContainer.appendChild(toolItem);
        });
        infoSection.appendChild(toolsContainer);
    
        // Add the project info section to the content section
        contentSection.appendChild(infoSection);
    
        // Append the content section to the card
        card.appendChild(contentSection);
    
        // Create and append the "View Details" button
        const viewDetailsButton = document.createElement('button');
        viewDetailsButton.classList.add('view-details-button');
        viewDetailsButton.textContent = 'View Details';
        viewDetailsButton.onclick = function() {
            openModal(
                project
            );
        };
    
        // Append the button to the card
        card.appendChild(viewDetailsButton);
    
        // Append the card to the project container
        projectContainer.appendChild(card);
    });
}
//            <button class="view-details-button" onclick="openModal('${encodeURIComponent(project.title)}', '${encodeURIComponent(project.description)}', '${project.media.pdf ? encodeURIComponent(project.media.pdf) : ''}', '${project.media.video ? encodeURIComponent(project.media.video) : ''}', '${encodeURIComponent(project.images)}', '${project.repository}')">View Details</button>`;

function openModal(project ) {
    document.getElementById("modal-title").textContent = project.title;
    document.getElementById("modal-description").innerHTML = project.description.replace(/\n/g, '<br>');;
    
    const mediaContainer = document.getElementById("modal-media");
    document.getElementById('modal-natures-list').innerHTML = "";
    document.getElementById('modal-tools-list').innerHTML = "";
    document.getElementById('modal-technologies-list').innerHTML = "";
    mediaContainer.innerHTML = ""; // Clear previous media
    // Populate Natures
    project.natures.forEach(nature => {
        const li = document.createElement('li');
        const circle = document.createElement('span');
        circle.className = 'color-circle';
        circle.style.backgroundColor = getOrAssignColor(nature, "natures"); // Assign color based on nature
        li.appendChild(circle);
        li.appendChild(document.createTextNode(nature));
        document.getElementById('modal-natures-list').appendChild(li);
    });

    // Populate Technologies
    project.technologies.forEach(tech => {
        const li = document.createElement('li');
        const circle = document.createElement('span');
        circle.className = 'color-circle';
        circle.style.backgroundColor = getOrAssignColor(tech, "technologies"); // Assign color based on technology
        li.appendChild(circle);
        li.appendChild(document.createTextNode(tech));
        document.getElementById('modal-technologies-list').appendChild(li);
    });

    // Populate Tools
    project.tools.forEach(tool => {
        const li = document.createElement('li');
        const circle = document.createElement('span');
        circle.className = 'color-circle';
        circle.style.backgroundColor = getOrAssignColor(tool, "tools"); // Assign color based on tool
        li.appendChild(circle);
        li.appendChild(document.createTextNode(tool));
        document.getElementById('modal-tools-list').appendChild(li);
    });

    if (project.repository) {
        const githubButton = document.createElement("a");
        githubButton.href = project.repository;
        githubButton.target = "_blank"; // Open in new tab
        githubButton.innerHTML = `<img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" style="width: 24px; height: 24px;"> Repository`;
        githubButton.className = "github-button";
        mediaContainer.appendChild(githubButton);
    }
    if (project.media.pdf) {
        if (project.media.pdf.length == 1 )
        {
            const pdfElement = document.createElement("iframe");
            pdfElement.src = project.media.pdf[0] + "#toolbar=0";
            pdfElement.width = "100%";
            pdfElement.height = "900px"
            mediaContainer.appendChild(pdfElement); 
        }
        else{
            project.media.pdf.forEach((pdfItem, index) => {
                let pdfTitle;
                let pdfUrl;

                // If it's a dictionary object with title: url
                if (typeof pdfItem === 'object') {
                    pdfTitle = Object.keys(pdfItem)[0];  // Get the key (title)
                    pdfUrl = pdfItem[pdfTitle];         // Get the URL
                } else {
                    // If it's just an array of URLs, use a default title
                    pdfTitle = `PDF Document ${index + 1}`;
                    pdfUrl = pdfItem;
                }
                // Create a collapsible container
                const pdfContainer = document.createElement('div');
                pdfContainer.classList.add('pdf-container');

                const pdfButton = document.createElement('button');
                pdfButton.classList.add('collapsible');
                pdfButton.innerText = pdfTitle;

                const pdfContent = document.createElement('div');
                pdfContent.classList.add('collapsible-content');

                // Create an iframe for the PDF
                const pdfIframe = document.createElement('iframe');
                pdfIframe.src = pdfUrl+ "#toolbar=0"; // PDF URL from JSON
                pdfIframe.width = '100%';
                pdfIframe.height = '800px';
                pdfIframe.style.display = 'none'; // Initially hidden

                pdfContent.appendChild(pdfIframe);

                // Append the collapsible section to the container
                pdfContainer.appendChild(pdfButton);
                pdfContainer.appendChild(pdfContent);

                // Append the container to the modal media section
                mediaContainer.appendChild(pdfContainer);

                pdfButton.addEventListener('click', function () {
                    const content = this.nextElementSibling;
                    if (pdfIframe.style.display === 'none') {
                        pdfIframe.style.display = 'block';
                    } else {
                        pdfIframe.style.display = 'none';
                    }
                });
            });
        }

    }

    if (project.media.video) {
        const videoElement = document.createElement("iframe");
        videoElement.src = project.videoLink;
        videoElement.width = "100%";
        videoElement.height = "300px";
        videoElement.allow = "autoplay; encrypted-media";
        mediaContainer.appendChild(videoElement);
    }

    if (project.media.images) {
        const imgElement = document.createElement("img");
        imgElement.src = project.images;
        imgElement.style.width = "100%";
        mediaContainer.appendChild(imgElement);
    }

    document.getElementById("modal").style.display = "block";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}
