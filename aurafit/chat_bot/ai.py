from flask import Flask, request, jsonify, render_template_string
import google.generativeai as genai

# Configure Gemini API
GOOGLE_API_KEY = "AIzaSyCUCSQlJl2-HvQ5rJ8Q53j-_4O78md-vgg"
genai.configure(api_key=GOOGLE_API_KEY)

# Initialize the model
model = genai.GenerativeModel('gemini-2.0-flash')
chat = model.start_chat(history=[])

# Flask app setup
app = Flask(__name__)

# HTML + CSS + JS (rendered from string)
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Rafi Sk</title>
  <style>
    body {
      margin: 0;
      font-family: 'Segoe UI', sans-serif;
      overflow: hidden;
      background: radial-gradient(circle at top, #1e3c72, #2a5298);
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      position: relative;
    }

    /* Background animation */
    body::before {
      content: "";
      position: absolute;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, #ffffff10 1px, transparent 1px);
      background-size: 50px 50px;
      animation: floatGrid 40s linear infinite;
      z-index: 0;
    }

    @keyframes floatGrid {
      0% { transform: translate(0, 0); }
      100% { transform: translate(-25px, -25px); }
    }

    .chat-container {
      position: relative;
      z-index: 1;
      background: rgba(255, 255, 255, 0.07);
      padding: 25px;
      border-radius: 20px;
      width: 420px;
      box-shadow: 0 0 30px rgba(0,0,0,0.4);
      animation: slideIn 1s ease-out;
    }

    @keyframes slideIn {
      from {
        transform: scale(0.8);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }

    h2 {
      text-align: center;
      font-size: 24px;
      margin-bottom: 15px;
      color: #fff;
      text-shadow: 0 0 10px #00e5ff;
      animation: glowTitle 2s infinite alternate;
    }

    @keyframes glowTitle {
      from { text-shadow: 0 0 5px #00e5ff; }
      to { text-shadow: 0 0 15px #00e5ff, 0 0 25px #00e5ff; }
    }

    .chat-box {
      height: 400px;
      overflow-y: auto;
      padding: 12px;
      border: 1px solid #ffffff30;
      border-radius: 10px;
      background: #ffffff0f;
      margin-bottom: 12px;
      backdrop-filter: blur(4px);
    }

    .user, .bot {
      margin-bottom: 14px;
      opacity: 0;
      animation: fadeIn 0.5s forwards;
    }

    .user {
      text-align: right;
      color: #9be7ff;
      transform: translateX(20px);
    }

    .bot {
      text-align: left;
      color: #ffcdd2;
      transform: translateX(-20px);
    }

    @keyframes fadeIn {
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    #chat-form {
      display: flex;
      gap: 10px;
      animation: bounceIn 0.8s ease-in;
    }

    @keyframes bounceIn {
      0% { transform: scale(0.9); }
      50% { transform: scale(1.02); }
      100% { transform: scale(1); }
    }

    #user-input {
      flex: 1;
      padding: 12px;
      border-radius: 10px;
      border: none;
      outline: none;
      font-size: 15px;
      transition: box-shadow 0.3s;
    }

    #user-input:focus {
      box-shadow: 0 0 8px #00e5ff;
    }

    button {
      background: linear-gradient(45deg, #00bcd4, #1de9b6);
      color: white;
      border: none;
      padding: 12px 18px;
      border-radius: 10px;
      cursor: pointer;
      transition: transform 0.3s, box-shadow 0.3s;
      animation: pulse 1.5s infinite;
    }

    button:hover {
      transform: scale(1.1);
      box-shadow: 0 0 15px #1de9b6;
    }

    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(0, 188, 212, 0.7); }
      70% { box-shadow: 0 0 0 12px rgba(0, 188, 212, 0); }
      100% { box-shadow: 0 0 0 0 rgba(0, 188, 212, 0); }
    }

    .typing {
      display: inline-block;
      border-right: 2px solid;
      white-space: nowrap;
      overflow: hidden;
      animation: typing 2s steps(30, end), blink 0.75s step-end infinite;
    }

    @keyframes typing {
      from { width: 0; }
      to { width: 100%; }
    }

    @keyframes blink {
      50% { border-color: transparent; }
    }
  </style>
</head>
<body>
  <div class="chat-container">
    <h2>💬 Rafi AI Chatbot</h2>
    <div id="chat-box" class="chat-box"></div>
    <form id="chat-form">
      <input type="text" id="user-input" placeholder="Type your message..." required />
      <button type="submit">Send</button>
    </form>
  </div>

  <script>
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');

    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const message = userInput.value.trim();
      if (!message) return;

      appendMessage('You', message, 'user');
      userInput.value = '';

      appendTyping();

      const response = await fetch('/send_message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      const data = await response.json();
      removeTyping();
      appendMessage('Rafi', data.response, 'bot');
    });

    function appendMessage(sender, text, cls) {
      const msg = document.createElement('div');
      msg.classList.add(cls);
      msg.innerText = `${sender}: ${text}`;
      chatBox.appendChild(msg);
      chatBox.scrollTop = chatBox.scrollHeight;
    }

    function appendTyping() {
      const typing = document.createElement('div');
      typing.classList.add('bot');
      typing.id = 'typing';
      typing.innerHTML = `<span class="typing">Rafi is thinking your query...</span>`;
      chatBox.appendChild(typing);
      chatBox.scrollTop = chatBox.scrollHeight;
    }

    function removeTyping() {
      const typing = document.getElementById('typing');
      if (typing) typing.remove();
    }
  </script>
</body>
</html>
"""


@app.route('/')
def index():
    return render_template_string(HTML_TEMPLATE)

@app.route('/send_message', methods=['POST'])
def send_message():
    user_input = request.json['message']
    try:
        response = chat.send_message(user_input)
        return jsonify({'response': response.text})
    except Exception as e:
        return jsonify({'response': f"Error: {str(e)}"})

if __name__ == '__main__':
    app.run(debug=True)
