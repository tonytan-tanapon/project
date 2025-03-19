function loadPage(page) {
    fetch(`${page}`)
        .then(response => response.text())
        .then(html => {
            document.getElementById('content').innerHTML = html;
            console.log(page)
            loadScript(page.replace(".html", ".js"));

            // Load TensorFlow.js dynamically only if it's required
            if (page === 'image.html' ) {
                loadImageTensorFlow();
            }
            if (page === 'text.html') {
                loadTextTensorFlow();
            }
        })
        .catch(error => console.error('Error loading page:', error));

}

function loadScript(scriptName) {
    const scriptTag = document.createElement("script");
    scriptTag.src = `js/${scriptName}`;
    scriptTag.type = "text/javascript";
    document.body.appendChild(scriptTag);
}

// Function to set the active tab
function setActiveTab(selectedTab) {
    document.querySelectorAll(".nav-link").forEach(tab => {
        tab.classList.remove("active");
    });
    selectedTab.classList.add("active");
}
function loadImageTensorFlow() {
    if (!window.tf) { // Check if TensorFlow.js is already loaded
        const tfScript = document.createElement("script");
        tfScript.src = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs";
        
        tfScript.type = "text/javascript";
        tfScript.onload = () => {
            console.log("TensorFlow.js loaded");

            // Load MobileNet or any other model when needed
            const mobilenetScript = document.createElement("script");
            mobilenetScript.src = "https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet";
            mobilenetScript.type = "text/javascript";
            mobilenetScript.onload = () => console.log("MobileNet model loaded");
            document.body.appendChild(mobilenetScript);
        };
        document.body.appendChild(tfScript);
    }
}

function loadTextTensorFlow() {
    if (!window.tf) { // Check if TensorFlow.js is already loaded
        const tfScript = document.createElement("script");
        tfScript.src = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs";
        
        tfScript.type = "text/javascript";
        tfScript.onload = () => {
            console.log("TensorFlow.js loaded");

            // Load MobileNet or any other model when needed
            const mobilenetScript = document.createElement("script");
            mobilenetScript.src = "https://cdn.jsdelivr.net/npm/@tensorflow-models/universal-sentence-encoder";
            mobilenetScript.type = "text/javascript";
            mobilenetScript.onload = () => console.log("MobileNet model loaded");
            document.body.appendChild(mobilenetScript);
        };
        document.body.appendChild(tfScript);
    }
}

// Load the first tab (Database) by default
window.onload = () => loadPage('database.html');
