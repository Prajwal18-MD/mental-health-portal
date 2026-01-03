# backend/src/ml/retrieval.py
# Simple retrieval of canned responses using keyword matching.
# get_best_response(message) -> (reply_text, response_id, score)

from typing import Tuple, List
import re

# A list of candidate responses. Each entry contains:
# - id: unique id
# - patterns: list of keywords/phrases to match
# - text: canned reply
RESPONSES = [
    {"id":"greet_1","patterns":["hello","hi","hey","hi there","good morning","good afternoon"], "text":"Hi — I’m here with you. Would you like to tell me what’s on your mind right now?"},
    {"id":"greet_2","patterns":["how are you","how r u","how are u"], "text":"I’m a helper bot — I don’t get tired. I’m here to listen. What are you feeling right now?"},
    {"id":"sad_1","patterns":["sad","unhappy","down","blue"], "text":"I’m sorry you’re feeling sad. If you’d like, describe one thing that happened today that might have triggered this."},
    {"id":"depress_1","patterns":["depress","depressed","hopeless"], "text":"That sounds really heavy. Try to breathe with me: inhale for 4, hold 4, exhale 6. Do you feel a little calmer?"},
    {"id":"anxiety_1","patterns":["anxious","anxiety","panic","panic attack","nervous"], "text":"When anxiety spikes, grounding helps: name 5 things you see, 4 you can touch, 3 you can hear. Want to try it now?"},
    {"id":"stress_1","patterns":["stress","stressed","overwhelmed"], "text":"When everything feels too much, breaking tasks into tiny steps helps. What's one small step you could take right now?"},
    {"id":"sleep_1","patterns":["sleep","insomnia","can't sleep","cant sleep","awake at night"], "text":"Sleep problems are tough. Try a wind-down: no screens 30 minutes before bed, dim lights, and a short breathing practice."},
    {"id":"angry_1","patterns":["angry","mad","furious"], "text":"Anger is valid. A quick technique: press your feet to the floor and take slow breaths for one minute. Would that help right now?"},
    {"id":"suicide_check","patterns":["suicide","kill myself","end my life","want to die"], "text":"I’m really sorry you’re feeling this way. I’m not able to help with emergencies. If you’re in immediate danger, please call local emergency services or a suicide hotline. Would you like me to show nearby professional help now?"},
    {"id":"relationship_1","patterns":["breakup","relationship","partner","boyfriend","girlfriend","wife","husband"], "text":"Relationship issues can be painful. Would you like some ideas for coping or for communicating with the other person?"},
    {"id":"work_1","patterns":["work","job","boss","office","work stress"], "text":"Work stress can pile up. Can you identify one small boundary or task you could change to make today easier?"},
    {"id":"school_1","patterns":["exam","study","school","college","university"], "text":"School pressure is real. Try scheduling short focused study sessions and brief breaks (e.g., 25 min focus, 5 min break). Would you like a quick study plan?"},
    {"id":"panic_help","patterns":["panic attack","panic"], "text":"If you are having a panic attack, find a safe place to sit, focus on slowing breaths, and try 4-4-4 breathing. If it persists, call emergency services."},
    {"id":"coping_tips","patterns":["tips","coping","help me cope","coping strategies"], "text":"Here are quick coping strategies: 1) breathing, 2) grounding, 3) short walk, 4) call a friend. Which of these would you like to try?"},
    {"id":"gratitude","patterns":["grateful","gratitude","thankful"], "text":"Noticing small positives can help. Try naming three small things you’re grateful for today."},
    {"id":"journaling","patterns":["journal","journalling","write"], "text":"Writing can help process feelings. Try describing the event, how it made you feel, and one small next step."},
    {"id":"social_1","patterns":["lonely","alone"], "text":"Feeling lonely is hard. Would you like some ways to reach out that feel manageable — like a short message or joining a group activity?" },
    {"id":"exercise_1","patterns":["exercise","workout","gym","run"], "text":"Physical activity is a great mood booster. Even a 10-minute walk can help reset your mind."},
    {"id":"food_1","patterns":["eat","food","hungry","appetite"], "text":"Nutrition affects mood. Try to eat a small balanced snack — something with protein and carbs — and see if it helps."},
    {"id":"panic_prevention","patterns":["help me calm","calm down","calm"], "text":"For immediate calm: 6 slow breaths, 5 seconds hold, then exhale for 7 — repeat 4 times. Tell me how you feel after trying."},
    {"id":"ask_more","patterns":["what should i do","advice","what do i do","help"], "text":"I can offer ideas, small steps, or help you find a therapist. What would you prefer: coping steps, a breathing exercise, or help with booking a professional?" },
    {"id":"validation","patterns":["feels unfair","not fair","hurt","pain"], "text":"It makes sense that you'd feel hurt. Your reaction is valid — do you want to explore how to respond or how to take care of yourself right now?"},
    {"id":"mindfulness","patterns":["meditate","mindfulness","mindful"], "text":"A short mindfulness exercise: focus on your breath for one minute. If thoughts come, gently return attention to the breath."},
    {"id":"mental_health_help","patterns":["therapist","counselor","talk to a professional","need help"], "text":"If you want professional help, I can show therapists and let you book. Do you want to see options now?"},
    {"id":"fallback_positive","patterns":[],"text":"I hear you. Can you say a bit more about how that made you feel? I’m here to listen."}
]

# Simple normalization helper
def _norm(text: str) -> str:
    return (text or "").lower()

def _score_for_match(message: str, patterns: List[str]) -> float:
    msg = _norm(message)
    if not patterns:
        return 0.0
    # Count how many distinct keywords/phrases appear
    found = 0
    for p in patterns:
        if p in msg:
            found += 1
    if found == 0:
        return 0.0
    # score is fraction of matched patterns (capped)
    return min(1.0, found / len(patterns))

def get_best_response(message: str) -> Tuple[str, str, float]:
    """
    Return (reply_text, response_id, score).
    Score is 0.0-1.0; higher is better.
    """
    msg = message or ""
    msg_lower = _norm(msg)
    best = None
    best_score = 0.0

    # direct substring match for patterns
    for r in RESPONSES:
        score = _score_for_match(msg_lower, r.get("patterns", []))
        if score > best_score:
            best_score = score
            best = r

    if best and best_score > 0.0:
        return best["text"], best["id"], best_score

    # fallback response (empathetic)
    fallback = next((r for r in RESPONSES if r["id"] == "fallback_positive"), None)
    if fallback:
        return fallback["text"], fallback["id"], 0.05

    # hard fallback
    return "I hear you. Can you tell me a little more?", "hard_fallback", 0.01
