 // ==== database management ====
 var users = [];
 var currentPage = 1;
 var limit = 10;

 async function searchById() {
    const id = document.getElementById("searchId").value.trim();

    if (!id ) {
        fetchComments(); // Fetch all users if the search field is empty
        return;
    }

    console.log("Searching for comments by user_id:", id);

    try {
        const response = await fetch(`http://localhost:4000/comments/${id}`);

        if (response.ok) {
            const comments = await response.json();
            console.log("Comments found:", comments);

            users = comments; // Store results in the array
            currentPage = 1;
            displayComments(); // Call the function to display comments
        } else {
            alert(`No comments found for user_id ${id}.`);
        }
    } catch (error) {
        console.error("Error fetching comments:", error);
        alert("Error connecting to the server.");
    }
    document.getElementById("searchId").value = "";
}


 async function fetchComments() {
    console.log("Fetch")
     try {
         const response = await fetch('http://localhost:4000/comments');
         users = await response.json();
         displayComments();
     } catch (error) {
         console.error("Error fetching users:", error);
     }
 }
 function displayComments() {
    const tableBody = document.getElementById('userTable');
    tableBody.innerHTML = '';

    const start = (currentPage - 1) * limit;
    const end = start + limit;
    const paginatedUsers = users.slice(start, end);

    paginatedUsers.forEach(user => {
        console.log(user);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><span class="user-id-link" onclick="viewUser(${user.user_id})">${user.user_id}</span></td>
            <td><input type="text" value="${user.created_at}" id="name-${user.created_at}" disabled></td>
            <td><input type="email" value="${user.comment_text}" id="email-${user.comment_text}" disabled></td>
            <td><input type="email" value="${getSentimentText(user.sentiment)}" id="sentiment-${user.sentiment}" disabled></td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="deleteComment(${user.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    document.getElementById('pageNumber').innerText = `Page ${currentPage} / ${Math.ceil(users.length / limit)}`;
}
function viewUser(id) {
    window.location.href = `user-detail.html?id=${id}`;
}

async function deleteComment(commentId) {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
        const response = await fetch(`http://localhost:4000/comments/${commentId}`, {
            method: 'DELETE',
        });

        const result = await response.json();
        if (response.ok) {
            // alert(result.message);
            fetchComments(); // Refresh the comments list
        } else {
            alert("Failed to delete comment: " + result.message);
        }
    } catch (error) {
        console.error("Error deleting comment:", error);
        alert("Failed to delete comment.");
    }
}


function getSentimentText(sentiment) {
    if (sentiment > 0.002) {
        return "Positive";
    } else if (sentiment < -0.002) {
        return "Negative";
    } else {
        return "Natural";
    }
}

 function nextPage() {
     if (currentPage * limit < users.length) {
         currentPage++;
         displayComments();
     }
 }

 function prevPage() {
     if (currentPage > 1) {
         currentPage--;
         displayComments();
     }
 }

 
 fetchComments();