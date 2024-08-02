# RA1L App

[Solidity Contract](./solidity/)

[Configure Environment](./env.dev)

```bash
cp .env.dev .env
# edit .env with correct environment variables
```

```env
# Sample Environment Configuration
DATABASE_URL="mongodb+srv://app..."
PERSONA_KEY="..."
PERSONA_TEMPLATE_ID="..."
PERSONA_ENVIRONMENT_ID="..."
```

## Commands

### `bun run dev`

Start the dev server on `http://localhost:4200`.

### `bun run build`

Build the Next.js output in `dist`.

### `bun run start`

Start a production server on `http://localhost:3000`.

### `bun run lint` | `bun run lint --fix`

Runs `eslint` on the project and cleans up any style issues.

### `bun run scss`

Creates a debug `printer.css` file to review build outputs.

### `bun run prisma`

Creates the `prisma` client.

### `bun run prisma:update`

Creates the `prisma` client and then pushes schema updates to the database.

## Documentation

Review the documentation on [prntr.click/docs](https://prntr.click/docs).

Review the [CHANGELOG](https://github.com/PrinterFramework/CLI/blob/master/CHANGELOG.md) for any updates made to the project.
