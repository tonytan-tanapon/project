let model;

// Load the Universal Sentence Encoder model
async function loadModel() {
    model = await use.load();
    console.log("Model loaded.");
}
loadModel();

async function analyzeSentiment() {
    const text = document.getElementById("textInput").value.trim();
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

    let sentiment;
    if (sentimentScore > 0.02) {
        sentiment = "Positive with score: "+sentimentScore;
    } else if (sentimentScore < -0.02) {
        sentiment = "Negative with score: "+sentimentScore;
    } else {
        sentiment = "Neutral with score: "+sentimentScore;
    }

    document.getElementById("result").innerText = `Sentiment: ${sentiment}`;
}