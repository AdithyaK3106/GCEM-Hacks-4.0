import json
import os
from typing import Dict, Any

demo_counters = {}

def get_deterministic_intelligence(session_id: str) -> Dict[str, Any]:
    count = demo_counters.get(session_id, 0)
    demo_counters[session_id] = count + 1
    
    if count == 0:
        # MASTERED Case
        return {
            "is_correct": True,
            "correct_index": 2,
            "learner_state": {
                "state_label": "MASTERED",
                "state_color": "green",
                "message": "You're a concept pro!",
                "action_label": "Next Topic"
            },
            "explanation": {
                "text": "Correct! The thylakoid membrane is indeed where the light-dependent reactions occur because it contains the chlorophyll.",
                "misconception_warning": None
            },
            "recommendation": {
                "next_step": "ADVANCE",
                "label": "Start Advanced Level",
                "type": "challenge"
            }
        }
    else:
        # MISCONCEPTION Case
        return {
            "is_correct": False,
            "correct_index": 1,
            "learner_state": {
                "state_label": "MISCONCEPTION",
                "state_color": "red",
                "message": "Wait! Let's clear something up.",
                "action_label": "Review Gas Exchange"
            },
            "explanation": {
                "text": "You selected Carbon Dioxide as the output, but it's actually the input.",
                "misconception_warning": "High Confidence Error: You might be confusing photosynthesis with respiration."
            },
            "recommendation": {
                "next_step": "RETEACH",
                "label": "Watch Gas Cycle Animation",
                "type": "reteach"
            }
        }

def load_demo_asset(asset_name: str) -> Any:
    path = f"demo_assets/{asset_name}.json"
    if os.path.exists(path):
        with open(path, "r") as f:
            return json.load(f)
    return None
