import { Chess, Move, Square } from "@jackstenglein/chess";
import { useState } from "react";
import { Chessboard } from "react-chessboard";
import FenEditor from "./FenEditor";
import { Piece } from "chess.js";

export default function GameBoard() {
  const [chessGameState, setChessGameState] = useState(new Chess());
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);

  function makeMove(move: Move) {
    const result = chessGameState.move(move);
    setChessGameState(chessGameState);
    console.log(chessGameState);
    setSelectedMove(chessGameState.currentMove());
    return result;
  }

  // useEffect(() => {
  //   if (selectedMove === game.currentMove()) {
  //     return;
  //   }
  //   game.loadPgn(pgn);
  //   game.seek(selectedMove);
  //   setFen(game.fen());
  // }, [selectedMove, game]);

  function onDrop(source: Square, target: Square, piece: Piece) {
    const move = makeMove({
      from: source,
      to: target,
      promotion: piece[1].toLowerCase() ?? "q",
    });
    return !(move === null);
  }

  return (
    <>
      <Chessboard position={chessGameState.fen()} onPieceDrop={onDrop} />

      <div className="w-full flex-col">
        <div className="grow-0">
          {/* <StockfishAnalysis currentFen={game.fen()} /> */}
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
