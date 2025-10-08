# Stile

A simple and calm local-only todo list app.

## Summary

This was mainly just a fun project to learn to use IndexedDB. I mainly use Stile as my own todo app and it satisfies the needs I have for myself, so I don't expect too many changes in the future.

## Getting Started

Stile is set up in a repo so you can either deploy the web app or build a Tauri desktop app yourself.

### Installation

Stile is set up to use `pnpm` but use whatever package manager you prefer.

Install the dependencies:

```bash
pnpm install
```

### Development

Start the development server with HMR:

```bash
pnpm run dev:web
```

Stile will be available at `http://localhost:5173`.

## Building for Production

Create a production web build:

```bash
pnpm run build:web
```

For a desktop app build, we use Tauri to wrap and deploy the app. To build it:

```bash
pnpm run build:desktop
```

This will create a binary for your local setup.

### Deployment

Stile is set up to be deployed to Vercel. But you can also deploy it to any other platform using the Dockerfile.
