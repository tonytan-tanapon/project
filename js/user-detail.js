let model;

// Load the Universal Sentence Encoder model
async function loadModel() {
    model = await use.load();
    console.log("Model loaded.");
}
loadModel();
function getUserDetails() {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('id');

    if (!userId) {
        alert("User ID is missing!");
        return;
    }

    fetch(`http://localhost:4000/shows/${userId}`)
        .then(response => response.json())
        .then(data => {
            // console.log(data);

            // Display user details
            document.getElementById('userId').textContent = data.user?.id || "N/A";
            document.getElementById('userName').textContent = data.user?.name || "N/A";
            document.getElementById('userEmail').textContent = data.user?.email || "N/A";

            // Display comments
            const commentsContainer = document.getElementById('userComments');
            commentsContainer.innerHTML = "<h3>Comments</h3>";

            if (data.comments.length > 0) {
                data.comments.forEach(comment => {
                    const p = document.createElement("p");
                    p.textContent = comment.comment_text;
                    commentsContainer.appendChild(p);
                });
            } else {
                commentsContainer.innerHTML += "<p>No comments available.</p>";
            }

            // Display images
            const imagesContainer = document.getElementById('userImages');
            imagesContainer.innerHTML = "<h3>Images</h3>";

            if (data.images.length > 0) {
                data.images.forEach(image => {
                    
                    // console.log(image.filepath)
                    const img = document.createElement("img");
                    img.src = `http://localhost:4000/${image.filepath}`; // Ensure this path matches your backend setup
                    img.alt = "User Image";
                    img.style.width = "150px";
                    img.style.margin = "10px";

                    img.onclick = () => updateClickCount(image.id);

                    imagesContainer.appendChild(img);
                });
            } else {
                imagesContainer.innerHTML = `
                    <p>No images available. Upload an image:</p>
                    `;
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            alert("Failed to load user details.");
        });
}
// Function to track image clicks (Optional)
function updateClickCount(imageId) {
    fetch(`http://localhost:4000/update-click/${imageId}`, { 
        method: "POST" 
    })
    .then(response => response.json())
    .then(data => {
        console.log("Click count updated for image ID:", imageId);
    })
    .catch(error => {
        console.error("Error updating click count:", error);
    });
}
// Function to add a comment
function addComment() {
    const userId = document.getElementById('userId').textContent;
    const commentText = document.getElementById('commentInput').value.trim();
    var id = null

    if (!commentText) {
        alert("Please enter a comment.");
        return;
    }
    // const sentiment = await getSentiment(commentText)
    fetch('http://localhost:4000/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, comment_text: commentText, sentiment: 0 })
    })
    .then(response => response.json())
    .then(data => {
        id = data.commentId
        console.log("This :: "+data.commentId);
       // alert("Comment added successfully!");
        document.getElementById('commentInput').value = ""; // Clear input field
        getUserDetails(); // Reload user details to show new comment

        analyzeSentiment(id, commentText)
    })
    .catch(error => {
        console.error("Error adding comment:", error);
        alert("Failed to add comment.");
    });

    
}
async function analyzeSentiment(id, text) {
  
    if (!text) {
        alert("Please enter text.");
        return;
    }

    if (!model) {
        alert("Model is still loading. Please wait.");
        return;
    }

    // Convert text into embeddings
    const embeddings = await model.embed([text]);
    const embeddingArray = embeddings.arraySync()[0];

    // Simple sentiment estimation: Calculate the average embedding value
    const sentimentScore = embeddingArray.reduce((sum, val) => sum + val, 0) / embeddingArray.length;
    console.log(sentimentScore)
    fetch(`http://localhost:4000/sentiment/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentiment: sentimentScore })
        
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
       // alert("Comment added successfully!");
        document.getElementById('commentInput').value = ""; // Clear input field
        getUserDetails(); // Reload user details to show new comment
    })
    .catch(error => {
        console.error("Error adding comment:", error);
        alert("Failed to add comment.");
    });
   
}
function uploadImage() {
    console.log("uploadImage")
    const userId = document.getElementById('userId').textContent;
    const fileInput = document.getElementById('imageUpload');

    if (!fileInput.files.length) {
        alert("Please select an image to upload.");
        return;
    }
    
    const file = fileInput.files[0];
    // // Validate file type (only images)
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    // console.log(allowedTypes.includes(file.type))
    if (!allowedTypes.includes(file.type)) {
        alert("Only image files (JPG, PNG, GIF, WEBP) are allowed.");
        fileInput.value = ""; // Clear the file input
        return;
    }

    // Validate file size (must be <= 1MB)
    const maxSize = 1 * 1024 * 1024; // 1MB in bytes
    if (file.size > maxSize) {
        alert("File size must be less than 1MB.");
        fileInput.value = ""; // Clear the file input
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);
    formData.append("user_id", userId);
    
    console.log("Upload")
    fetch("http://localhost:4000/upload", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(">>"+id)
        alert("Image uploaded successfully!");
        // getUserDetails(); // Reload user details to show the new image

        // imagePrediction(data.fileId)
    })
    .catch(error => {
        console.error("Error uploading image:", error);
        alert("Failed to upload image.");
    });
}

async function imagePrediction(id){
    console.log(">>"+id)
}

function goBack() {
    window.history.back();
}

// Call function on page load
getUserDetails();
