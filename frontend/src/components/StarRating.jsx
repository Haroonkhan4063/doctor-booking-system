const StarRating = ({ value }) => {
  const rounded = Math.round(value);
  return (
    <span className="star-rating" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= rounded ? 'star filled' : 'star'}>★</span>
      ))}
    </span>
  );
};

export default StarRating;
