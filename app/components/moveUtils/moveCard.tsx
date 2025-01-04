import React from "react";
import { Move } from "./moveType";

type MoveCardProps = {
  move: Move;
  onClick: (fen: string) => void; // Fonction pour mettre à jour l'échiquier
};

const MoveCard: React.FC<MoveCardProps> = ({ move, onClick }) => {
  return (
    <div onClick={() => onClick(move.fen)} className="move-card">
      {move.san}
    </div>
  );
};
export default MoveCard;
