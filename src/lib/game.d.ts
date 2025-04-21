// to be tested
interface GameToken {
  id: number;
  name: string;
  color: string;
  description: string;
}

const TOKENS: GameToken[] = [
  { id: 0, name: "SEED", color: "#E0115F", description: "Free mint" },
  { id: 1, name: "WATER", color: "#0F52BA", description: "Free mint" },
  { id: 2, name: "SOIL", color: "#50C878", description: "Free mint" },
  {
    id: 3,
    name: "PLANT",
    color: "#8531BA",
    description: "Needs SEED and WATER",
  },
  {
    id: 4,
    name: "FRUIT",
    color: "#307DA1",
    description: "Needs WATER and SOIL",
  },
  {
    id: 5,
    name: "FLOWER",
    color: "#986C8E",
    description: "Needs SEED and SOIL",
  },
  {
    id: 6,
    name: "BASKET",
    color: "#483D6F",
    description: "Needs SEED, WATER, and SOIL",
  },
];
