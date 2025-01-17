import { Chess, Move, Square } from "@jackstenglein/chess";
import { useState } from "react";
import { Chessboard } from "react-chessboard";
import FenEditor from "./FenEditor";
import { Piece } from "chess.js";
import StockfishAnalysis from "./StockfishAnalysis";
import useKeyboardNavigation from "../hooks/keyboardNav";

export default function GameBoard() {
  const [chessGameState, setChessGameState] = useState(new Chess());
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);

  function isSameMove(move1: Move, move2: Move) {
    const tmpGame = new Chess();
    tmpGame.loadPgn(chessGameState.renderLine(chessGameState.currentMove()));
    tmpGame.move(move1);
    return (
      tmpGame.currentMove()?.before == move2.before &&
      tmpGame.currentMove()?.after == move2.after
    );
  }

  function makeMove(move: Move) {
    let result = null as Move | null;
    if (selectedMove?.next && isSameMove(move, selectedMove?.next)) {
      result = chessGameState.seek(selectedMove.next);
    } else if (selectedMove?.next) {
      selectedMove.next.variations.forEach((e) => {
        console.log(e, move);
        if (isSameMove(move, e[0])) {
          result = chessGameState.seek(e[0]);
        }
      });
    }
    if (result == null) {
      result = chessGameState.move(move);
    }
    setChessGameState(chessGameState);
    setSelectedMove(chessGameState.currentMove());
    return result;
  }

  function onDrop(source: Square, target: Square, piece: Piece) {
    const move = makeMove({
      from: source,
      to: target,
      promotion: piece[1].toLowerCase() ?? "q",
    });
    return !(move === null);
  }

  useKeyboardNavigation((direction) => {
    // add condition to first move, and to variations, lets do it another time cause FLEMME
    const currMove = chessGameState.currentMove();
    if (currMove?.next != undefined && direction == "right") {
      chessGameState.seek(currMove.next);
      setChessGameState(chessGameState);
      setSelectedMove(currMove.next);
    } else if (currMove?.previous && direction == "left") {
      chessGameState.seek(currMove.previous);
      setChessGameState(chessGameState);
      setSelectedMove(currMove.previous);
    }
  });

  return (
    <>
      <Chessboard position={chessGameState.fen()} onPieceDrop={onDrop} />

      <div className="w-full flex-col">
        <div className="min-h-56">
          <StockfishAnalysis currentFen={chessGameState.fen()} />
        </div>
        <div className="black">
          <FenEditor
            setChessGameState={setChessGameState}
            chessGameState={chessGameState}
            selectedMove={selectedMove}
            setSelectedMove={setSelectedMove}
          />
        </div>
      </div>
    </>
  );
}
