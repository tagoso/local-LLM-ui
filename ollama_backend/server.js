const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Load environment variables

// Check for required environment variables
const requiredEnvVars = ['ALLOWED_ORIGIN', 'GENERATE_API_URL', 'MODEL_NAME', 'PORT'];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`Error: Missing required environment variable ${varName}`);
    process.exit(1); // Exit process if required variable is missing
  }
});

// Initialize the app
const app = express();

// Middleware for security headers
app.use(helmet());

// Enable 'trust proxy'
app.set('trust proxy', 1); // 1 enables trusting the first proxy

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN, // Use environment variable for origin
  methods: ['POST'], // Allow only POST requests
  allowedHeaders: ['Content-Type'], // Allow only Content-Type header
};
app.use(cors(corsOptions));

// Enable JSON parsing for incoming requests
app.use(bodyParser.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 minutes
});
app.use('/ai/api', limiter);

// Log file path
const logDir = '/var/log/chatlog/';
const logFile = path.join(logDir, 'user_requests.log');

// Ensure log directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Function to sanitize user input
const sanitizeInput = (input) => {
  return input
    .replace(/</g, '&lt;') // Escape <
    .replace(/>/g, '&gt;') // Escape >
    .replace(/&/g, '&amp;') // Escape &
    .replace(/"/g, '&quot;') // Escape "
    .replace(/'/g, '&#39;') // Escape '
    .replace(/\s+/g, ' ') // Collapse multiple spaces into one
    .trim(); // Remove leading/trailing spaces
};

// GET test endpoint (can be removed in production)
app.get('/ai/api', (req, res) => {
  res.send('The /ai/api endpoint is working. Use POST to interact with Ollama.');
});

// POST endpoint for generating responses
app.post('/ai/api', async (req, res) => {
  const { message } = req.body;

  // Input validation
  if (!message || typeof message !== 'string' || message.trim().length === 0 || message.length > 1000) {
    return res.status(400).json({ error: 'Invalid message input. Ensure it is a non-empty string with a maximum length of 1000 characters.' });
  }

  // Sanitize user input
  const sanitizedMessage = sanitizeInput(message);

  // Log user input
  try {
    const logEntry = `Timestamp: ${new Date().toISOString()}, User Input: ${sanitizedMessage}\n`;
    fs.appendFileSync(logFile, logEntry);
  } catch (logError) {
    console.error('Error writing to log file:', logError.message);
  }

  // Prepare prompt for external API
  const processedPrompt = `${sanitizedMessage}\n\nPlease provide a concise and short response. Limit your answer to 2 sentences.`;

  try {
    const response = await axios({
      method: 'post',
      url: process.env.GENERATE_API_URL, // Use environment variable for API URL
      data: {
        model: process.env.MODEL_NAME, // Use environment variable for model name
        prompt: processedPrompt,
      },
      responseType: 'stream', // Receive response as stream
      timeout: 5000, // Timeout in 5 seconds
    });

    let result = '';

    // Handle data chunks
    response.data.on('data', (chunk) => {
      result += chunk.toString(); // Concatenate chunks as string
    });

    // Handle stream end
    response.data.on('end', () => {
      try {
        const lines = result
          .split('\n') // Split by newlines
          .filter(line => line.trim() !== '') // Remove empty lines
          .map(line => JSON.parse(line)); // Parse each JSON line

        // Construct final response from all chunks
        const finalResponse = lines.map(line => line.response).join('');
        res.json({ response: finalResponse });
      } catch (parseError) {
        console.error('Error processing stream:', parseError.message);
        res.status(500).json({ error: 'Error processing response from the stream.' });
      }
    });

    // Handle stream errors
    response.data.on('error', (streamError) => {
      console.error('Stream error:', streamError.message);
      res.status(500).json({ error: 'Stream connection error occurred.' });
    });
  } catch (error) {
    console.error('Error communicating with the external API:', error.message);
    res.status(500).json({ error: 'Error communicating with the external API.' });
  }
});

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
