# backend/src/ml/risk.py
from typing import Tuple, List

# Keywords that indicate high immediate risk (lowercase)
HIGH_KEYWORDS: List[str] = [
    "suicide", "kill myself", "end my life", "i want to die", "i'll kill myself",
    "i cant go on", "hurt myself", "want to die", "end it all", "kill me"
]

MEDIUM_KEYWORDS: List[str] = [
    "worthless", "hopeless", "no future", "give up", "cant cope", "can't cope",
    "depressed", "depression", "panic attack", "anxious", "anxiety"
]

def detect_risk(text: str, compound_score: float, mood_value: int = None) -> Tuple[str, str]:
    """
    Return (risk_level, explanation)
    risk_level in {"HIGH","MEDIUM","LOW"}
    Explanation is a short string describing why it was classified.
    Heuristic:
      - HIGH if any HIGH_KEYWORDS present OR compound_score <= -0.6
      - MEDIUM if any MEDIUM_KEYWORDS present OR compound_score <= -0.3 OR mood_value <= 3
      - LOW otherwise
    """
    if text:
        lower = text.lower()
        for kw in HIGH_KEYWORDS:
            if kw in lower:
                return "HIGH", f"keyword match: '{kw}'"
        for kw in MEDIUM_KEYWORDS:
            if kw in lower:
                return "MEDIUM", f"keyword match: '{kw}'"

    if compound_score is not None:
        if compound_score <= -0.6:
            return "HIGH", f"compound {compound_score}"
        if compound_score <= -0.3:
            return "MEDIUM", f"compound {compound_score}"

    if mood_value is not None:
        try:
            if int(mood_value) <= 3:
                return "MEDIUM", f"mood_value {mood_value}"
        except Exception:
            pass

    return "LOW", f"compound {compound_score}"
