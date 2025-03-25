# Random Quotes

A web application built with Next.js that displays random quotes.

## Installation and Setup

To run this project locally, you will need to have Node.js and npm (or yarn) installed on your system.

1. **Clone the repository:**

   ```bash
   git clone https://github.com/jayc13/random-quotes
   cd random-quotes-next
   ```

2. **Install dependencies:**

   ```bash
   npm install  # or yarn install
   ```

3. **Run the development server:**

   ```bash
   npm run dev  # or yarn dev
   ```

   This will start the development server, and you can access the application in your browser at the provided URL (usually `http://localhost:3000`).

## Usage

This application displays a random quote on the main page. To use it, simply navigate to the application's URL in your browser (e.g., `http://localhost:3000` when running locally).

### API

The application also provides an API endpoint to fetch random quotes:

- `/api/quote`: Returns a random quote in JSON format.

  **Example Response:**

  ```json
  {
    "quote": "The only way to do great work is to love what you do.",
    "author": "Steve Jobs"
  }
  ```

- `/api/quote?author={author}`: Returns a random quote by a specific author. Replace `{author}` with the desired author's name.

  **Example Request:**

  `/api/quote?author=Steve Jobs`

  **Example Response:**

  ```json
  {
    "quote": "Your time is limited, so don't waste it living someone else's life.",
    "author": "Steve Jobs"
  }
  ```

## API Documentation

### `/api/quote`

This endpoint returns a random quote in JSON format.

**Method:** GET

**Parameters:**

- None

**Response:**

- **Success (200 OK):** Returns a JSON object with the following properties:
  - `quote`: The random quote text (string).
  - `author`: The author of the quote (string).

  **Example:**

  ```json
  {
    "quote": "The only way to do great work is to love what you do.",
    "author": "Steve Jobs"
  }
  ```

- **Error (405 Method Not Allowed):** Returned if the request method is not GET.

  **Example:**

  ```json
  {
    "error": "Method Not Allowed"
  }
  ```

- **Error (429 Too Many Requests):** Returned if the client has exceeded the rate limit (currently 100 requests per minute per IP address).

  **Example:**

  ```json
  {
    "error": "Too Many Requests"
  }
  ```

### `/api/quote?author={author}`

This endpoint returns a random quote by a specific author.

**Method:** GET

**Parameters:**

- `author` (string, required): The name of the author for whom to fetch a quote.

**Response:**

- **Success (200 OK):** Returns a JSON object with the following properties:
  - `quote`: The random quote text by the specified author (string).
  - `author`: The author of the quote (string).

  **Example:**

  ```json
  {
    "quote": "Your time is limited, so don't waste it living someone else's life.",
    "author": "Steve Jobs"
  }
  ```

- **Error (404 Not Found):** Returned if no quotes are found for the specified author.

  **Example:**

  ```json
  {
    "error": "No quotes found for author: Unknown Author"
  }
  ```

- **Error (405 Method Not Allowed):** Returned if the request method is not GET.

  **Example:**

  ```json
  {
    "error": "Method Not Allowed"
  }
  ```

- **Error (429 Too Many Requests):** Returned if the client has exceeded the rate limit (currently 100 requests per minute per IP address).

  **Example:**

  ```json
  {
    "error": "Too Many Requests"
  }
  ```

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these guidelines:

1. **Report Issues:** If you encounter any issues or bugs, please open an issue on the [GitHub repository](https://github.com/jayc13/random-quotes/issues) and provide a detailed description of the problem, including steps to reproduce it.

2. **Suggest Improvements:** If you have any suggestions for improvements or new features, feel free to open an issue on the [GitHub repository](https://github.com/jayc13/random-quotes/issues) and describe your ideas.

3. **Submit Pull Requests:** If you'd like to contribute code changes, please follow these steps:

   - Fork the repository.
   - Create a new branch for your changes: `git checkout -b feature/your-feature-name` or `git checkout -b fix/your-fix-name`.
   - Make your changes, following the project's coding style and conventions.
   - Write tests for your changes (if applicable).
   - Run all tests to ensure everything is working correctly: `npm run test` (or the relevant test scripts from `package.json`).
   - Commit your changes with a clear and descriptive commit message.
   - Push your changes to your forked repository.
   - Open a pull request to the main branch of the original repository.

Please ensure that your pull request includes a clear description of the changes you've made and any relevant information for reviewers.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

If you have any questions or need further assistance, you can reach out to the project maintainers at:

- [Javier Caballero (jayc13)](https://github.com/jayc13)
