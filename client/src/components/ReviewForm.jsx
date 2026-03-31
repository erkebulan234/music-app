import { useState } from "react";
import { addReview } from "../services/api";

export default function ReviewForm({ albumId, onReviewAdded }) {
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!text.trim() || rating === 0) return;
    setLoading(true);
    setError("");
    try {
      await addReview({ albumId, rating, comment: text });
      setText("");
      setRating(0);
      // После успешной отправки — перезагружаем список отзывов
      if (onReviewAdded) onReviewAdded();
    } catch (e) {
      setError(
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        "Ошибка при отправке. Попробуйте ещё раз."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-form-card">
      <div className="review-form-title">Оставить отзыв</div>

      <div className="rating-select">
        <span className="rating-select-label">Оценка:</span>
        {[1, 2, 3, 4, 5].map(i => (
          <button
            key={i}
            className="rating-star-btn"
            onClick={() => setRating(i)}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
            style={{ color: i <= (hover || rating) ? "var(--gold)" : "var(--border)" }}
          >
            ★
          </button>
        ))}
        {rating > 0 && (
          <span className="tag gold" style={{ marginLeft: 4 }}>{rating}/5</span>
        )}
      </div>

      <textarea
        className="review-textarea"
        placeholder="Напишите, что вы думаете об этом альбоме..."
        value={text}
        onChange={e => setText(e.target.value)}
      />

      {error && (
        <div className="review-error">{error}</div>
      )}

      <div className="review-form-footer">
        <button
          className="btn-submit"
          onClick={handleSubmit}
          disabled={!text.trim() || rating === 0 || loading}
        >
          {loading ? "Отправляем..." : "Опубликовать"}
        </button>
      </div>
    </div>
  );
}
