# Database & File Management Web Application

## Overview
This web application is a full-stack project designed to manage user data in a database, handle file uploads and downloads, integrate AI-based image classification using TensorFlow.js, and provide a linear search animation. The project is built with HTML, CSS (Bootstrap), JavaScript, and TensorFlow.js for AI functionality. It interacts with a backend server to fetch, update, and delete user data and files.

## Features
1. **Database Management**
   - Add, edit, update, and delete users.
   - Pagination to navigate through users.
   - Fetch user data from the backend.

2. **File Upload & Download**
   - Upload files to the server.
   - List all uploaded files with options to download or delete.

3. **AI Image Classification**
   - Upload an image and classify it using TensorFlow.js (MobileNet model).
   - Display classification results on the UI.

4. **Linear Search Animation**
   - Generate an array of random numbers.
   - Perform a linear search on the array.
   - Animate the search process and display search results.

## Technologies Used
- **Frontend**: HTML, CSS (Bootstrap), JavaScript
- **Backend**: Node.js (Assumed API for user and file management)
- **Database**: PostgreSQL / MySQL (Based on API setup)
- **AI**: TensorFlow.js (MobileNet model for image classification)

## Installation & Setup
### Prerequisites
- Node.js installed
- PostgreSQL or MySQL database setup

### Steps to Run the Project
1. **Clone the Repository**
   ```sh
   git clone https://github.com/your-username/your-repository.git
   cd your-repository
   ```

2. **Install Dependencies**
   ```sh
   npm install
   ```

3. **Run Backend Server** (Assuming an Express.js backend)
   ```sh
   node server.js
   ```

4. **Open `index.html` in a Browser**

## API Endpoints
- **User Management**
  - `GET /users` - Fetch all users
  - `POST /users` - Add a new user
  - `PUT /users/:id` - Update user information
  - `DELETE /users/:id` - Delete a user

- **File Management**
  - `POST /upload` - Upload a file
  - `GET /files` - Fetch uploaded files
  - `GET /files/:filename` - Download a file
  - `DELETE /files/:id` - Delete a file

## Usage
- Navigate through tabs to access different features.
- Add users in the database section.
- Upload and manage files in the file management section.
- Classify images using AI in the AI tab.
- Run a linear search visualization in the search tab.

## Contributing
Feel free to fork this repository and contribute to the project. If you encounter any issues, submit a pull request or open an issue.

## License
This project is licensed under the MIT License.

## Author
**Tony Tantisripreecha**  
[GitHub Profile](https://tonytan-tanapon.github.io/index.html)


![image](https://github.com/user-attachments/assets/df3e3cb3-6d8b-4f7e-8fca-ed90a2ee013d)
![image](https://github.com/user-attachments/assets/b36443f9-6228-481f-a250-9f3301606f62)
![image](https://github.com/user-attachments/assets/a96f9940-f1ee-4ac4-ab83-e228c811d414)
![image](https://github.com/user-attachments/assets/6da64d9f-b4a6-4543-9e1e-8cbbc7472bd4)


