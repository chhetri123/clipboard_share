const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
