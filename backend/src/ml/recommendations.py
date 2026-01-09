# backend/src/ml/recommendations.py
# generate_recommendations(context) -> list of dicts: {"title":..., "text":...}
from typing import List, Dict

# A library of 15 recommendation templates
RECOMMENDATION_POOL = [
    {"id":"breathing","title":"4-4-6 Breathing","text":"Try breathing in for 4 seconds, hold for 4, exhale for 6. Do 5 cycles and notice how your body responds."},
    {"id":"grounding","title":"Grounding Exercise","text":"Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. This helps anchor you in the present."},
    {"id":"short_walk","title":"Take a Short Walk","text":"A 10–15 minute walk, preferably outside, often helps clear the mind and reduce stress. Try it with mindful focus."},
    {"id":"tiny_task","title":"Break tasks into tiny steps","text":"If tasks feel overwhelming, pick one tiny next step and do only that for 10 minutes. Small wins add up."},
    {"id":"connect","title":"Reach Out to Someone","text":"Send a short message to someone you trust or schedule a 10-minute call — social contact can help lighten heavy feelings."},
    {"id":"sleep_hygiene","title":"Improve Sleep Routine","text":"Wind-down 30 minutes before bed: no screens, dim lights, calming music or reading, and a consistent bedtime."},
    {"id":"gratitude","title":"Gratitude Listing","text":"Write down three specific things you are grateful for today. Even small items can shift focus over time."},
    {"id":"progressive","title":"Progressive Muscle Relaxation","text":"Tense and release major muscle groups from toes to head, holding tension for 5 seconds, then releasing."},
    {"id":"grounding_breath","title":"Box Breathing","text":"Try box breathing: inhale 4s, hold 4s, exhale 4s, hold 4s. Repeat for 3–5 minutes."},
    {"id":"mindful","title":"Short Mindfulness","text":"Sit quietly for 3–5 minutes and focus on the breath or sensations. Notice thoughts without judging them."},
    {"id":"healthy_snack","title":"Eat a Balanced Snack","text":"Have a small snack with protein (eggs, nuts) and carbs (fruit, toast) to stabilize energy and mood."},
    {"id":"limit_caffeine","title":"Limit Caffeine/Alcohol","text":"Reducing caffeine or alcohol—especially around sleep—can help mood and anxiety levels."},
    {"id":"seek_professional","title":"Consider Professional Support","text":"If feelings persist or interfere with daily life, consider booking a therapist. We can help you find options."},
    {"id":"journaling","title":"Try Structured Journaling","text":"Write: 1) What happened, 2) What you felt, 3) One small next step. Aim for three sentences for each to keep it manageable."},
    {"id":"daily_routine","title":"Create a Small Daily Routine","text":"Aim for consistency: a short morning routine (stretch, water, planning) and an evening wind-down to stabilize mood."}
]

def generate_recommendations(context: Dict) -> List[Dict]:
    """
    context: {
      latest_mood_sentiment: float or None (BERT sentiment score -1 to 1),
      latest_risk: "LOW"/"MEDIUM"/"HIGH"/None,
      avg_7_days: float or None,
      avg_30_days: float or None
    }

    Return a list of recommendation dicts prioritized for the user.
    """
    latest_sentiment = context.get("latest_mood_sentiment")
    latest_risk = (context.get("latest_risk") or "").upper() if context.get("latest_risk") else None
    avg7 = context.get("avg_7_days")
    avg30 = context.get("avg_30_days")

    recs = []

    # If recent HIGH risk -> immediate safety + booking items first
    if latest_risk == "HIGH" or (isinstance(latest_sentiment, (int,float)) and latest_sentiment <= -0.6):
        # immediate coping + professional help
        recs.extend([r for r in RECOMMENDATION_POOL if r["id"] in ("breathing","seek_professional","grounding","short_walk")])
    else:
        # if average last 7 days very negative -> recommend routine, sleep, grounding
        if avg7 is not None and avg7 <= -0.5:
            recs.extend([r for r in RECOMMENDATION_POOL if r["id"] in ("daily_routine","sleep_hygiene","tiny_task","connect")])
        # if moderate negative sentiment -> coping skills + short activities
        if avg7 is not None and -0.5 < avg7 <= 0:
            recs.extend([r for r in RECOMMENDATION_POOL if r["id"] in ("grounding","breathing","short_walk","journaling")])

    # If not already included, add some general helpful items
    for r in RECOMMENDATION_POOL:
        if r not in recs:
            recs.append(r)

    # Return up to 12 recommendations
    return recs[:12]
