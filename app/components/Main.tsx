"use client";
import { useState } from "react";
import GameBoard from "./GameBoard";

export default function Main() {
  const [pgn, setPGN] = useState("*");

  return (
    <div className="flex">
      <GameBoard pgn={pgn} setPgn={setPGN} />
    </div>
  );
}
