import { Chess, Move } from "@jackstenglein/chess";
import { Dispatch, JSX, SetStateAction } from "react";
import MoveCard from "./moveUtils/moveCard";

const FenEditor = ({
  pgn,
  selectedMove,
  setSelectedMove,
}: {
  pgn: string;
  selectedMove: Move | null;
  setSelectedMove: Dispatch<SetStateAction<Move | null>>;
}) => {
  const game = new Chess();
  game.loadPgn(pgn);
  const Moves = game.pgn.history.moves;

  function onCardClick(move: Move) {
    setSelectedMove(move);
    game.loadPgn(game.renderLine(move));
  }

  const renderMoves = (move: Move[]): JSX.Element[] => {
    if (!move) return [];
    let i = 0;
    const moves: JSX.Element[] = [];

    while (move[i]) {
      moves.push(<MoveCard onClick={onCardClick} move={move[i]} />);
      move[i].variations.forEach((element) => {
        moves.push(...renderMoves(element));
      });

      i++;
    }
    return moves;
  };

  return (
    <div className="gap-12 grid grid-cols-2">
      {game.firstMove() ? renderMoves(Moves) : <p>Aucun coup à afficher</p>}
    </div>
  );
};

export default FenEditor;
