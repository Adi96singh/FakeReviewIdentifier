document.getElementById('check-button').addEventListener('click', async () => {
    const reviewText = document.getElementById('review-input').value.trim();
    const resultDiv = document.getElementById('result');
    
    // Clear previous result and styles
    resultDiv.textContent = '';
    resultDiv.classList.remove('fake', 'genuine');  // Clear previous classes

    if (!reviewText) {
        resultDiv.textContent = '😅 Oops! You forgot to type something.';
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ review: reviewText })
        });
        
        if (!response.ok) {
            throw new Error('Server error');
        }
        
        const data = await response.json();
        const prediction = data.prediction;

        // Add class based on the prediction
        if (prediction === "Fake") {
            resultDiv.classList.add('fake');
            resultDiv.innerHTML = `🚨 <span>Fake Alert!</span> 🧐 This review seems a bit shady.`;
        } else {
            resultDiv.classList.add('genuine');
            resultDiv.innerHTML = `🎉 <span>Genuine!</span> This review looks trustworthy!`;
        }

    } catch (error) {
        console.error(error);
        resultDiv.textContent = '⚠️ Error: Unable to contact the prediction server.';
    }
});
