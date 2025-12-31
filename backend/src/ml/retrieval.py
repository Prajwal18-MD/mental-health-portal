# backend/src/ml/retrieval.py
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import threading

# Simple canned response bank (local). Add/extend as you like.
# Each item has a list of patterns a user might say and the canned response.
RESPONSE_BANK = [
    {
        "id": "greeting_1",
        "patterns": ["hello", "hi", "hey", "good morning", "good evening"],
        "response": "Hi — I'm here to listen. What's on your mind today?"
    },
    {
        "id": "stress_1",
        "patterns": ["i am stressed", "i'm stressed", "feeling stressed", "stress at work"],
        "response": "I'm sorry you're feeling stressed. Can you tell me one thing that felt hardest today?"
    },
    {
        "id": "sleep_1",
        "patterns": ["i can't sleep", "insomnia", "sleepless", "can't sleep at night"],
        "response": "Trouble sleeping is tough. Have you tried a short breathing exercise before bed? I can guide you."
    },
    {
        "id": "worthless_1",
        "patterns": ["i feel worthless", "i am worthless", "no one cares"],
        "response": "I'm really sorry you're feeling that way. You're not alone. Can you tell me what happened that made you feel like this?"
    },
    {
        "id": "coping_1",
        "patterns": ["how to cope", "coping strategies", "what can I do", "help me cope"],
        "response": "Small steps can help. Try a 5-minute breathing exercise, write one thing you accomplished today, or contact a friend. Would you like a guided breathing exercise now?"
    },
    {
        "id": "fallback_1",
        "patterns": ["*"],
        "response": "I hear you. Tell me more, or type 'help' if you'd like suggestions for coping strategies."
    }
]

# Build corpus (all patterns) and vectorizer on startup.
_lock = threading.Lock()
_vectorizer = None
_corpus = []
_responses = []

def _build():
    global _vectorizer, _corpus, _responses
    with _lock:
        if _vectorizer is not None:
            return
        _corpus = []
        _responses = []
        for item in RESPONSE_BANK:
            # join patterns into one string for that response
            patterns_joined = " . ".join(item.get("patterns", []))
            _corpus.append(patterns_joined)
            _responses.append(item)
        _vectorizer = TfidfVectorizer(ngram_range=(1,2)).fit(_corpus)

def get_best_response(user_text: str):
    """
    Returns (response_text, response_id, score) where score is cosine similarity.
    """
    if not user_text:
        return RESPONSE_BANK[0]["response"], RESPONSE_BANK[0]["id"], 1.0
    _build()
    query_vec = _vectorizer.transform([user_text])
    corpus_vecs = _vectorizer.transform(_corpus)
    # efficient cosine using linear_kernel
    cosines = linear_kernel(query_vec, corpus_vecs).flatten()
    best_idx = cosines.argmax()
    best_score = float(cosines[best_idx])
    best = _responses[best_idx]
    return best["response"], best["id"], best_score
