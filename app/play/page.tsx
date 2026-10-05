import type { Metadata } from "next";
import { connection } from "next/server";
import { Game } from "@/components/game/Game";
import { createGameSeed } from "@/lib/random/random";

export const metadata: Metadata = {
  title: "Play — SCALE IT",
  description: "Five rounds. Resize each object until its real-world scale looks right.",
};

export default async function PlayPage() {
  await connection();
  return <Game seed={createGameSeed()} />;
}
