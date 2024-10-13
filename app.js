const OPENAI_API_KEY = 'your-api-key-here'; // Replace with your OpenAI API key

const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const fileInput = document.getElementById('file-input');

// Function to append messages to the chat box
function appendMessage(message, type) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}-message`;
    chatBox.appendChild(messageElement);
    
    // Check if the message is from the AI to apply the typewriter effect
    if (type === 'miraculous') {
        typewriterEffect(messageElement, message); // Add typewriter effect only for AI responses
    } else {
        messageElement.innerHTML = message; // Display user message immediately
    }
    
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom of the chat
}

// Typewriter effect function for AI responses
function typewriterEffect(element, message, delay = 50) {
    let index = 0;
    element.innerHTML = ""; // Clear the message element

    // Function to simulate typing each letter one by one
    function type() {
        if (index < message.length) {
            element.innerHTML += message.charAt(index);
            index++;
            setTimeout(type, delay); // Delay between each letter
        }
    }

    type(); // Start typing
}

// Handling user input events
sendButton.addEventListener('click', sendMessage); // Send message on button click
userInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage(); // Send message when the Enter key is pressed
    }
});

// Function to send a message
function sendMessage() {
    const userMessage = userInput.value.trim(); // Get and trim the user's input
    if (userMessage) {
        appendMessage(userMessage, 'user'); // Display the user's message
        userInput.value = ''; // Clear the input field

        // Call the OpenAI API to analyze the user's message
        analyzeMessage(userMessage);
    }
}

// Analyze the message with OpenAI
async function analyzeMessage(message) {
    const prompt = `
        The user asked the following question:
        "${message}"
        Respond to this in French in a friendly, engaging, and kid-friendly tone. Use simple and fun language, suitable for children.
    `;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}` // Use the API key for authorization
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo', // Use GPT-3.5 Turbo model
                messages: [
                    { role: 'system', content: 'You are a helpful assistant who responds in a friendly and engaging way suitable for children.' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 150, // Limit the response length
                temperature: 0.7 // Set a higher temperature for more playful responses
            })
        });

        // Handle non-successful API responses
        if (!response.ok) {
            const errorData = await response.json();
            appendMessage(`API Error: ${errorData.error.message}`, 'miraculous');
            return;
        }

        // Get the AI's response and display it
        const data = await response.json();
        const miraculousResponse = data.choices[0].message.content;
        appendMessage(miraculousResponse, 'miraculous');
    } catch (error) {
        // Handle any other errors
        appendMessage(`Connection Error: ${error.message}`, 'miraculous');
    }
}
