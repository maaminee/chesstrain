import { useEffect } from "react";

type Direction = "left" | "right" | "up" | "down";

const useKeyboardNavigation = (movePiece: (direction: Direction) => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          movePiece("left");
          break;
        case "ArrowRight":
          movePiece("right");
          break;
        case "ArrowUp":
          movePiece("up");
          break;
        case "ArrowDown":
          movePiece("down");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [movePiece]);
};

export default useKeyboardNavigation;
