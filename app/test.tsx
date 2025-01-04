"use client";
import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

export default function Page() {
  const [game, setGame] = useState(new Chess());
  const [stockfish, setStockfish] = useState(null);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [evaluation, setEvaluation] = useState(null); // Évaluation de la position
  const bestMoves = ["", "", "", "", ""];
  useEffect(() => {
    const engine = new Worker("./stockfish.js");
    setStockfish(engine);

    // Initialisation de Stockfish avec la position FEN
    engine.postMessage("setoption name MultiPV value 5"); // Demander 5 variantes
    engine.postMessage(`position fen ${game.fen()}`);
    engine.postMessage("go depth 20"); // Profondeur de recherche (ajustable)

    engine.onmessage = (event) => {
      const depth = event.data.match(/depth (\d+)/);
      if (!depth || depth < 10) {
        return;
      }
      if (event.data.includes("info")) {
        // Exemple de message : "info depth 10 score cp 23"
        const match = event.data.match(/score cp (-?\d+)/);
        if (match) {
          setEvaluation(match[1] / 100); // L'évaluation en centipions
        }
      }
      // Si Stockfish envoie des suggestions de coups
      if (event.data.includes("multipv")) {
        const moves = event.data.split("\n");
        // Parcourir toutes les variantes renvoyées
        moves.forEach((line) => {
          const id = event.data.match(/multipv (\d+)/);
          const bmoves = event.data.match(/time (\d+) pv (.+)/);
          bestMoves[id[1] - 1] = bmoves[2];
          console.log(bestMoves);
        });

        setVariants(bestMoves);
        setLoading(false);
      }
    };

    // Nettoyage au démontage du composant
    return () => {
      engine.postMessage("quit");
    };
  }, [game.fen()]);

  function makeMove(move) {
    const result = game.move(move);
    setGame(new Chess(game.fen()));
    return result;
  }
  function makeRandomMove() {
    const possibleMoves = game.moves();
    if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0)
      return; // exit if the game is over
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    makeMove(possibleMoves[randomIndex]);
  }

  function onDrop(source, target, piece) {
    const move = makeMove({
      from: source,
      to: target,
      promotion: piece[1].toLowerCase() ?? "q",
    });
    if (move === null) return false;
    setTimeout(makeRandomMove, 2200);
    return true;
  }

  function onClick() {
    if (stockfish) {
      stockfish.postMessage("quit");
    }
  }
  return (
    <div className="w-full flex gap-14">
      <div className="w-1/2">
        <Chessboard position={game.fen()} onPieceDrop={onDrop} />
      </div>
      <div>
        {evaluation !== null && <p>Evaluation : {evaluation}</p>}
        {loading ? (
          <p>Chargement des variantes...</p>
        ) : (
          <div className="w-full">
            <ul>
              {variants.map((move, index) => (
                <li key={index}>
                  Coup {index + 1}: {move}
                </li>
              ))}
            </ul>
          </div>
        )}
        <button onClick={onClick}> STOP </button>
      </div>
    </div>
  );
}
