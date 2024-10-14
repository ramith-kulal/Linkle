import { useState, useEffect, FormEvent } from 'react';
import { io } from 'socket.io-client';
import { FaPaperPlane } from 'react-icons/fa';

// List of funny quotes about chatting safety
const quotes = [
  "Remember, never give out personal info... unless you're trying to impress your cat!",
  "Chatting is like a blind date with a keyboard. Stay safe out there!",
  "Don't share your secrets. They might just end up as the next viral meme!",
  "If you wouldn’t say it in person, don’t say it in a chat. Your keyboard might tell on you!",
  "Chatting is fun, but don’t forget – the internet never forgets your typos!",
  "Think twice before you type. Is it wise, or just your cat walking on the keyboard?",
  "Be careful! That 'cool dude' might be a catfish in disguise!",
  "Safety first! Your password is not your birth date, and your name is not '1234'.",
  "If your mom wouldn't approve, maybe you shouldn't send it in the chat!",
  "A good rule for chatting: if it seems too good to be true, it probably is! Just ask the prince from Nigeria."
];

let socket: any;

interface Message {
  text: string;
  user: 'me' | 'other';
}

function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [connected, setConnected] = useState<boolean>(false);
  const [popup, setPopup] = useState<{ message: string; color: string } | null>(null);
  const [waitingForConnection, setWaitingForConnection] = useState<boolean>(false);
  const [interest, setInterest] = useState<string>(''); // State for selected interest
  const [quote, setQuote] = useState<string>(''); // State for the random quote

  // Function to get a random quote
  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  };

  const ensureSocketConnection = () => {
    if (!socket || !socket.connected) {
      socket = io('https://linkle1.onrender.com');

      socket.on('chatMessage', (message: string) => {
        setMessages((prevMessages) => [...prevMessages, { text: message, user: 'other' }]);
      });

      socket.on('connected', ({ message }) => {
        showPopup(message, 'green', 3000);
        setConnected(true);
        setWaitingForConnection(false);
      });

      socket.on('disconnected', ({ message }) => {
        showPopup(message, 'red', 3000);
        setConnected(false);
        setInput('');
      });
    }
  };

  useEffect(() => {
    ensureSocketConnection();
    getRandomQuote(); // Get a random quote on component mount

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const connectOrDisconnectUser = () => {
    if (!connected) {
      setWaitingForConnection(true);
      showPopup('Waiting for another user to connect...', 'blue');

      ensureSocketConnection();
      setMessages([]) // Clear messages when trying to connect to a new user

      // Emit findNewUser with or without interest
      socket.emit('findNewUser', interest || null);
    } else {
      disconnectUser();
    }
  };

  const disconnectUser = () => {
    if (socket && connected) {
      socket.emit('disconnectUser');
      setConnected(false);
      setInput('');
      showPopup('You have disconnected.', 'red', 3000);
    }
  };

  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input && connected) {
      socket.emit('chatMessage', input);
      setMessages((prevMessages) => [...prevMessages, { text: input, user: 'me' }]);
      setInput('');
    }
  };

  const showPopup = (message: string, color: string, duration?: number) => {
    setPopup({ message, color });

    if (duration) {
      setTimeout(() => setPopup(null), duration);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white md:flex-row">
      {/* Left Section for Quotes */}
      <div className="w-full md:w-1/4 p-5 flex flex-col justify-between">
        <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
          
          <p className="text-sm italic">{quote}</p>
        </div>
        {!connected && (
          <div className="mt-4">
            <label className="block mb-2 text-sm font-semibold">Select Interest (optional):</label>
            <select
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              className="border border-gray-600 rounded-lg p-2 bg-gray-700 text-white w-full"
            >
              <option value="">-- Choose an Interest (optional) --</option>
              <option value="Tech">Tech</option>
              <option value="Sports">Sports</option>
              <option value="Music">Music</option>
              <option value="Travel">Travel</option>
              <option value="Art">Art</option>
            </select>
          </div>
        )}
      </div>

      {/* Right Section for Messages and Input */}
      <div className="flex-1 p-5 flex flex-col">
        <div className="text-center mb-5 text-4xl font-bold">Linkle</div>
        {popup && (
          <div className={`absolute top-5 right-5 p-3 rounded-lg text-white text-lg shadow-lg bg-${popup.color}-600`}>
            {popup.message}
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-4 mb-4 bg-gray-800 rounded-lg shadow-lg">
          {messages.length === 0 ? (
            <p className="text-gray-400 text-center">No messages yet</p>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`mb-2 flex ${msg.user === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs p-3 rounded-lg text-white transition-transform duration-300 ${msg.user === 'me' ? 'bg-gray-600 shadow-md' : 'bg-gray-700 shadow-md'}`}>
                  <span>{msg.text}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={sendMessage} className="flex flex-row mt-4">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!connected || waitingForConnection} // Disable input if not connected
          />
          <button type="submit" className="ml-3 p-3 rounded-lg bg-blue-600 text-white transition duration-300 shadow-lg">
            <FaPaperPlane />
          </button>
        </form>

        <button
          onClick={connectOrDisconnectUser}
          className={`mt-4 p-3 rounded-lg ${connected ? 'bg-red-600' : 'bg-blue-600'} text-white transition duration-300 shadow-lg w-full`}
        >
          {connected ? 'Disconnect' : waitingForConnection ? 'Waiting...' : 'Find a New User'}
        </button>
      </div>
    </div>
  );
}

export default Chat;
