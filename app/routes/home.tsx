import type { Route } from "./+types/home";
import { Welcome } from "@/welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Verdigris" },
    { name: "description", content: "A simple todo app" },
  ];
}

export default function Home() {
  return <Welcome />;
}
