import { Chess, Move } from "@jackstenglein/chess";
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
  const [selectedMove, setSelectedMove] = useState(game.currentMove());
  const [fen, setFen] = useState(game.fen());

  function makeMove(move: Move) {
    const newGame = new Chess();
    newGame.loadPgn(game.renderPgn());
    newGame.seek(game.currentMove());

    const result = newGame.move(move);

    if (!result) {
      return false;
    }
    setSelectedMove(newGame.currentMove());
    setGame(newGame);

    setPgn(newGame.renderPgn());
    return result;
  }

  useEffect(() => {
    const newGame = new Chess();
    console.log(game.renderPgn());
    newGame.loadPgn(game.renderPgn());
    newGame.seek(selectedMove);

    // if (selectedMove && selectedMove != newGame.currentMove()) {
    //   newGame.move(selectedMove);
    // }
    setGame(newGame);
    setFen(newGame.fen());
  }, [selectedMove]);

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
      <Chessboard position={fen} onPieceDrop={onDrop} />

      <div className="w-full flex-col">
        <div className="grow-0">
          {/* <StockfishAnalysis currentFen={game.fen()} /> */}
        </div>
        <div className="black">
          <FenEditor
            pgn={pgn}
            selectedMove={selectedMove}
            setSelectedMove={setSelectedMove}
          />
        </div>
      </div>
    </>
  );
}
