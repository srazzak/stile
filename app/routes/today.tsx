import type { Route } from "./+types/today";
import { Today } from "@/today/today";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Verdigris" },
    { name: "description", content: "A simple todo app" },
  ];
}

export default function Home() {
  return <Today />;
}
