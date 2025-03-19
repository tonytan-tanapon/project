var files = [];
var currentPage = 1;
var limit = 10;

async function searchUserById() {
    const id = document.getElementById("searchId").value.trim();

    if (!id) {
        fetchFiles(); // Fetch all users if the search field is empty
        return;
    }

    console.log("Searching for comments by user_id:", id);

    try {
        const response = await fetch(`http://localhost:4000/user_files/${id}`);

        if (response.ok) {
            const comments = await response.json();
            console.log("Comments found:", comments);

            files = comments; // Store results in the array
            currentPage = 1;
            displayfile(); // Call the function to display comments
        } else {
            alert(`No comments found for user_id ${id}.`);
        }
    } catch (error) {
        console.error("Error fetching comments:", error);
        alert("Error connecting to the server.");
    }

    document.getElementById("searchId").value = "";
}


async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const status = document.getElementById('status');

    if (!fileInput.files.length) {
        status.innerText = "Please select a file.";
        status.classList.add("text-danger");
        return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
        const response = await fetch('http://localhost:4000/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        status.innerText = result.message;
        status.classList.remove("text-danger");
        status.classList.add("text-success");
        
     
        // Refresh file list after upload
        fetchFiles();
    } catch (error) {
        status.innerText = "Upload failed.";
        status.classList.add("text-danger");
        console.error(error);
    }
}

async function fetchFiles() {
    // try {
    //     const response = await fetch('http://localhost:4000/files');
    //     const files = await response.json();
    //     displayfile();
    // } catch (error) {
    //     console.error("Error fetching files:", error);
    // }

    console.log("Fetch")
     try {
         const response = await fetch('http://localhost:4000/files');
         files = await response.json();
        //  console.log(users)
         displayfile();
     } catch (error) {
         console.error("Error fetching users:", error);
     }
}

function displayfile(){
    
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = '';

    console.log(files)
    const start = (currentPage - 1) * limit;
    const end = start + limit;
    const paginatedUsers = files.slice(start, end);

    paginatedUsers.forEach(file => {
        //  console.log(file)
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><span class="user-id-link" onclick="viewUser(${file.user_id})">${file.user_id}</span></td>
            
            <td><span >${file.filename}</span></td>
            <td><span >${file.upload_date}</span></td>
            <td><span >${file.click}</span></td>
            <td>  <a href="http://localhost:4000/files/${file.filename}" download class="btn btn-sm btn-success">Download</a></td>
            <td>   <button class="btn btn-sm btn-danger" onclick="deleteFile(${file.id})">Delete</button></td>
    `;
    fileList.appendChild(row);
       
    });
}
function viewUser(id) {
    window.location.href = `user-detail.html?id=${id}`;
}
async function deleteFile(fileId) {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
        await fetch(`http://localhost:4000/files/${fileId}`, { method: 'DELETE' });
        fetchFiles(); // Refresh file list after deletion
    } catch (error) {
        console.error("Error deleting file:", error);
    }
}


function nextPage() {
    if (currentPage * limit < files.length) {
        currentPage++;
        displayfile();
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayfile();
    }
}

// Fetch files when page loads
fetchFiles();