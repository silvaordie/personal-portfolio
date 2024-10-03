document.addEventListener('DOMContentLoaded', fetchAndDisplayExperiences);
let experiences = [];
let experiences_j = [];
let natureChart;
let technologyChart;
let toolChart;

export function fetchAndDisplayExperiences() {
    
    
    fetch('../data/projects/experiences.json')
        .then(response => response.json())
        .then(data => {
            experiences = [];
            experiences_j = [];
            experiences = data;

            experiences.work.forEach(exp => {
                experiences_j.push(exp);
            });
            experiences.voluntary.forEach(exp => {
                experiences_j.push(exp);
            });


            populateFilter(experiences_j, "nature-filter");
            populateFilter(experiences_j, "technology-filter");
            populateFilter(experiences_j, "tools-filter");
            filterExperiences("work-experiences");    
            filterExperiences("voluntary-experiences");  
            
            const topNatures = getTopItems('natures', experiences_j);
            const topTechnologies = getTopItems('technologies', experiences_j);
            const topTools = getTopItems('tools', experiences_j);
            console.log("asdfsdf")

            natureChart = createPieChart('nature', topNatures, 'Top Natures');
            technologyChart = createPieChart('technology', topTechnologies, 'Top Technologies');
            toolChart = createPieChart('tools', topTools, 'Top Tools');

        })
        .catch(error => console.error('Error fetching experiences:', error));
        
        const natureFilter = document.getElementById('nature-filter');
        const technologyFilter = document.getElementById('technology-filter');
        const toolsFilter = document.getElementById('tools-filter');

        console.log(natureFilter.onchange);
        natureFilter.removeEventListener('change', function() {
            addFilter('nature', this.value);
        });
        natureFilter.addEventListener('change', function() {
            addFilter('nature', this.value);
        });
    
        technologyFilter.addEventListener('change', function() {
            addFilter('technology', this.value);
        });
    
        toolsFilter.addEventListener('change', function() {
            addFilter('tools', this.value);
        });
}
function filterExperiences(token) {
    let experiences_list = [];
    if(token == "work-experiences"){
        experiences_list = experiences.work;
    }
    else{
        experiences_list = experiences.voluntary;
    }

    const filteredExperiences = experiences_list.filter(experience => {
        const matchesNature = activeNatureFilters.length === 0 || 
        experience.natures.some(nature => activeNatureFilters.includes(nature));
        const matchesTechnology = activeTechnologyFilters.length === 0 || 
        experience.technologies.some(tech => activeTechnologyFilters.includes(tech));
        const matchesTools = activeToolsFilters.length === 0 || 
        experience.tools.some(tool => activeToolsFilters.includes(tool));

        return matchesNature && matchesTechnology && matchesTools;
    });
    displayExperiences(filteredExperiences, token);
}

function displayExperiences(filteredExperiences, token){
    // Clear existing content
    const ExperienceContainer = document.getElementById(token);

    ExperienceContainer.innerHTML = '';
    // Populate voluntary experiences
    filteredExperiences.forEach(exp => {
        const card = createExperienceCard(exp);
        ExperienceContainer.appendChild(card);
    });
}

