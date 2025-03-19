 // ==== database management ====
 var users = [];
 var currentPage = 1;
 var limit = 10;

 async function fetchUsers() {
    console.log("Fetch")
     try {
         const response = await fetch('http://localhost:4000/users');
         users = await response.json();
         displayUsers();
     } catch (error) {
         console.error("Error fetching users:", error);
     }
 }
async function addUser() {
const name = document.getElementById("newName").value.trim();
const email = document.getElementById("newEmail").value.trim();

if (!name || !email) {
 alert("Please enter both name and email!");
 return;
}

try {
 const response = await fetch("http://localhost:4000/users", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ name, email })
 });

 if (response.ok) {
     document.getElementById("newName").value = "";
     document.getElementById("newEmail").value = "";
     fetchUsers(); // Refresh the user list
 } else {
     alert("Error adding user. Please try again.");
 }
} catch (error) {
 console.error("Error adding user:", error);
 alert("Error connecting to the server.");
}
}

 function displayUsers() {
     const tableBody = document.getElementById('userTable');
     tableBody.innerHTML = '';

     const start = (currentPage - 1) * limit;
     const end = start + limit;
     const paginatedUsers = users.slice(start, end);

     paginatedUsers.forEach(user => {
         const row = document.createElement('tr');
         row.innerHTML = `
             <td><span class="user-id-link" onclick="viewUser(${user.id})">${user.id}</span></td>
             <td><input type="text" value="${user.name}" id="name-${user.id}" disabled></td>
             <td><input type="email" value="${user.email}" id="email-${user.id}" disabled></td>
             <td>
                 <button class="btn btn-warning btn-sm" onclick="enableEdit(${user.id})" id="edit-${user.id}">Edit</button>
                 <button class="btn btn-success btn-sm" onclick="updateUser(${user.id})" id="update-${user.id}" style="display:none;">Update</button>
                 <button class="btn btn-secondary btn-sm" onclick="cancelEdit(${user.id})" id="cancel-${user.id}" style="display:none;">Cancel</button>
                 <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">Delete</button>
             </td>
         `;
         tableBody.appendChild(row);
     });

     document.getElementById('pageNumber').innerText = `Page ${currentPage} / ${Math.ceil(users.length / limit)}`;
 }
 function viewUser(id) {
     window.location.href = `user-detail.html?id=${id}`;
 }
 function enableEdit(id) {
     document.getElementById(`name-${id}`).disabled = false;
     document.getElementById(`email-${id}`).disabled = false;
     document.getElementById(`edit-${id}`).style.display = 'none';
     document.getElementById(`update-${id}`).style.display = 'inline';
     document.getElementById(`cancel-${id}`).style.display = 'inline';
 }

 function cancelEdit(id) {
     const user = users.find(user => user.id === id);
     document.getElementById(`name-${id}`).value = user.name;
     document.getElementById(`email-${id}`).value = user.email;
     document.getElementById(`name-${id}`).disabled = true;
     document.getElementById(`email-${id}`).disabled = true;
     document.getElementById(`edit-${id}`).style.display = 'inline';
     document.getElementById(`update-${id}`).style.display = 'none';
     document.getElementById(`cancel-${id}`).style.display = 'none';
 }

 async function updateUser(id) {
     const name = document.getElementById(`name-${id}`).value;
     const email = document.getElementById(`email-${id}`).value;
     console.log(id, name, email)
     await fetch(`http://localhost:4000/users/${id}`, {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ name, email })
     });

     cancelEdit(id);
     fetchUsers();
 }

 function nextPage() {
     if (currentPage * limit < users.length) {
         currentPage++;
         displayUsers();
     }
 }

 function prevPage() {
     if (currentPage > 1) {
         currentPage--;
         displayUsers();
     }
 }

 async function deleteUser(id) {
    console.log("delete:"+id)
     await fetch(`http://localhost:4000/users/${id}`, { method: 'DELETE' });
     fetchUsers();
 }
 fetchUsers();