import { Move } from "@jackstenglein/chess";
import React from "react";

type MoveCardProps = {
  isMainLine: boolean;
  move: Move;
  onClick: (move: Move) => void;
};

const MoveCard: React.FC<MoveCardProps> = ({ isMainLine, move, onClick }) => {
  const isToMoveR =
    move.ply % 2 == 0 && move.variations.length > 0 && isMainLine;
  return (
    <div
      key={move.san}
      className={`text-center align-middle h-full mb-5 ${
        isMainLine ? "w-1/2" : ""
      } ${isToMoveR ? "w-full flex" : ""}`}
    >
      <div className={`${isToMoveR ? "flex-1" : "disabled"}`}></div>
      <strong
        onClick={() => {
          onClick(move);
        }}
        className={`cursor-pointer flex-1`}
      >
        {move.san}
      </strong>
    </div>
  );
};
export default MoveCard;
