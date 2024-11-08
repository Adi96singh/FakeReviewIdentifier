from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load model and vectorizer
model = joblib.load('fake_review_model.pkl')
tfidf_vectorizer = joblib.load('tfidf_vectorizer.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    review_text = data.get('review')

    if not review_text:
        return jsonify({'error': 'No review text provided'}), 400

    # Vectorize the review text
    review_vectorized = tfidf_vectorizer.transform([review_text])
    review_df = pd.DataFrame(review_vectorized.toarray())
    review_df['rating'] = 5
    review_df.columns = review_df.columns.astype(str)

    # Get prediction
    prediction = model.predict(review_df)[0]
    result = "Fake" if prediction == 1 else "Genuine"
    return jsonify({'review': review_text, 'prediction': result})

if __name__ == '__main__':
    app.run(debug=True)
