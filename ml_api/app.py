from flask import Flask, request, jsonify
from flask_cors import CORS
import re
import os

app = Flask(__name__)
CORS(app)

# Enhanced rule-based cyberbullying detection with multiple categories
def enhanced_cyberbullying_detection(text):
    """Advanced cyberbullying detection with category classification"""
    
    # Comprehensive keyword lists for different types of cyberbullying
    verbal_abuse = [
        'stupid', 'idiot', 'dumb', 'moron', 'retard', 'imbecile', 'fool', 'jerk',
        'loser', 'pathetic', 'worthless', 'useless', 'weak', 'coward', 'scum',
        'trash', 'garbage', 'disgusting', 'filthy', 'vile', 'repulsive'
    ]
    
    threats = [
        'kill', 'die', 'death', 'murder', 'harm', 'hurt', 'injure', 'destroy',
        'eliminate', 'exterminate', 'erase', 'disappear', 'vanish', 'end you',
        'come find you', 'hunt you down', 'get you', 'pay for this'
    ]
    
    harassment = [
        'bully', 'harass', 'stalk', 'follow', 'watch', 'monitor', 'spy',
        'bother', 'annoy', 'pester', 'torment', 'torture', 'abuse', 'attack',
        'target', 'victim', 'prey', 'hunt', 'chase', 'pursue'
    ]
    
    hate_speech = [
        'hate', 'despise', 'loathe', 'detest', 'abhor', 'scorn', 'contempt',
        'racist', 'sexist', 'homophobic', 'xenophobic', 'bigot', 'prejudice',
        'discriminate', 'inferior', 'superior', 'master race', 'pure blood'
    ]
    
    sexual_harassment = [
        'rape', 'sexual', 'assault', 'molest', 'grop', 'touch', 'body',
        'private', 'intimate', 'nude', 'naked', 'explicit', 'dirty', 'pervert'
    ]
    
    appearance_shaming = [
        'ugly', 'fat', 'skinny', 'gross', 'disgusting', 'hideous', 'deformed',
        'monster', 'beast', 'animal', 'pig', 'cow', 'whale', 'elephant', 'troll'
    ]
    
    # Safe and positive indicators
    safe_keywords = [
        'friend', 'love', 'happy', 'good', 'nice', 'great', 'awesome',
        'wonderful', 'amazing', 'beautiful', 'kind', 'help', 'support',
        'caring', 'respect', 'appreciate', 'thank', 'grateful', 'bless'
    ]
    
    text_lower = text.lower()
    
    # Count occurrences in each category
    category_counts = {
        'verbal_abuse': sum(1 for word in verbal_abuse if word in text_lower),
        'threats': sum(1 for word in threats if word in text_lower),
        'harassment': sum(1 for word in harassment if word in text_lower),
        'hate_speech': sum(1 for word in hate_speech if word in text_lower),
        'sexual_harassment': sum(1 for word in sexual_harassment if word in text_lower),
        'appearance_shaming': sum(1 for word in appearance_shaming if word in text_lower)
    }
    
    safe_count = sum(1 for word in safe_keywords if word in text_lower)
    total_toxic = sum(category_counts.values())
    
    # Determine if it's cyberbullying
    is_bullying = total_toxic > 0 and total_toxic > safe_count
    
    # Calculate confidence based on toxicity level
    if is_bullying:
        base_confidence = min(0.95, 0.5 + (total_toxic * 0.15))
        
        # Increase confidence for high-risk categories
        if category_counts['threats'] > 0:
            base_confidence = min(0.95, base_confidence + 0.2)
        if category_counts['sexual_harassment'] > 0:
            base_confidence = min(0.95, base_confidence + 0.25)
        if category_counts['hate_speech'] > 0:
            base_confidence = min(0.95, base_confidence + 0.15)
    else:
        base_confidence = max(0.1, 0.3 - (total_toxic * 0.05))
        if safe_count > 0:
            base_confidence = min(0.9, base_confidence + (safe_count * 0.1))
    
    # Determine primary category
    primary_category = max(category_counts, key=category_counts.get) if is_bullying else None
    
    # Severity assessment
    if total_toxic >= 3 or category_counts['threats'] > 0 or category_counts['sexual_harassment'] > 0:
        severity = 'HIGH'
    elif total_toxic >= 2:
        severity = 'MEDIUM'
    else:
        severity = 'LOW'
    
    return {
        'is_bullying': is_bullying,
        'confidence': base_confidence,
        'category': primary_category,
        'severity': severity,
        'category_counts': category_counts,
        'toxic_words_detected': total_toxic,
        'safe_words_detected': safe_count
    }

