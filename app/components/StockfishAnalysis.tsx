"use client";
import React, { useEffect, useState } from "react";

function StockfishAnalysis({ currentFen }: { currentFen: string }) {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [evaluation, setEvaluation] = useState(null);
  const [showedDepth, setShowedDepth] = useState(null);
  let isWhiteTurn = true;
  const bestMoves = ["", "", "", "", ""];

  useEffect(() => {
    setLoading(true);
    const engine = new Worker("./stockfish-16.1-lite.js");

    engine.postMessage("setoption name WebAssembly value true");
    engine.postMessage(
      'setoption name wasm path value "/stockfish-16.1-lite.wasm"'
    );
    // Initialisation de Stockfish avec la position FEN
    engine.postMessage("setoption name MultiPV value 5"); // Demander 5 variantes
    engine.postMessage(`position fen ${currentFen}`);
    engine.postMessage("go depth 20"); // Profondeur de recherche (ajustable)
    engine.onmessage = (event) => {
      const depth = event.data.match(/depth (\d+)/);

      if (!depth) {
        return;
      }
      setShowedDepth(depth[1]);
      if (event.data.includes("info")) {
        // Exemple de message : "info depth 10 score cp 23"
        const match = event.data.match(/score cp (-?\d+)/);
        if (match) {
          isWhiteTurn = currentFen.charAt(currentFen.length - 12) === "w";
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
        });

        setVariants(bestMoves);
        setLoading(false);
      }
    };

    // Nettoyage au démontage du composant
    return () => {
      engine.postMessage("quit");
    };
  }, [currentFen]);

  return (
    <div>
      {evaluation !== null && (
        <p className="text-center m-2">
          Evaluation : {isWhiteTurn ? evaluation : -evaluation} , Depth :{" "}
          {showedDepth}
        </p>
      )}
      {loading ? (
        <p>Chargement des variantes...</p>
      ) : (
        <div className="w-full">
          <ul>
            {variants.map((move, index) => (
              <li className="m-2" key={index}>
                {move}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default StockfishAnalysis;
