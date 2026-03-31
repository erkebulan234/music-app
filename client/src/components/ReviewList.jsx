export default function ReviewList({ reviews }) {
  return (
    <div>
      {reviews.map(r => (
        <div key={r.id}>
          ⭐ {r.rating}
          <p>{r.comment}</p>
        </div>
      ))}
    </div>
  );
}