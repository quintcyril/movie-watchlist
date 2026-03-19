import { useState } from "react";

export default function ReviewScreen() {
  const [reviews, setReviews] = useState([]);
  const [text, setText] = useState("");

  const addReview = () => {
    if (text.trim()) {
      setReviews([...reviews, text]);
      setText("");
    }
  };
  const removeReview = (index) => {
    const updated = reviews.filter((_, i) => i !== index);
    setReviews(updated);
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <h2>Reviews</h2>

      <input
        type="text"
        placeholder="Write a review"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={addReview}>Add Review</button>

      <ul>
        {reviews.map((review, index) => (
          <li key={index}>
            {review}
            
            <button 
              onClick={() => removeReview(index)} 
              style={{ marginLeft: "10px" }}
            >
              delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}