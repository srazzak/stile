import type { Route } from "./+types/home";
import { Main } from "@/main/main";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Verdigris" },
    { name: "description", content: "A simple todo app" },
  ];
}

export default function Home() {
  return <Main />;
}
