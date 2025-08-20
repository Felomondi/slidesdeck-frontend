# SlidesDeck Frontend

An AI-powered presentation slide deck generator built with React and TypeScript. Create compelling slide presentations by simply describing your topic, and let AI generate a structured outline with talking points, visual suggestions, and speaker notes.

## Features

- 🤖 **AI-Powered Generation**: Create slide outlines using artificial intelligence
- ✏️ **Editable Content**: Customize generated slides with inline editing
- 🎨 **Visual Suggestions**: Get AI-generated visual recommendations for each slide
- 📝 **Speaker Notes**: Include detailed speaker notes for presentations
- ⚙️ **Configurable Options**: Control slide count, bullet points, and content inclusion
- 🎭 **Smooth Animations**: Beautiful transitions powered by Framer Motion
- 📱 **Responsive Design**: Works seamlessly across desktop and mobile devices

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **pnpm** (pnpm is recommended as the project uses pnpm-lock.yaml)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Felomondi/slidesdeck-frontend.git
   cd slidesdeck-frontend
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install

   # Or using pnpm (recommended)
   pnpm install
   ```

## Running the Application

### Development Server

Start the development server with hot reloading:

```bash
# Using npm
npm run dev

# Using pnpm
pnpm dev
```

The application will be available at `http://localhost:5173` (default Vite port).

### Production Build

Build the application for production:

```bash
# Using npm
npm run build

# Using pnpm
pnpm build
```

### Preview Production Build

Preview the production build locally:

```bash
# Using npm
npm run preview

# Using pnpm
pnpm preview
```

## Environment Configuration

The application requires a backend API to generate slide content. Configure the API endpoint using environment variables:

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit the `.env` file** to match your backend configuration:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```

3. **Available Environment Variables:**
   - `VITE_API_BASE_URL`: Backend API base URL (default: `http://localhost:8000`)

## API Requirements

This frontend application requires a backend API that provides:

- **POST `/api/generate`** - Generate slide outline
  - Request body:
    ```json
    {
      "brief": "string",
      "slideCount": "number", 
      "maxBulletsPerSlide": "number",
      "includeVisualSuggestions": "boolean",
      "includeNotes": "boolean"
    }
    ```
  - Response:
    ```json
    {
      "topic": "string",
      "slides": [
        {
          "slideTitle": "string",
          "talkingPoints": ["string"],
          "visualSuggestion": "string",
          "notes": "string"
        }
      ]
    }
    ```

## Technology Stack

- **Frontend Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **UI Components**: Radix UI primitives
- **Code Quality**: ESLint with TypeScript support

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, etc.)
│   ├── slide-card.tsx  # Individual slide component
│   ├── topbar.tsx      # Application header
│   └── ...             # Other components
├── lib/                # Utility libraries
│   ├── api.ts          # API communication functions
│   ├── utils.ts        # General utilities
│   └── supabase.ts     # Supabase configuration
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```
## Development
### Code Quality
Run the linter to check code quality:
```bash
# Using npm
npm run lint
# Using pnpm  
pnpm lint
```

### Adding New Dependencies

When adding new dependencies, make sure to use the same package manager consistently:

```bash
# Using npm
npm install package-name

# Using pnpm (recommended)
pnpm add package-name
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run the linter (`npm run lint`)
5. Build the project (`npm run build`)
6. Commit your changes (`git commit -m 'Add some amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## License

This project is part of the SlidesDeck application suite. Please refer to the main repository for licensing information.

## Support

For issues and feature requests, please open an issue on the [GitHub repository](https://github.com/Felomondi/slidesdeck-frontend/issues).
