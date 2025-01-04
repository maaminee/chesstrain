import { Chess } from "@jackstenglein/chess";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import FenEditor from "./FenEditor";
import StockfishAnalysis from "./StockfishAnalysis";

export default function GameBoard({
  pgn,
  setPgn,
}: {
  pgn: string;
  setPgn: Dispatch<SetStateAction<string>>;
}) {
  const [game, setGame] = useState(new Chess());
  if (pgn != "*") {
    game.loadPgn(pgn);
  }
  function makeMove(move) {
    const result = game.move(move);
    if (!result) {
      return false;
    }
    console.log();
    setGame(game);
    setPgn(game.renderPgn());
    return result;
  }

  function onDrop(source, target, piece) {
    const move = makeMove({
      from: source,
      to: target,
      promotion: piece[1].toLowerCase() ?? "q",
    });
    return !(move === null);
  }

  return (
    <>
      <Chessboard position={game.fen()} onPieceDrop={onDrop} />
      <div className="w-full flex-col">
        <div className="grow-0">
          <StockfishAnalysis currentFen={game.fen()} />
        </div>
        <div className="black">
          <FenEditor pgn={game.renderPgn()} />
        </div>
      </div>
    </>
  );
}
