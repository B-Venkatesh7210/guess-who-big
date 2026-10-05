import type { Metadata } from "next";
import { Game } from "@/components/game/Game";

export const metadata: Metadata = {
  title: "Play — SCALE IT",
  description: "Resize the soda can until its real-world scale matches the basketball.",
};

export default function PlayPage() {
  return <Game />;
}
