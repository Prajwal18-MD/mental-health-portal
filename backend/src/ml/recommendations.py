# backend/src/ml/recommendations.py
from typing import List, Dict

RECOMMENDATIONS = [
    {"id": "breathing", "title": "5-min Breathing Exercise", "desc": "Try a 5-minute box breathing exercise: inhale 4s, hold 4s, exhale 4s, hold 4s."},
    {"id": "grounding", "title": "Grounding Technique", "desc": "Name 5 things you can see, 4 things you can touch, 3 you can hear, 2 you can smell, 1 you can taste."},
    {"id": "sleep_tips", "title": "Sleep Tips", "desc": "Create a bedtime routine: reduce screens 30 min before bed, try a warm shower, and avoid caffeine after 3pm."},
    {"id": "cbt_task", "title": "Small CBT Task", "desc": "Write one small achievable task for tomorrow and break it into three steps."},
    {"id": "reach_out", "title": "Reach Out", "desc": "Consider contacting a friend or family member and telling them how you feel, or book a session with a therapist."}
]

def generate_recommendations(latest_mood: Dict) -> List[Dict]:
    """
    latest_mood expected keys:
      - latest_mood_value (int or None)
      - latest_risk ("HIGH"/"MEDIUM"/"LOW" or None)
      - avg_7_days (float or None)
      - avg_30_days (float or None)
    """
    recs = []

    # HIGH risk -> prioritize reach out and calming exercises
    if latest_mood.get("latest_risk") == "HIGH":
        recs.append(next(r for r in RECOMMENDATIONS if r["id"]=="reach_out"))
        recs.append(next(r for r in RECOMMENDATIONS if r["id"]=="breathing"))
        recs.append(next(r for r in RECOMMENDATIONS if r["id"]=="grounding"))
        return recs

    # Low average mood -> CBT + breathing
    avg7 = latest_mood.get("avg_7_days")
    try:
        avg7_val = float(avg7) if avg7 is not None else None
    except Exception:
        avg7_val = None

    if avg7_val is not None and avg7_val <= 4:
        recs.append(next(r for r in RECOMMENDATIONS if r["id"]=="cbt_task"))
        recs.append(next(r for r in RECOMMENDATIONS if r["id"]=="breathing"))
        recs.append(next(r for r in RECOMMENDATIONS if r["id"]=="grounding"))
        return recs

    # Latest mood low
    latest_val = latest_mood.get("latest_mood_value")
    if latest_val is not None and latest_val <= 4:
        recs.append(next(r for r in RECOMMENDATIONS if r["id"]=="breathing"))
        recs.append(next(r for r in RECOMMENDATIONS if r["id"]=="grounding"))
        recs.append(next(r for r in RECOMMENDATIONS if r["id"]=="sleep_tips"))
        return recs

    # Default suggestions
    recs.append(next(r for r in RECOMMENDATIONS if r["id"]=="breathing"))
    recs.append(next(r for r in RECOMMENDATIONS if r["id"]=="sleep_tips"))
    recs.append(next(r for r in RECOMMENDATIONS if r["id"]=="grounding"))
    return recs
