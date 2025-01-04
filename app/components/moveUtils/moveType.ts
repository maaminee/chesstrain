export type Move = {
  san: string; // Notation algébrique du coup (ex: "e4", "Nf3", etc.)
  fen: string; // La FEN de la position après ce coup
  next?: Move;
  children?: Move[]; // Liste des coups enfants (variantes)
};