function createExperienceCard(exp) {
    // Create the main experience card div
    const card = document.createElement('div');
    card.classList.add('experience-card');

    const experienceHighlevel = document.createElement('div');
    experienceHighlevel.classList.add('experience-highlevel');

    const experienceContent = document.createElement('div');
    experienceContent.classList.add('experience-content');

    // Title
    const title = document.createElement('h3');
    title.classList.add('experience-title');
    title.textContent = exp.title;
    card.appendChild(title);

    // Description
    const desc = document.createElement('div');
    desc.classList.add('experience-description');
    desc.textContent = exp.description;
    card.appendChild(desc);

    // Company
    const company = document.createElement('p');
    const companyLabel = document.createElement('strong');
    companyLabel.textContent = 'Company: ';
    company.appendChild(companyLabel);
    company.appendChild(document.createTextNode(exp.company));
    experienceHighlevel.appendChild(company);

    // Location
    const location = document.createElement('p');
    const locationLabel = document.createElement('strong');
    locationLabel.textContent = 'Location: ';
    location.appendChild(locationLabel);
    location.appendChild(document.createTextNode(exp.location));
    experienceHighlevel.appendChild(location);

    // Create the date line (start and end dates)
    const date = document.createElement('p');
    const dateLabel = document.createElement('strong');
    dateLabel.textContent = 'Duration: ';
    date.appendChild(dateLabel);
    date.appendChild(document.createTextNode(`${exp.startDate} - ${exp.endDate}`));
    experienceHighlevel.appendChild(date);

    // Experience Info container
    const experienceInfo = document.createElement('div');
    experienceInfo.classList.add('experience-info');

    // Natures
    const naturesDiv = createExperienceDetail(exp.natures, 'natures');
    experienceHighlevel.appendChild(naturesDiv);

    // Technologies
    const technologiesDiv = createExperienceDetail(exp.technologies, 'technologies');
    experienceHighlevel.appendChild(technologiesDiv);

    // Bullet points
    const bulletPoints = document.createElement('ul');
    bulletPoints.classList.add('bullet-points');
    exp.bulletPoints.forEach(point => {
        const bulletPointItem = createBulletPoint(point);
        bulletPoints.appendChild(bulletPointItem);
    });
    experienceInfo.appendChild(bulletPoints);
    card.appendChild(experienceContent);
    experienceContent.appendChild(experienceHighlevel);
    experienceContent.appendChild(experienceInfo);
    return card;
}

function createExperienceDetail( items, type) {
    const container = document.createElement('div');
    container.classList.add(type);

    items.forEach(item => {
        const itemSpan = document.createElement('span');
        itemSpan.classList.add('experience-item');

        const colorCircle = document.createElement('span');
        colorCircle.classList.add('color-circle');
        colorCircle.style.backgroundColor = getOrAssignColor(item, type);
        
        itemSpan.appendChild(colorCircle);
        itemSpan.appendChild(document.createTextNode(item));
        container.appendChild(itemSpan);
    });

    return container;
}

function createBulletPoint(point) {
    const listItem = document.createElement('li');
    listItem.appendChild(document.createTextNode(point.text));
    const toolsDiv= document.createElement('span');
    toolsDiv.classList.add("experience-tools")
    // Add tools in parentheses
    if (point.tools.length > 0) {        
        toolsDiv.appendChild(document.createTextNode("    ("));
        point.tools.forEach(tool => {
            const toolsSpan = document.createElement('span');

            const toolCircle = document.createElement('span');
            toolCircle.classList.add('color-circle');
            toolCircle.style.backgroundColor = getOrAssignColor(tool, 'tools');
            toolsSpan.appendChild(toolCircle);
            toolsSpan.appendChild(document.createTextNode(tool));

            toolsDiv.appendChild(toolsSpan);
        });
        toolsDiv.appendChild(document.createTextNode(")"));
        listItem.appendChild(toolsDiv);
    }

    

    return listItem;
}

function addFilter(type, value) {
    console.log(value)
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

    populateFilter(experiences_j, "technology-filter");
    populateFilter(experiences_j, "tools-filter");
    filterExperiences("work-experiences");    
    filterExperiences("voluntary-experiences");   
}
function createActiveFilterCard(value, type) {
    const card = document.createElement("div");
    card.className = "active-filter-card";
    card.textContent = value;
    const removeBtn = document.createElement("span");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "x";
    removeBtn.onclick = () => removeFilterE(type, value);
    card.appendChild(removeBtn);
    return card;
}

function removeFilterE(type, value) {
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
    
    populateFilter(experiences_j, "technology-filter");
    populateFilter(experiences_j, "tools-filter");
    filterExperiences("work-experiences");    
    filterExperiences("voluntary-experiences");   
}
