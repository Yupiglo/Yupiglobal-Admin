import React from "react";

interface CardProps {
  title: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ title, children, onClick }) => {
  return (
    <div className="w-full h-max-content bg-white rounded-xl">
      <button className="bg-green-600 p-3 rounded-t-xl flex justify-between text-white" onClick={onClick}>
        <div className="font-semibold">{title}</div>
      </button>
      <div>{children}</div>
    </div>
  );
};

export default Card;
