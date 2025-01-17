import { Chess, Move } from "@jackstenglein/chess";
import { Dispatch, JSX, SetStateAction } from "react";
import MoveCard from "./moveUtils/moveCard";

const FenEditor = ({
  chessGameState,
  selectedMove,
  setSelectedMove,
  setChessGameState,
}: {
  chessGameState: Chess;
  setChessGameState: Dispatch<SetStateAction<Chess>>;
  selectedMove: Move | null;
  setSelectedMove: Dispatch<SetStateAction<Move | null>>;
}) => {
  const Moves = chessGameState.pgn.history.moves;

  function onCardClick(move: Move) {
    setSelectedMove(move);
    chessGameState.seek(move);
    setChessGameState(chessGameState);
  }

  const renderMoves = (
    move: Move[],
    isMainLine: boolean = true
  ): JSX.Element[] => {
    if (!move) return [];
    let i = 0;
    const moves: JSX.Element[] = [];

    while (move[i]) {
      moves.push(
        <MoveCard
          key={move[i].san}
          isMainLine={isMainLine}
          onClick={onCardClick}
          move={move[i]}
        />
      );
      if (move[i + 1]) {
        move[i + 1].variations.forEach((element) => {
          moves.push(
            <div className="block w-full">
              <div className="w-full bg-gray-400 flex flex-wrap gap-3 pl-4 align-middle">
                {...renderMoves(element, false)}
              </div>
            </div>
          );
        });
      }

      i++;
    }
    return moves;
  };

  return (
    <div className="flex flex-wrap">
      {chessGameState.firstMove() ? (
        renderMoves(Moves)
      ) : (
        <p>Aucun coup à afficher</p>
      )}
    </div>
  );
};

export default FenEditor;
