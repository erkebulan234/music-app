import { useState } from "react";
import { addReview } from "../services/api";

export default function ReviewForm({ albumId }) {
  const [text, setText] = useState("");

  const handleSubmit = async () => {
    await addReview({
      albumId,
         rating: 5, // Здесь можно добавить возможность выбора рейтинга
      comment: text
    });

    alert("Добавлено");
  };

  return (
    <div>
      <textarea onChange={e => setText(e.target.value)} />
      <button onClick={handleSubmit}>Отправить</button>
    </div>
  );
}