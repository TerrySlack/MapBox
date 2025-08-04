##

This app will load a mapbox globe, starting with the city of San Francisco. You can zoom in and out.
You can also search for other locations around the globe.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# env.local

You need to add an env.local file with the following properties
I did not use session token here, but you do need a valid Token

NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
NEXT_PUBLIC_MAPBOX_SESSION_TOKEN=your_session_token_here