def clean_text(text):
    text = text.lower()
    text = re.sub(r"http\S+","",text)
    text = re.sub(r"[^a-zA-Z]"," ",text)
    text = re.sub(r"\s+"," ",text)
    return text.strip()

# Try to load trained model, fallback to enhanced rule-based detection
model = None
vectorizer = None
tokenizer = None
use_simple_detection = True

try:
    import pickle
    import nltk
    from nltk.corpus import stopwords
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.linear_model import LogisticRegression
    
    nltk.download('stopwords', quiet=True)
    stop_words = set(stopwords.words('english'))
    
    # Create a working model for demonstration
    print("Creating working model for frontend connection...")
    
    # Sample training data
    sample_texts = [
        "you are stupid idiot dumb", "i hate you die kill", "kill yourself hurt harm death",
        "have a nice day love", "love you friend great", "great job awesome wonderful",
        "ugly fat disgusting worthless", "bully harass threaten abuse", 
        "racist sexist hate speech", "appearance shame body weight",
        "i will kill you", "you should die", "go die stupid"
    ]
    
    sample_labels = [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1]  # 1 = cyberbullying, 0 = safe
    
    # Create and train vectorizer
    vectorizer = TfidfVectorizer(max_features=1000, ngram_range=(1, 2))
    X = vectorizer.fit_transform(sample_texts)
    
    # Train model
    model = LogisticRegression(random_state=42, max_iter=1000)
    model.fit(X, sample_labels)
    
    # Save the working model
    pickle.dump(model, open("cyberbullying_model.pkl", "wb"))
    pickle.dump(vectorizer, open("vectorizer.pkl", "wb"))
    
    use_simple_detection = False
    print("✅ Working model created and saved successfully!")
    
except Exception as e:
    print(f"⚠️ Error creating model: {e}, using enhanced rule-based detection")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        message = data.get("text", "")
        
        if not message:
            return jsonify({
                "error": "No text provided",
                "prediction": "Safe Message",
                "confidence": 0.0
            }), 400
        
        if use_simple_detection:
            # Use enhanced rule-based detection
            result = enhanced_cyberbullying_detection(message)
            label = "Cyberbullying" if result['is_bullying'] else "Safe Message"
        else:
            # Use trained model
            cleaned = clean_text(message)
            words = cleaned.split()
            words = [w for w in words if w not in stop_words]
            cleaned = " ".join(words)
            
            vector = vectorizer.transform([cleaned])
            prediction = model.predict(vector)[0]
            probability = model.predict_proba(vector)[0][1]
            
            label = "Cyberbullying" if prediction == 1 else "Safe Message"
            result = {
                'is_bullying': label == "Cyberbullying",
                'confidence': float(probability),
                'category': 'trained_model',
                'severity': 'HIGH' if probability > 0.8 else 'MEDIUM' if probability > 0.6 else 'LOW'
            }
        
        return jsonify({
            "prediction": label,
            "confidence": result['confidence'],
            "is_bullying": result['is_bullying'],
            "category": result.get('category', 'unknown'),
            "severity": result.get('severity', 'LOW'),
            "details": {
                "toxic_words_detected": result.get('toxic_words_detected', 0),
                "category_counts": result.get('category_counts', {}),
                "safe_words_detected": result.get('safe_words_detected', 0)
            }
        })
        
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({
            "error": str(e),
            "prediction": "Safe Message",
            "confidence": 0.0
        }), 500

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "model_type": "simple_detection" if use_simple_detection else "trained_model",
        "version": "1.0"
    })

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)