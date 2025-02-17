import React from "react";
import { Link } from "react-router-dom";

interface ButtonProps {
  text: string;
  link?: string;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ text, link, loading }) => {
  return (
    <div>
      {link ? (
        <Link to={link}>
          <button
            className="bg-purple500 w-full text-center text-white py-3 rounded"
            disabled={loading}
          >
            {text}
          </button>
        </Link>
      ) : (
        <button
          className="bg-purple500 w-full text-center text-white py-3 rounded"
          disabled={loading}
        >
          {loading ? `${text}...` : text}
        </button>
      )}
    </div>
  );
};
export default Button;
