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
    try {
        const response = await fetch('http://localhost:4000/files');
        const files = await response.json();

        const fileList = document.getElementById('fileList');
        fileList.innerHTML = '';

        files.forEach(file => {
            console.log(file)
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item', 'file-item');
            listItem.innerHTML = `

               
                // <td><span >${user.id}</span></td>
                // <td><input type="text" value="${user.created_at}" id="name-${user.id}" disabled></td>
                // <td><input type="email" value="${user.comment_text}" id="email-${user.id}" disabled></td>
                // <td><input type="email" value="${getSentimentText(user.sentiment)}" id="email-${user.id}" disabled></td>
       

                <span>${file.filename}</span>
                <div>
                    <a href="http://localhost:4000/files/${file.filename}" download class="btn btn-sm btn-success">Download</a>
                    <button class="btn btn-sm btn-danger" onclick="deleteFile(${file.id})">Delete</button>
                </div>
            `;
            fileList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error fetching files:", error);
    }
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

// Fetch files when page loads
fetchFiles();