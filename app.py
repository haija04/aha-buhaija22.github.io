from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import json
import re

app = FastAPI()
model = SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")

class PostItem(BaseModel):
    id: int
    question: str
    answer: str | None = None

class QuestionRequest(BaseModel):
    question: str
    posts: list[PostItem] = []

def clean_text(text):
    text = text.lower()
    text = re.sub(r"[^\w\s]", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

def get_similarity_label(score):
    if score >= 0.85:
        return "high"
    elif score >= 0.70:
        return "medium"
    return "low"

def build_status(matches):
    if len(matches) == 0:
        return "no_match"
    if matches[0]["similarity_level"] == "high":
        return "strong_match"
    return "possible_match"

def build_message(matches):
    if len(matches) == 0:
        return "لم نجد أسئلة مشابهة."
    if matches[0]["similarity_level"] == "high":
        return "وجدنا أسئلة مشابهة جدًا."
    return "وجدنا بعض الأسئلة المشابهة."

def get_post_decision(matches):
    if len(matches) == 0:
        return {
            "can_post": True,
            "decision_reason": "لا يوجد سؤال مشابه، يمكن نشر السؤال."
        }

    best = matches[0]

    if best["score"] >= 0.90:
        return {
            "can_post": False,
            "decision_reason": "السؤال مكرر جدًا، لا حاجة لنشره."
        }

    return {
        "can_post": True,
        "decision_reason": "يوجد سؤال مشابه، لكن يمكن للمستخدم النشر إذا أراد."
    }

def find_similar(new_question, posts, threshold=0.60, top_k=5):
    if len(posts) == 0:
        return []

    old_texts = [clean_text(post.question) for post in posts]

    new_emb = model.encode([clean_text(new_question)])
    old_emb = model.encode(old_texts)

    scores = cosine_similarity(new_emb, old_emb)[0]

    matches = []
    for i, score in enumerate(scores):
        if score >= threshold:
            rounded_score = round(float(score), 3)
            matches.append({
                "id": posts[i].id,
                "question": posts[i].question,
                "answer": posts[i].answer,
                "score": rounded_score,
                "similarity_level": get_similarity_label(rounded_score)
            })

    matches.sort(key=lambda x: x["score"], reverse=True)
    return matches[:top_k]

@app.get("/")
def home():
    return {"message": "AI is working"}

@app.post("/check")
def check(data: QuestionRequest):
    matches = find_similar(data.question, data.posts)
    best_match = matches[0] if len(matches) > 0 else None
    suggested_answer = best_match["answer"] if best_match else None
    decision = get_post_decision(matches)

    return {
        "new_question": clean_text(data.question),
        "status": build_status(matches),
        "message": build_message(matches),
        "best_match": best_match,
        "suggested_answer": suggested_answer,
        "matches": matches,
        "total_matches": len(matches),
        "can_post": decision["can_post"],
        "decision_reason": decision["decision_reason"]
    }
