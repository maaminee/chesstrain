import { Chess, Move } from "@jackstenglein/chess";
import { parse } from "@mliebelt/pgn-parser";
import { stringify } from "querystring";
import { Dispatch, JSX, SetStateAction } from "react";

const FenEditor = ({ pgn }: { pgn: string }) => {
  const game = new Chess();
  game.loadPgn(pgn);
  const Moves = game.pgn.history.moves;

  const renderMoves = (move: Move[]): JSX.Element[] => {
    if (!move) return [];
    let i = 0;
    const moves: JSX.Element[] = [];

    while (move[i]) {
      moves.push(
        <div
          key={move[i].san}
          className="text-center"
          style={{ marginBottom: "5px" }}
        >
          <strong>{move[i].san}</strong>
        </div>
      );
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
