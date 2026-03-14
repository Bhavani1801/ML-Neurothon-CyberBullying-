# ============================================================
# THREAT-FOCUSED FINAL TRAINING
# Specialized training for better threat detection
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
nltk.download('stopwords', quiet=True)
stop_words = set(stopwords.words('english'))

def clean_text(text):
    """Minimal cleaning to preserve threat indicators"""
    text = str(text).lower()
    text = re.sub(r'http\S+', '', text)
    text = re.sub(r'[^a-zA-Z]', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    # Keep important words for threat detection
    minimal_stop = {'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
                    'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
                    'to', 'was', 'were', 'been', 'have', 'this', 'would', 'could'}
    words = text.split()
    words = [w for w in words if w not in minimal_stop]
    return " ".join(words)

print("Loading dataset for threat-focused training...")

try:
    # Load your dataset
    data = pd.read_csv("cyberbullying_tweets[1].csv", encoding="latin1", on_bad_lines="skip")
    data = data[['tweet_text', 'cyberbullying_type']].drop_duplicates()
    data = data[data['tweet_text'].str.split().str.len() > 2]
    
    # Add extensive threat examples
    extensive_threats = [
        # Direct kill threats
        "i will kill you", "i will find you kill", "i want to kill you", "i am going to kill you",
        "you should die", "go die", "go die now", "die stupid", "die bitch", "die bastard",
        "kill yourself", "kill yourself now", "go kill yourself", "go kill urself",
        "i hope you die", "i wish you would die", "i wish you were dead",
        
        # Violence threats
        "i will hurt you", "i will harm you", "i will beat you", "i will punch you",
        "i will stab you", "i will shoot you", "i will destroy you", "i will end you",
        
        # Death wishes
        "you deserve to die", "youre going to die", "you will die", "drop dead",
        "rot in hell", "burn in hell", "go to hell",
        
        # Intimidation
        "you will regret this", "watch your back", "youre dead meat", "youre dead to me",
        "i will get you", "i will come for you", "i will make you pay",
        
        # Multiple variations
        "will kill u", "kill u now", "u should die", "go die u", "die u stupid",
        "i kill u", "u die now", "kill urself", "go kill urself"
    ]
    
    # Create threat dataframe
    threat_df = pd.DataFrame({
        'tweet_text': extensive_threats,
        'cyberbullying_type': ['death_threat'] * len(extensive_threats)
    })
    
    # Add other bullying examples
    other_bullying = [
        "you are stupid", "you are idiot", "you are dumb", "you are ugly",
        "i hate you", "you are worthless", "you are pathetic",
        "bully harass abuse", "racist sexist hate"
    ] * 5  # Repeat for balance
    
    bullying_df = pd.DataFrame({
        'tweet_text': other_bullying,
        'cyberbullying_type': ['bullying'] * len(other_bullying)
    })
    
    # Add safe examples
    safe_examples = [
        "have a great day", "love my friends", "nice weather today",
        "good morning everyone", "thank you so much", "happy birthday",
        "congratulations", "well done", "great job", "you are amazing",
        "wonderful person", "kind heart", "beautiful soul"
    ] * 8  # Repeat for balance
    
    safe_df = pd.DataFrame({
        'tweet_text': safe_examples,
        'cyberbullying_type': ['not_cyberbullying'] * len(safe_examples)
    })
    
    # Combine all data
    combined_data = pd.concat([data, threat_df, bullying_df, safe_df], ignore_index=True)
    
    # Sample for training with emphasis on threats
    threat_samples = combined_data[combined_data['cyberbullying_type'] == 'death_threat']
    other_samples = combined_data[combined_data['cyberbullying_type'] != 'death_threat'].sample(6000, random_state=42)
    
    final_data = pd.concat([threat_samples, other_samples], ignore_index=True)
    
    print(f"Final training dataset size: {len(final_data)}")
    print("Label distribution:")
    print(final_data['cyberbullying_type'].value_counts())
    
    # Create binary labels
    final_data['label'] = final_data['cyberbullying_type'].apply(
        lambda x: 0 if x == 'not_cyberbullying' else 1
    )
    
    print("Binary label distribution:")
    print(final_data['label'].value_counts())
    
    # Clean text
    final_data['cleaned_text'] = final_data['tweet_text'].apply(clean_text)
    final_data = final_data[final_data['cleaned_text'].str.strip() != '']
    
    # Prepare features
    X = final_data['cleaned_text']
    y = final_data['label']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # Create enhanced vectorizer for threat detection
    vectorizer = TfidfVectorizer(
        max_features=20000, 
        ngram_range=(1, 4),  # Up to 4-grams for better threat detection
        min_df=1,
        max_df=0.85,
        analyzer='word'
    )
    
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)
    
    print(f"Feature matrix shape: {X_train_tfidf.shape}")
    
    # Train model with emphasis on threat detection
    model = LogisticRegression(
        random_state=42, 
        max_iter=3000, 
        class_weight='balanced',
        C=2.0,  # Higher regularization
        solver='liblinear'
    )
    
    model.fit(X_train_tfidf, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test_tfidf)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"\nAccuracy: {accuracy:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Test critical threats
    def test_threat(message):
        cleaned = clean_text(message)
        vector = vectorizer.transform([cleaned])
        prediction = model.predict(vector)[0]
        probability = model.predict_proba(vector)[0][1]
        
        result = "CYBERBULLYING" if prediction else "SAFE"
        confidence = probability * 100
        
        print(f"'{message}' -> {result} ({confidence:.1f}%)")
        return prediction, probability
    
    print("\n" + "="*70)
    print("FINAL THREAT DETECTION TESTING")
    print("="*70)
    
    critical_tests = [
        "I will kill you",
        "You should die", 
        "Go kill yourself",
        "I hope you die",
        "I will hurt you",
        "You will regret this",
        "Watch your back",
        "You are stupid",
        "Have a great day"
    ]
    
    threats_correct = 0
    total_threats = 0
    
    for test in critical_tests:
        pred, conf = test_threat(test)
        
        # Check if it's a critical threat
        is_critical_threat = any(word in test.lower() for word in ['kill', 'die', 'hurt'])
        if is_critical_threat:
            total_threats += 1
            if pred:
                threats_correct += 1
    
    # Save final model
    pickle.dump(model, open('cyberbullying_model.pkl', 'wb'))
    pickle.dump(vectorizer, open('vectorizer.pkl', 'wb'))
    
    print(f"\n✅ Final threat-focused model saved!")
    print(f"🎯 Threat Detection: {threats_correct}/{total_threats} threats correctly identified")
    
    if threats_correct == total_threats:
        print("🎉 PERFECT! All threats are now detected!")
    elif threats_correct >= total_threats * 0.8:
        print("✅ GOOD! Most threats are detected!")
    else:
        print(f"⚠️ {total_threats - threats_correct} threats still need work")

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
