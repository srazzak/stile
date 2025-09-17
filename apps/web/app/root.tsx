import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { Analytics } from "@vercel/analytics/react";

import { KeyboardProvider } from "./contexts/keyboard-context";
import { Separator } from "./components/ui/separator";
import { IconButton } from "./components/ui/icon-button/icon-button";
import { GlobeAltIcon } from "@heroicons/react/16/solid";
import { ExternalLink } from "./components/external-link";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full w-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="title" content="Verdigris" />
        <meta name="description" content="A simple local-only todo app." />
        <meta property="og:url" content="https://verdigris.vercel.app" />
        <meta property="og:site_name" content="Verdigris" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Verdigris" />
        <meta
          property="og:description"
          content="A simple local-only todo app"
        />
        <meta
          property="og:image"
          content="https://verdigris.vercel.app/og-image.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="verdigris.vercel.app" />
        <meta property="twitter:url" content="https://verdigris.vercel.app" />
        <meta name="twitter:title" content="Verdigris" />
        <meta
          name="twitter:description"
          content="A simple local-only todo app"
        />
        <meta
          name="twitter:image"
          content="https://verdigris.vercel.app/og-image.png"
        />
        <ExternalLink rel="icon" href="/icon.png" />
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col relative h-full w-full antialiased mx-auto max-w-4xl xl:max-w-3xl">
        <KeyboardProvider>{children}</KeyboardProvider>
        <ScrollRestoration />
        <Scripts />
        <Analytics />
        <Separator />
        <footer className="w-full p-2">
          <div className="w-full flex justify-between items-center">
            <div className="text-gray-500 font-serif text font-medium">
              You’ve just gotta fight your way through.
            </div>
            <div className="inline-flex gap-1">
              <ExternalLink href="https://suhailrazzak.com/">
                <IconButton variant="ghost">
                  <GlobeAltIcon className="h-4 w-4" />
                </IconButton>
              </ExternalLink>
              <ExternalLink href="https://github.com/srazzak/verdigris/">
                <IconButton variant="ghost">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    width="16"
                    height="16"
                  >
                    <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                  </svg>
                </IconButton>
              </ExternalLink>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
