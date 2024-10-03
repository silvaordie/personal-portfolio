document.addEventListener('DOMContentLoaded', () => {
    // Load the header and the default tab (Portfolio)
    loadHeader();
    showPage('portfolio',document.querySelector('.tab-button.active'));
});

function loadHeader() {
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
        });
}

function showPage(page, element) {
    let pageFile = '';

    // Determine which page file to load
    if (page === 'portfolio') {
        pageFile = 'portfolio.html';
    } else if (page === 'experiences') {
        pageFile = 'experiences.html';
    } else if (page === 'interests') {
        pageFile = 'interests.html';
    }

    // Fetch the page and load it into the content container
    fetch(pageFile)
        .then(response => response.text())
        .then(data => {
            document.getElementById('content-container').innerHTML = data;

            // If portfolio page is loaded, also load and execute script.js
            if (page === 'portfolio') {
                loadPortfolioScript();
            }
            if (page === 'experiences') {
                loadExperiencesScript();
            }
        });
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => button.classList.remove('active'));
    
    // Add "active" class to the clicked tab
    element.classList.add('active');
}

function loadPortfolioScript() {
    if (!document.getElementById('portfolio-script')) {
        import('./script.js').then(module => {
            module.initializePortfolio();
        }).catch(error => console.error('Error loading script:', error));
    } else {
        initializePortfolio();
    }
}

function loadExperiencesScript() {
    if (!document.getElementById('experiences-script')) {
        import('./experiences.js').then(module => {
            module.fetchAndDisplayExperiences();
        }).catch(error => console.error('Error loading script:', error));
    } else {
        fetchAndDisplayExperiences();
    }
}



