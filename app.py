from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
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

@app.post("/check")
def check(data: QuestionRequest):
    if len(data.posts) == 0:
        return {
            "new_question": clean_text(data.question),
            "posts_received": 0,
            "matches": [],
            "total_matches": 0,
            "can_post": True,
            "decision_reason": "لم يتم إرسال بوستات قديمة للمقارنة."
        }

    new_text = clean_text(data.question)
    old_texts = [clean_text(p.question) for p in data.posts]

    new_emb = model.encode([new_text])
    old_emb = model.encode(old_texts)

    scores = cosine_similarity(new_emb, old_emb)[0]

    matches = []
    for i, score in enumerate(scores):
        score = round(float(score), 3)
        if score >= 0.60:
            matches.append({
                "id": data.posts[i].id,
                "question": data.posts[i].question,
                "answer": data.posts[i].answer,
                "score": score
            })

    matches.sort(key=lambda x: x["score"], reverse=True)

    best_match = matches[0] if matches else None
    can_post = False if best_match and best_match["score"] >= 0.90 else True

    return {
        "new_question": new_text,
        "posts_received": len(data.posts),
        "best_match": best_match,
        "suggested_answer": best_match["answer"] if best_match else None,
        "matches": matches,
        "total_matches": len(matches),
        "can_post": can_post,
        "decision_reason": "السؤال مكرر جدًا، لا حاجة لنشره." if not can_post else "يمكن نشر السؤال."
    }
