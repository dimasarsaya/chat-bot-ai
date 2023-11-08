const chatInput = document.querySelector(".chat-input textarea");
const sendChtBtn = document.querySelector(".chat-input span");
const chatBox = document.querySelector(".chatbox");
const chatBotToggler = document.querySelector(".chatbot-toggler");
const chatBotCloseBtn = document.querySelector(".close-btn");

// api openai
const API_KEY = "OPEN AI API";

const inputInitheight = chatInput.scrollHeight;
let userMessage;

const createChatLi = (message, className) => {
    // Create a chat <li> element with the message and class name
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : 
    `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user",content: userMessage}]
        })
    }

    // Send POST request to API, to get respone
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content;
    }).catch((error) => {
        messageElement.textContent ="OOPSS!! something wrong try again";
    }).finally(() => chatBox.scrollTo(0, chatBox.scrollHeight));
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value = "";
    chatInput.style.height = `${inputInitheight}px`;

    // Append the user message to the chatbox
    chatBox.appendChild(createChatLi(userMessage, "outgoing"));
    chatBox.scrollTo(0, chatBox.scrollHeight);

    setTimeout (() => {
        // Display "Typing" message waiting for the bot respone
        const incomingChatLi = createChatLi("Typing...", "incoming")
        chatBox.appendChild(incomingChatLi);
        chatBox.scrollTo(0, chatBox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

chatInput.addEventListener("input", ()=> {
    // Adjust height of chatbox based on input
    chatInput.style.height = `${inputInitheight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
})

chatInput.addEventListener("keydown", (e)=> {
    // Enter key pressed
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

chatBotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
chatBotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
sendChtBtn.addEventListener("click", handleChat);
