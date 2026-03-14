# ============================================================
# CYBERBULLYING DETECTION SYSTEM (FAST VERSION)
# DistilBERT + Logistic Regression + LIME
# ============================================================

import pandas as pd
import numpy as np
import torch
import re
import nltk
import pickle

from transformers import AutoTokenizer, AutoModel
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report

from lime.lime_text import LimeTextExplainer
from nltk.corpus import stopwords

# ============================================================
# NLTK
# ============================================================

nltk.download('stopwords')
stop_words = set(stopwords.words('english'))

# ============================================================
# LOAD DATASET
# ============================================================

print("Loading dataset...")

data = pd.read_csv(
    "cyberbullying_tweets[1].csv",
    encoding="latin1",
    on_bad_lines="skip"
)

data = data[['tweet_text','cyberbullying_type']]

data.drop_duplicates(inplace=True)

# Reduce dataset size for faster training
data = data.sample(6000, random_state=42)

# Remove very short tweets
data = data[data['tweet_text'].str.split().str.len() > 2]

print("Dataset size:", len(data))

# ============================================================
# TEXT CLEANING
# ============================================================

def clean_text(text):

    text = str(text).lower()

    text = re.sub(r"http\S+","",text)

    text = re.sub(r"[^a-zA-Z ]"," ",text)

    text = re.sub(r"\s+"," ",text)

    words = text.split()

    words = [w for w in words if w not in stop_words]

    return " ".join(words)


print("Cleaning text...")

data['clean_text'] = data['tweet_text'].apply(clean_text)

# ============================================================
# CREATE BINARY LABEL
# ============================================================

data['label'] = data['cyberbullying_type'].apply(
    lambda x: 0 if x=="not_cyberbullying" else 1
)

# ============================================================
# LOAD DISTILBERT
# ============================================================

print("Loading DistilBERT...")

tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")
model = AutoModel.from_pretrained("distilbert-base-uncased")

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model.to(device)

print("DistilBERT loaded")

# ============================================================
# EMBEDDING FUNCTION
# ============================================================

def get_embeddings(texts):

    inputs = tokenizer(
        texts,
        return_tensors="pt",
        padding=True,
        truncation=True,
        max_length=64
    )

    inputs = {k:v.to(device) for k,v in inputs.items()}

    with torch.no_grad():

        outputs = model(**inputs)

    embeddings = outputs.last_hidden_state[:,0,:]

    return embeddings.cpu().numpy()

# ============================================================
# GENERATE EMBEDDINGS
# ============================================================

print("Generating embeddings...")

batch_size = 64

texts = data['clean_text'].tolist()

X = []

for i in range(0,len(texts),batch_size):

    batch = texts[i:i+batch_size]

    emb = get_embeddings(batch)

    X.extend(emb)

X = np.array(X)

y = data['label']

print("Embedding shape:",X.shape)

# ============================================================
# TRAIN TEST SPLIT
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# ============================================================
# TRAIN MODEL
# ============================================================

print("Training classifier...")

clf = LogisticRegression(max_iter=2000)

clf.fit(X_train,y_train)

print("Training completed")

# ============================================================
# EVALUATION
# ============================================================

pred = clf.predict(X_test)

accuracy = accuracy_score(y_test,pred)

print("\nAccuracy:",accuracy)

print("\nClassification Report:\n")

print(classification_report(y_test,pred))

# ============================================================
# SAVE MODEL
# ============================================================

pickle.dump(clf,open("cyberbullying_model.pkl","wb"))
pickle.dump(tokenizer,open("distilbert_tokenizer.pkl","wb"))

print("Model saved")

# ============================================================
# LIME EXPLAINER
# ============================================================

explainer = LimeTextExplainer(class_names=["safe","cyberbullying"])

# ============================================================
# PREDICT PROBA FUNCTION
# ============================================================

def predict_proba(texts):

    cleaned = [clean_text(t) for t in texts]

    embeddings = get_embeddings(cleaned)

    return clf.predict_proba(embeddings)

# ============================================================
# ANALYZE MESSAGE
# ============================================================

def analyze_message(message):

    print("\n-------------------------")

    print("Message:",message)

    cleaned = clean_text(message)

    emb = get_embeddings([cleaned])

    prob = clf.predict_proba(emb)[0][1]

    print("\nCyberbullying Probability:",round(prob*100,2),"%")

    threshold = 0.80

    if prob > threshold:

        print("Cyberbullying detected")

    else:

        print("Message appears safe")

    print("\nImportant Words:")

    explanation = explainer.explain_instance(
        message,
        predict_proba,
        num_features=6,
        num_samples=800
    )

    for word,weight in explanation.as_list():

        print(word,"->",round(weight,3))

# ============================================================
# USER INPUT
# ============================================================

print("\nCyberbullying Detection System Ready")

while True:

    text = input("\nEnter message (type quit): ")

    if text.lower()=="quit":
        break

    analyze_message(text)