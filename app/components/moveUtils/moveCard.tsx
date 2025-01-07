import { Move } from "@jackstenglein/chess";
import React from "react";

type MoveCardProps = {
  move: Move;
  onClick: (move: Move) => void;
};

const MoveCard: React.FC<MoveCardProps> = ({ move, onClick }) => {
  return (
    <div
      onClick={() => {
        onClick(move);
      }}
      key={move.san}
      className="text-center"
      style={{ marginBottom: "5px" }}
    >
      <strong>{move.san}</strong>
    </div>
  );
};
export default MoveCard;
