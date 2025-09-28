# Project: SvelteKit Web Application

## Project Overview

This is a SvelteKit project, bootstrapped with `create-svelte`. It is a modern web application framework that provides a rich developer experience with features like server-side rendering, routing, and code-splitting.

The project is configured with a standard set of modern web development tools:

*   **Framework**: [SvelteKit](https://kit.svelte.dev/) with [Svelte 5](https://svelte.dev/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) with the `@tailwindcss/forms` and `@tailwindcss/typography` plugins.
*   **Linting**: [ESLint](https://eslint.org/)
*   **Formatting**: [Prettier](https://prettier.io/)
*   **Testing**:
    *   Unit Testing: [Vitest](https://vitest.dev/)
    *   End-to-End (E2E) Testing: [Playwright](https://playwright.dev/)
*   **Deployment**: Configured for deployment on [Vercel](https://vercel.com/) using `@sveltejs/adapter-vercel`.

The current state of the project appears to be the default template, with no application-specific code added yet.

## Building and Running

### Prerequisites

-   Node.js (version recommended in `.nvmrc` if available, otherwise latest LTS)
-   npm, pnpm, or yarn

### Installation

Install the project dependencies:

```bash
npm install
```

### Development

To start the local development server:

```bash
npm run dev
```

You can also start the server and open the app in a new browser tab:

```bash
npm run dev -- --open
```

### Building

To create a production-ready build of the application:

```bash
npm run build
```

### Previewing the Build

To preview the production build locally:

```bash
npm run preview
```

## Testing

The project is set up with both unit and end-to-end tests.

*   **Run unit tests:**
    ```bash
    npm run test:unit
    ```

*   **Run E2E tests:**
    ```bash
    npm run test:e2e
    ```

*   **Run all tests:**
    ```bash
    npm run test
    ```

## Code Quality

*   **Linting**: Check for code quality and style issues.
    ```bash
    npm run lint
    ```

*   **Formatting**: Automatically format the entire codebase using Prettier.
    ```bash
    npm run format
    ```

*   **Type Checking**: Run the TypeScript compiler to check for type errors.
    ```bash
    npm run check
    ```

## Development Conventions

*   **Styling**: Utilize Tailwind CSS utility classes for styling. Global styles and Tailwind directives are located in `src/app.css`.
*   **Components**: Svelte components are located in `src/lib` and routes are in `src/routes`.
*   **Testing**: Write unit tests for components and logic in files ending with `.spec.ts`. Write E2E tests for user flows in the `e2e` directory.
*   **Code Style**: Adhere to the rules defined in `.eslintrc.js` and the formatting conventions from `.prettierrc`.
