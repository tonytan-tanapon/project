var users = [];
var currentPage = 1;
var limit = 10;
document.getElementById('imageUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const imagePreview = document.getElementById('imagePreview');
    imagePreview.src = URL.createObjectURL(file);
    imagePreview.style.display = "block"; // Show the image
});

async function classifyImage() {
    const imgInput = document.getElementById('imageUpload');
    const resultText = document.getElementById('result');
    const imgPreview = document.getElementById('imagePreview');

    if (!imgInput.files.length) {
        alert("Please upload an image!");
        return;
    }

    const model = await mobilenet.load(); // Load the MobileNet model
    const predictions = await model.classify(imgPreview);

    resultText.innerHTML = `Prediction: ${predictions[0].className} (${(predictions[0].probability * 100).toFixed(2)}%)`;
}