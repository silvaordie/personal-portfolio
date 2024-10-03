document.addEventListener('DOMContentLoaded', fetchAndDisplayExperiences);

export function fetchAndDisplayExperiences() {
    

    fetch('../data/projects/experiences.json')
        .then(response => response.json())
        .then(data => {
            const workExperienceContainer = document.getElementById('work-experiences');
            const voluntaryExperienceContainer = document.getElementById('voluntary-experiences');

            // Clear existing content
            workExperienceContainer.innerHTML = '';
            voluntaryExperienceContainer.innerHTML = '';

            // Populate work experiences
            data.work.forEach(exp => {
                const card = createExperienceCard(exp);
                workExperienceContainer.appendChild(card);
            });

            // Populate voluntary experiences
            data.voluntary.forEach(exp => {
                const card = createExperienceCard(exp);
                voluntaryExperienceContainer.appendChild(card);
            });
        })
        .catch(error => console.error('Error fetching experiences:', error));
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
    // Add tools in parentheses
    if (point.tools.length > 0) {        
        listItem.appendChild(document.createTextNode("    ("));
        point.tools.forEach(tool => {
            const toolsSpan = document.createElement('span');

            toolsSpan.textContent = tool ;
            const toolCircle = document.createElement('span');
            toolCircle.classList.add('color-circle');
            toolCircle.style.backgroundColor = getOrAssignColor(tool, 'tools');
            listItem.appendChild(toolCircle);
            listItem.appendChild(toolsSpan);
        });
        listItem.appendChild(document.createTextNode(")"));
    }

    

    return listItem;
}
