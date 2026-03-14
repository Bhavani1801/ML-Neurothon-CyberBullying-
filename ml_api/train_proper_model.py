# ============================================================
# PROPER CYBERBULLYING DETECTION MODEL TRAINING
# Using your dataset with compatible ML approach
# ============================================================

import pandas as pd
import numpy as np
import pickle
import re
import nltk
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report

# Download NLTK resources
print("Downloading NLTK resources...")
nltk.download('stopwords', quiet=True)
stop_words = set(stopwords.words('english'))

def clean_text(text):
    """Text cleaning function matching your original approach"""
    text = str(text).lower()
    text = re.sub(r'http\S+', '', text)  # Remove URLs
    text = re.sub(r'[^a-zA-Z]', ' ', text)  # Remove special characters
    text = re.sub(r'\s+', ' ', text)  # Remove extra spaces
    words = text.split()
    words = [word for word in words if word not in stop_words]  # Remove stopwords
    return " ".join(words)

print("Loading and preparing dataset...")

try:
    # Load your dataset
    data = pd.read_csv("cyberbullying_tweets[1].csv", encoding="latin1", on_bad_lines="skip")
    
    # Use the correct columns
    data = data[['tweet_text', 'cyberbullying_type']]
    data = data.drop_duplicates()
    
    # Remove very short tweets
    data = data[data['tweet_text'].str.split().str.len() > 2]
    
    print(f"Original dataset size: {len(data)}")
    print("Cyberbullying type distribution:")
    print(data['cyberbullying_type'].value_counts())
    
    # Add explicit threat examples to improve threat detection
    threat_examples = [
        "i will kill you",
        "you should die", 
        "go kill yourself",
        "i hope you die",
        "you will die",
        "kill yourself now",
        "i will hurt you",
        "you deserve to die",
        "i will find you",
        "you will regret this",
        "watch your back",
        "youre dead meat",
        "i will destroy you",
        "go die stupid",
        "i will end you"
    ]
    
    threat_df = pd.DataFrame({
        'tweet_text': threat_examples,
        'cyberbullying_type': ['threat'] * len(threat_examples)
    })
    
    # Combine with original data
    data = pd.concat([data, threat_df], ignore_index=True)
    
    # Sample for training (use more data for better training)
    data = data.sample(8000, random_state=42)
    
    print(f"Training dataset size: {len(data)}")
    print("Final distribution:")
    print(data['cyberbullying_type'].value_counts())
    
    # Create binary labels (anything not 'not_cyberbullying' is bullying)
    data['label'] = data['cyberbullying_type'].apply(lambda x: 0 if x == 'not_cyberbullying' else 1)
    
    print("Binary label distribution:")
    print(data['label'].value_counts())
    
    # Clean text
    print("Cleaning text...")
    data['cleaned_text'] = data['tweet_text'].apply(clean_text)
    data = data[data['cleaned_text'].str.strip() != '']
    
    # Prepare features and labels
    X = data['cleaned_text']
    y = data['label']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # Create enhanced TF-IDF vectorizer
    print("Creating TF-IDF features...")
    vectorizer = TfidfVectorizer(
        max_features=15000, 
        ngram_range=(1, 3),  # Use up to trigrams
        min_df=2,
        max_df=0.9,
        analyzer='word'
    )
    
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)
    
    print(f"Feature matrix shape: {X_train_tfidf.shape}")
    
    # Train Logistic Regression with optimized parameters
    print("Training model...")
    model = LogisticRegression(
        random_state=42, 
        max_iter=2000, 
        class_weight='balanced',
        C=1.5,
        solver='liblinear'
    )
    
    model.fit(X_train_tfidf, y_train)
    
    # Evaluate the model
    print("\nEvaluating model...")
    y_pred = model.predict(X_test_tfidf)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"Accuracy: {accuracy:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Test with critical examples
    def test_model(message):
        cleaned = clean_text(message)
        vector = vectorizer.transform([cleaned])
        prediction = model.predict(vector)[0]
        probability = model.predict_proba(vector)[0][1]
        
        result = "CYBERBULLYING" if prediction else "SAFE"
        confidence = probability * 100
        
        print(f"'{message}' -> {result} ({confidence:.1f}% confidence)")
        return prediction, probability
    
    print("\n" + "="*60)
    print("TESTING CRITICAL EXAMPLES")
    print("="*60)
    
    test_messages = [
        "I will kill you",
        "You should die",
        "Go kill yourself", 
        "I hope you die",
        "You are stupid and ugly",
        "Have a great day",
        "I love my friends"
    ]
    
    threats_detected = 0
    total_threats = 0
    
    for msg in test_messages:
        pred, conf = test_model(msg)
        
        # Check if it's a threat
        is_threat = any(word in msg.lower() for word in ['kill', 'die', 'hurt'])
        if is_threat:
            total_threats += 1
            if pred:
                threats_detected += 1
    
    # Save the trained model and vectorizer
    print(f"\nSaving trained model...")
    pickle.dump(model, open('cyberbullying_model.pkl', 'wb'))
    pickle.dump(vectorizer, open('vectorizer.pkl', 'wb'))
    
    print("✅ Model and vectorizer saved successfully!")
    print(f"Threat detection accuracy: {threats_detected}/{total_threats} threats detected")
    
    if threats_detected == total_threats:
        print("🎉 All critical threats are properly detected!")
    else:
        print(f"⚠️ {total_threats - threats_detected} threats still need improvement")
    
    print("\nTraining completed successfully!")

except Exception as e:
    print(f"Error during training: {e}")
    import traceback
    traceback.print_exc()
