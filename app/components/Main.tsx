"use client";
import { useState } from "react";
import GameBoard from "./GameBoard";

export default function Main() {
  return (
    <div className="flex">
      <GameBoard />
    </div>
  );
}
