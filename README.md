# Verdigris

<div align="center">
    <a href="https://github.com/user-attachments/assets/12a8acac-3527-4131-8426-266e1d098dd0">
        <img width="509" alt="Verdigris logo" src="https://github.com/user-attachments/assets/12a8acac-3527-4131-8426-266e1d098dd0" />
    </a>
    <p>A simple and calm local-only todo list app.</p>
</div>


## Summary

This was mainly just a fun project to learn to use IndexedDB. I mainly use Verdigris as my own todo app and it satisfies the needs I have for myself, so I don't expect too many changes in the future.

## Getting Started

Verdigris is set up in a repo so you can either deploy the web app or build a Tauri desktop app yourself.

### Installation

Verdigris is set up to use `pnpm` but use whatever package manager you prefer.

Install the dependencies:

```bash
pnpm install
```

### Development

Start the development server with HMR:

```bash
pnpm run dev:web
```

Verdigris will be available at `http://localhost:5173`.

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

Verdigris is set up to be deployed to Vercel. But you can also deploy it to any other platform using the Dockerfile.
