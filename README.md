# Restaurant Finder API

This project is a backend service designed to find restaurants based on natural language queries. It uses an AI model via OpenRouter to interpret user requests, structures them into a machine-readable format, and then queries the Foursquare Places API to fetch relevant restaurant data.

## Features

-   **Natural Language Processing**: Translates user queries like "Find Japanese restaurants near Manila" into structured API calls.
-   **AI Integration**: Leverages the OpenRouter API to access AI models.
-   **Foursquare API Integration**: Connects with the Foursquare Places API to search for restaurants based on cuisine and location.
-   **Robust Validation**: Uses Zod for strict schema validation of AI outputs and Foursquare API responses.
-   **Secure Endpoint**: Includes a simple access code mechanism to protect the search endpoint.

## Technology Stack

-   **Backend**: Node.js, Express.js
-   **Language**: TypeScript
-   **API Services**:
    -   OpenRouter (for AI-powered query interpretation)
    -   Foursquare Places API (for restaurant data)
-   **Validation**: Zod
-   **Development**: `nodemon` for live-reloading, `ts-node` for running TypeScript directly.
-   **Package Manager**: `pnpm`

## API Endpoint

### `GET /search`

Searches for restaurants based on a natural language message.

**Query Parameters:**

| Parameter | Type     | Description                                               | Required |
| :-------- | :------- | :-------------------------------------------------------- | :------- |
| `message` | `string` | The user's search query (e.g., "ramen places in tokyo").  | Yes      |
| `code`    | `string` | The secret access code defined in the `.env` file.        | Yes      |

**Example Request:**

```
GET /search?message=Find%20me%20a%20pizza%20place%20near%20San%20Francisco&code=YOUR_ACCESS_CODE
```

**Success Response (200 OK):**

Returns a JSON object containing an array of restaurant results.

```json
{
    "results": [
        {
            "name": "Tony's Pizza Napoletana",
            "address": "1570 Stockton St, San Francisco, CA 94133",
            "cuisine": "Pizza Place, Italian Restaurant"
        },
        {
            "name": "Golden Boy Pizza",
            "address": "542 Green St, San Francisco, CA 94133",
            "cuisine": "Pizza Place"
        }
    ]
}
```

**Error Responses:**

-   `400 Bad Request`: If the `message` parameter is missing.
-   `401 Unauthorized`: If the `code` is missing or incorrect.
-   `500 Internal Server Error`: For any unexpected server-side errors, including issues with external API calls.

## Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   `pnpm` package manager

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/shirooo098/restaurant-finder.git
    cd restaurant-finder
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root of the project and add the following variables. You will need to obtain API keys from the respective services.

    ```env
    # Your API key from https://openrouter.ai/
    OPENROUTER_API_KEY="your_openrouter_api_key"

    # Your API key from https://location.foursquare.com/developer/
    FOURSQUARE_API_KEY="your_foursquare_api_key"

    # A secret code of your choice to protect the API endpoint
    ACCESS_CODE="your_secret_access_code"
    ```

### Running the Application

**Development Mode**

To run the server with hot-reloading enabled:

```bash
pnpm dev
```

The server will be running at `http://localhost:3000`.

**Production Mode**

1.  **Build the project:**
    This command compiles the TypeScript code into JavaScript in the `dist/` directory.
    ```bash
    pnpm build
    ```

2.  **Start the server:**
    This command runs the compiled application.
    ```bash
    pnpm start
    ```

## Project Structure

```
.
├── src/
│   ├── index.ts              # Main application entry point and Express server setup
│   ├── routes/
│   │   └── searchRoute.ts    # Defines the /search API endpoint and its logic
│   ├── schema/
│   │   └── schema.ts         # Zod schemas for validation
│   └── services/
│       ├── AIService.ts      # Logic for interacting with the OpenRouter AI
│       └── foursquareService.ts # Logic for fetching data from the Foursquare API
├── package.json
└── tsconfig.json

## Assumption & Limitations

My assumption & limitations of this application as a developer, is that the AI response is slow, it needs optimization perhaps use of Redis to cache; which I don't currently have an knowledge and experience. In addition to that, the error handling are inconsistent.
