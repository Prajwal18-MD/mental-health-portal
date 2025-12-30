# backend/src/ml/sentiment.py
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import nltk

# Ensure resource is available; try to download if missing.
try:
    _ = SentimentIntensityAnalyzer()
except Exception:
    nltk.download("vader_lexicon")
    _ = SentimentIntensityAnalyzer()

_analyzer = _

def analyze_text(text: str) -> dict:
    """
    Returns sentiment dict with keys: neg, neu, pos, compound
    compound is in [-1,1] (more negative -> -1, more positive -> +1)
    """
    if not text:
        return {"neg": 0.0, "neu": 1.0, "pos": 0.0, "compound": 0.0}
    scores = _analyzer.polarity_scores(text)
    return scores
