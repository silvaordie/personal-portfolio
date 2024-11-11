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
let userId = localStorage.getItem('userId');
if (!userId) {
  userId = 'user-' + Date.now() + Math.floor(Math.random() * 1000); // A simple unique ID based on timestamp
  localStorage.setItem('userId', userId);
}

// Toggle chat box visibility
function toggleChatBox() {
    const chatBox = document.getElementById("chatBox");
    chatBox.style.display = chatBox.style.display === "block" ? "none" : "block";
  }
  
  // Send message to the chat (fetching response from the API)
  async function sendMessage(event) {

    if (event.key === "Enter") {
      const chatInput = document.getElementById("chatInput");
      const message = chatInput.value.trim();
      
      if (message) {
        const chatContent = document.getElementById("chatContent");
        
        // Append the user's message
        const userMessage = document.createElement("div");
        userMessage.classList.add("user-message");
        userMessage.innerText = message;
        const genMessage = document.createElement("div");
        genMessage.appendChild(userMessage)
        genMessage.classList.add("message");
        chatContent.appendChild(genMessage);
        
        // Clear input field
        chatInput.value = "";
        
        // Auto-scroll to the latest message
        chatContent.scrollTop = chatContent.scrollHeight;
        const userId = localStorage.getItem('userId');

        // Fetch response from local API (/api/answer)
        try {
          const response = await fetch("http://192.168.1.18:5000/api/answer", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: message, userId: userId })
          });
  
          // Wait for the response and parse it as JSON
          const data = await response.json();
  
          // Add the API response as the bot's message
          const botMessage = document.createElement("div");
          botMessage.classList.add("bot-message");
          botMessage.innerText = data.answer || "Sorry, I didn't understand that.";
          const genMessage = document.createElement("div");
          genMessage.appendChild(botMessage)
          genMessage.classList.add("message");
          chatContent.appendChild(genMessage);
  
          // Auto-scroll to the latest message
          chatContent.scrollTop = chatContent.scrollHeight;
        } catch (error) {
          // Handle any errors (e.g., network issues)
          console.error("Error fetching API response:", error);
          const botMessage = document.createElement("div");
          botMessage.classList.add("bot-message");
          botMessage.innerText = "Sorry, something went wrong. Please try again.";
          const genMessage = document.createElement("div");
          genMessage.appendChild(botMessage)
          genMessage.classList.add("message");
          chatContent.appendChild(genMessage);
          chatContent.scrollTop = chatContent.scrollHeight;
        }
      }
    }
  }
  
  






