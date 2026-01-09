# backend/src/ml/sentiment_bert.py
"""
BERT-based sentiment analysis using transformers library.
Replaces NLTK VADER with a more advanced pre-trained model.
"""
from transformers import pipeline
import torch

# Use GPU if available, otherwise CPU
device = 0 if torch.cuda.is_available() else -1

# Initialize the sentiment analysis pipeline with a pre-trained model
# Using distilbert-base-uncased-finetuned-sst-2-english for efficiency
try:
    _sentiment_pipeline = pipeline(
        "sentiment-analysis",
        model="distilbert-base-uncased-finetuned-sst-2-english",
        device=device
    )
except Exception as e:
    print(f"Warning: Could not load sentiment model: {e}")
    _sentiment_pipeline = None

def analyze_text(text: str) -> dict:
    """
    Analyze sentiment of text using BERT model.
    Returns dict with keys: label (POSITIVE/NEGATIVE), score (0-1)
    Converts to compound score format for compatibility: [-1, 1]
    """
    if not text or not text.strip():
        return {"label": "NEUTRAL", "score": 0.5, "compound": 0.0}
    
    try:
        if _sentiment_pipeline is None:
            return {"label": "NEUTRAL", "score": 0.5, "compound": 0.0}
        
        # Truncate text to 512 tokens (BERT limit)
        text = text[:512]
        
        result = _sentiment_pipeline(text)[0]
        label = result["label"]  # "POSITIVE" or "NEGATIVE"
        score = result["score"]  # confidence 0-1
        
        # Convert to compound score [-1, 1]
        if label == "POSITIVE":
            compound = score
        else:  # NEGATIVE
            compound = -score
        
        return {
            "label": label,
            "score": score,
            "compound": compound
        }
    except Exception as e:
        print(f"Error in sentiment analysis: {e}")
        return {"label": "NEUTRAL", "score": 0.5, "compound": 0.0}
