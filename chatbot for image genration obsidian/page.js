// KidDoodle - Fun Image Generator for Kids
// Main JavaScript file

// Configuration
const config = {
  // ===== WEBHOOK CONFIGURATION =====
  // Add your webhook URL and API key directly here
  webhookUrl: "https://your-webhook-url-here.com/api/generate",
  apiKey: "your-api-key-here",
  // ==================================

  // Path to the Obsidian logo - will be added later
  logoPath: "",

  // Show the Obsidian logo (true/false)
  showLogo: true,

  defaultResponses: [
    "I'm drawing that for you right now! 🖌️",
    "Let me create that magical picture! ✨",
    "Ooh, that sounds fun to draw! 🎨",
    "My crayons are ready! Drawing now... 🖍️",
    "I love that idea! Let me make it colorful! 🌈",
    "Yay! I'll draw that for you! 🎉",
    "My robot brushes are painting that now! 🤖",
    "That's going to look AWESOME! Just a moment... 🚀",
    "I'm so excited to draw this! Here I go! 🦄",
    "Watch me create something super cool! 🌟",
  ],

  greetingMessage:
    "Hi there, friend! 👋 I'm Doodle Bot! ✨ Tell me what kind of picture you want to see, and I'll draw it for you! 🎨 You can ask for things like 'a purple dragon eating ice cream' 🍦 or 'a spaceship with rainbow rockets' 🚀!",

  loadingMessages: [
    "Drawing with my magic crayons... 🖍️",
    "Mixing up some digital paint... 🎨",
    "Getting my robot brushes ready... 🤖",
    "Sprinkling some creativity dust... ✨",
    "Adding extra sparkles to your image... 💫",
    "Making sure the colors are super bright... 🌈",
    "Teaching my pet pixels to make shapes... 🐶",
    "Warming up my imagination engines... 🔥",
    "Collecting stardust for your special picture... 🌟",
    "Searching for the perfect colors... 🔍",
  ],

  bubbleColors: ["#ff6b6b", "#4cc9f0", "#f7d716", "#06d6a0", "#118ab2", "#ef476f"],

  imagePlaceholders: [
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=400&width=400",
    "/placeholder.svg?height=350&width=450",
  ],

  // Fun emojis to use in messages
  emojis: [
    "🎨",
    "✨",
    "🚀",
    "🌈",
    "🦄",
    "🎉",
    "🔮",
    "🌟",
    "🎭",
    "🎪",
    "🎠",
    "🎡",
    "🧸",
    "🦖",
    "🐉",
    "🦕",
    "🐳",
    "🦋",
    "🌺",
    "🍦",
    "🍭",
    "🧁",
    "🍬",
  ],
}

// DOM Elements
const elements = {
  chatMessages: document.getElementById("chatMessages"),
  messageInput: document.getElementById("messageInput"),
  sendButton: document.getElementById("sendButton"),
  logoContainer: document.getElementById("logoContainer"),
  floatingBubbles: document.getElementById("floatingBubbles"),
}

// State
const state = {
  messages: [],
  isWaitingForResponse: false,
}

// Initialize the application
function init() {
  // Update logo display
  updateLogoDisplay()

  // Create floating bubbles
  createFloatingBubbles()

  // Add event listeners
  elements.messageInput.addEventListener("keypress", handleInputKeypress)
  elements.sendButton.addEventListener("click", handleSendMessage)

  // Add greeting message
  setTimeout(() => {
    addBotMessage(config.greetingMessage)
  }, 500)
}

// Create floating bubbles in the background
function createFloatingBubbles() {
  for (let i = 0; i < 15; i++) {
    const bubble = document.createElement("div")
    bubble.className = "bubble"

    const size = Math.random() * 100 + 50
    const color = config.bubbleColors[Math.floor(Math.random() * config.bubbleColors.length)]

    bubble.style.width = `${size}px`
    bubble.style.height = `${size}px`
    bubble.style.backgroundColor = color
    bubble.style.left = `${Math.random() * 100}%`
    bubble.style.animationDuration = `${Math.random() * 20 + 10}s`
    bubble.style.animationDelay = `${Math.random() * 5}s`

    elements.floatingBubbles.appendChild(bubble)
  }
}

// Handle keypress in the input field
function handleInputKeypress(e) {
  if (e.key === "Enter") {
    handleSendMessage()
  }
}

// Handle sending a message
function handleSendMessage() {
  const message = elements.messageInput.value.trim()

  if (message && !state.isWaitingForResponse) {
    // Add user message to chat
    addUserMessage(message)

    // Clear input
    elements.messageInput.value = ""

    // Process the message
    processUserMessage(message)
  }
}

// Add a user message to the chat
function addUserMessage(text) {
  const message = {
    id: Date.now(),
    text,
    sender: "user",
  }

  state.messages.push(message)

  const messageElement = document.createElement("div")
  messageElement.className = "message user-message"
  messageElement.textContent = text
  messageElement.style.animationDelay = "0.1s"

  elements.chatMessages.appendChild(messageElement)
  scrollToBottom()
}

