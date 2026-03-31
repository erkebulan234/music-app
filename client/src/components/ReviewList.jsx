function Stars({ value = 0 }) {
  return (
    <span className="review-stars">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={`review-star${i <= value ? "" : " empty"}`}>★</span>
      ))}
    </span>
  );
}

export default function ReviewList({ reviews }) {
  if (!reviews.length) return (
    <div className="reviews-card">
      <div className="reviews-head">
        <span className="reviews-label">Отзывы</span>
      </div>
      <div className="reviews-empty">Отзывов пока нет. Будьте первым!</div>
    </div>
  );

  return (
    <div className="reviews-card">
      <div className="reviews-head">
        <span className="reviews-label">Отзывы</span>
        <span className="tag">{reviews.length}</span>
      </div>

      {reviews.map((r, i) => (
        <div className="review-item" key={r.id} style={{ animationDelay: `${i * 0.05}s` }}>
          <div className="review-header">
            <div className="review-avatar">
              {(r.user || "U")[0].toUpperCase()}
            </div>
            <div className="review-meta">
              <div className="review-user">{r.user || "Аноним"}</div>
              <Stars value={r.rating} />
            </div>
          </div>
          {r.comment && (
            <p className="review-text">{r.comment}</p>
          )}
        </div>
      ))}
    </div>
  );
}
