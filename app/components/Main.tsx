"use client";
import React, { use, useEffect, useState } from "react";
import GameBoard from "./GameBoard";
import { Chess } from "@jackstenglein/chess";

export default function Main() {
  const [pgn, setPGN] = useState("*");

  return (
    <div className="flex">
      <GameBoard pgn={pgn} setPgn={setPGN} />
    </div>
  );
}
