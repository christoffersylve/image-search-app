export interface UnsplashImage {
  id: string;
  alt_description: string | null;
  description: string | null;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    name: string;
    username: string;
    portfolio_url: string | null;
    profile_image: {
      small: string;
      medium: string;
      large: string;
    };
  };
  likes: number;
  width: number;
  height: number;
}

export type UnsplashColor =
  | "black_and_white"
  | "black"
  | "white"
  | "yellow"
  | "orange"
  | "red"
  | "purple"
  | "magenta"
  | "green"
  | "teal"
  | "blue";

export const unsplashColors: { id: UnsplashColor; name: string }[] = [
  { id: "black_and_white", name: "Black and White" },
  { id: "black", name: "Black" },
  { id: "white", name: "White" },
  { id: "yellow", name: "Yellow" },
  { id: "orange", name: "Orange" },
  { id: "red", name: "Red" },
  { id: "purple", name: "Purple" },
  { id: "magenta", name: "Magenta" },
  { id: "green", name: "Green" },
  { id: "teal", name: "Teal" },
  { id: "blue", name: "Blue" },
];

export const colorClassMap: Record<UnsplashColor, string> = {
  black_and_white: "bg-gray-900",
  black: "bg-black",
  white: "bg-white",
  yellow: "bg-yellow-500",
  orange: "bg-orange-500",
  red: "bg-red-500",
  purple: "bg-purple-500",
  magenta: "bg-pink-500",
  green: "bg-green-500",
  teal: "bg-teal-500",
  blue: "bg-blue-500",
};

export const colorStyleMap: Record<UnsplashColor, React.CSSProperties> = {
  black_and_white: { backgroundColor: "#1f2937" },
  black: { backgroundColor: "#000000" },
  white: {
    backgroundColor: "#ffffff",
    color: "#000000",
    border: "1px solid #000000",
  },
  yellow: { backgroundColor: "#facc15" },
  orange: { backgroundColor: "#f97316" },
  red: { backgroundColor: "#ef4444" },
  purple: { backgroundColor: "#a855f7" },
  magenta: { backgroundColor: "#ec4899" },
  green: { backgroundColor: "#22c55e" },
  teal: { backgroundColor: "#14b8a6" },
  blue: { backgroundColor: "#3b82f6" },
};

export function isValidUnsplashColor(color: string): Boolean {
  return unsplashColors.some(({ id }) => id === color);
}
