export const GAME_CONFIG = {
  LEVEL_1: {
    CORRECT_ANSWER: "2026-03-23",
    TITLE: "Level 1 — Starting Point",
  },
  LEVEL_2: {
    CARD_IMAGES: [
      "/images/1.png",
      "/images/2.png",
      "/images/3.png",
      "/images/4.png",
      "/images/5.png",
      "/images/6.png",
    ],
    TITLE: "Level 2 — The Memory",
  },
  LEVEL_3: {
    MAZE_LAYOUT: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
      [1, 1, 1, 0, 0, 0, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 0, 0, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    START_POS: { x: 1, y: 1 },
    TARGET_POS: { x: 8, y: 8 },
    TITLE: "Level 3 — Find Me",
  },
  LEVEL_4: {
    GRID_SIZE: 3,
    PHOTO_URL: "/images/we.jpeg",
    TITLE: "Level 4 — Puzzle",
  },
  LEVEL_5: {
    BOX_COUNT: 16,
    TIME_LIMIT: 15,
    TARGET_SCORE: 10,
    MAX_LIVES: 3,
    TITLE: "Level 5 — Catch Cat",
  },
  LEVEL_6: {
    WORDS: [
      "AKU",
      "KAMU",
      "CINTA",
      "SAYANG",
      "KASIH",
      "RINDU",
      "JODOH",
      "SETIA",
      "HATI",
      "HUBUNGAN",
      "JANJI",
      "DOA",
      "MESRA",
      "BAHAGIA",
      "DEKAT",
      "PELUK",
      "KOMITMEN",
      "ROMANTIS",
      "PENGERTIAN",
      "KEBERSAMAAN",
    ],
    TIME_LIMIT: 30,
    WORD_COUNT: 10,
    TITLE: "Level 6 — Susun Kata",
  },
  LEVEL_7: {
    PIN_LENGTH: 4,
    TITLE: "Safe Box",
  },
};

export const ANIMATION_CONFIG = {
  CONFETTI: {
    NUMBER_OF_PIECES: 500,
    GRAVITY: 0.15,
    RECYCLE: false,
  },
  LOADER_DURATION: 2000,
};

export const COLORS = {
  PRIMARY: "#D5CEA3",
  SHINE: "#E5E5CB",
  BACKGROUND: "#1A120B",
};
