# backend/src/ml/sentiment.py
"""
Sentiment analysis module - uses BERT-based model for advanced analysis.
"""
from .sentiment_bert import analyze_text

__all__ = ["analyze_text"]