// Add a random emoji to text
function addRandomEmoji(text) {
  const emoji = config.emojis[Math.floor(Math.random() * config.emojis.length)]
  return text + " " + emoji
}

// Add a bot message to the chat
function addBotMessage(text, image = null) {
  const message = {
    id: Date.now(),
    text,
    sender: "bot",
    image,
  }

  state.messages.push(message)

  const messageElement = document.createElement("div")
  messageElement.className = "message bot-message"
  messageElement.textContent = text
  messageElement.style.animationDelay = "0.1s"

  elements.chatMessages.appendChild(messageElement)

  if (image) {
    const imageContainer = document.createElement("div")
    imageContainer.className = "image-container"

    const imageElement = document.createElement("img")
    imageElement.className = "generated-image"
    imageElement.src = image
    imageElement.alt = "Generated image"

    imageContainer.appendChild(imageElement)
    messageElement.appendChild(imageContainer)
  }

  scrollToBottom()
}

// Add a typing indicator
function addTypingIndicator() {
  const indicator = document.createElement("div")
  indicator.className = "message bot-message typing-indicator"
  indicator.id = "typingIndicator"

  for (let i = 0; i < 3; i++) {
    const dot = document.createElement("div")
    dot.className = "typing-dot"
    indicator.appendChild(dot)
  }

  elements.chatMessages.appendChild(indicator)
  scrollToBottom()
}

// Remove typing indicator
function removeTypingIndicator() {
  const indicator = document.getElementById("typingIndicator")
  if (indicator) {
    indicator.remove()
  }
}

// Process user message and generate response
function processUserMessage(message) {
  state.isWaitingForResponse = true

  // Show typing indicator
  addTypingIndicator()

  // Get a random initial response
  const initialResponse = addRandomEmoji(
    config.defaultResponses[Math.floor(Math.random() * config.defaultResponses.length)],
  )

  // Simulate bot thinking
  setTimeout(() => {
    removeTypingIndicator()
    addBotMessage(initialResponse)

    // Show another typing indicator for image generation
    setTimeout(() => {
      addTypingIndicator()

      // Simulate image generation process
      const loadingMessage = config.loadingMessages[Math.floor(Math.random() * config.loadingMessages.length)]

      setTimeout(() => {
        removeTypingIndicator()
        addBotMessage(loadingMessage)

        // Try to use webhook if configured
        if (config.webhookUrl) {
          callWebhook(message)
            .then((response) => {
              // Handle successful webhook response
              if (response && response.imageUrl) {
                addBotMessage(addRandomEmoji("Ta-da! Here's your picture! Do you like it?"), response.imageUrl)
              } else {
                // Fallback to placeholder if webhook doesn't return an image
                const placeholderImage = getRandomPlaceholderImage()
                addBotMessage(
                  addRandomEmoji("Here's your amazing picture! What do you want me to draw next?"),
                  placeholderImage,
                )
              }
              state.isWaitingForResponse = false
            })
            .catch((error) => {
              console.error("Webhook error:", error)
              // Fallback to placeholder on error
              const placeholderImage = getRandomPlaceholderImage()
              addBotMessage(addRandomEmoji("Here's what I drew for you! What else should I create?"), placeholderImage)
              state.isWaitingForResponse = false
            })
        } else {
          // Use placeholder image if no webhook is configured
          setTimeout(() => {
            const placeholderImage = getRandomPlaceholderImage()
            addBotMessage(addRandomEmoji("Here's what I drew for you! What else should I create?"), placeholderImage)
            state.isWaitingForResponse = false
          }, 1500)
        }
      }, 2000)
    }, 1000)
  }, 1500)
}

// Call the webhook API
async function callWebhook(message) {
  try {
    const response = await fetch(config.webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(config.apiKey && { Authorization: `Bearer ${config.apiKey}` }),
      },
      body: JSON.stringify({
        message,
        timestamp: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error calling webhook:", error)
    throw error
  }
}

// Get a random placeholder image
function getRandomPlaceholderImage() {
  return config.imagePlaceholders[Math.floor(Math.random() * config.imagePlaceholders.length)]
}

// Scroll chat to bottom
function scrollToBottom() {
  elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight
}

// Update logo display based on settings
function updateLogoDisplay() {
  if (config.showLogo && config.logoPath) {
    // Clear existing content
    elements.logoContainer.innerHTML = ""

    // Create and add the logo image
    const logoImg = document.createElement("img")
    logoImg.src = config.logoPath
    logoImg.alt = "Obsidian Technology"
    logoImg.className = "logo-image"
    elements.logoContainer.appendChild(logoImg)
  } else {
    // Show placeholder
    elements.logoContainer.innerHTML = '<div class="logo-placeholder">Logo</div>'
  }
}

// Initialize the app when the DOM is loaded
document.addEventListener("DOMContentLoaded", init)

// Handle window resize for responsive design
window.addEventListener("resize", () => {
  // Adjust any necessary UI elements on resize
})

// Prevent form submission
document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (e) => e.preventDefault())
})

// To add the Obsidian Technology logo later, set the path here:
// config.logoPath = '/path/to/obsidian-logo.png';
// Then call updateLogoDisplay();

