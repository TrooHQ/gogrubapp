import React from "react";
import { Link } from "react-router-dom";

interface ButtonProps {
  text: string;
  link?: string;
}

const Button: React.FC<ButtonProps> = ({ text, link }) => {
  return (
    <div>
      {link ? (
        <Link to={link}>
          <button className="bg-purple500 w-full text-center text-white py-3 rounded">
            {text}
          </button>
        </Link>
      ) : (
        <button className="bg-purple500 w-full text-center text-white py-3 rounded">
          {text}
        </button>
      )}
    </div>
  );
};

export default Button;
