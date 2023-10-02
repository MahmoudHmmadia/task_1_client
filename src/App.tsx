import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3500/");
type Message = {
  message: string;
  id: string;
  type: string;
};
function App() {
  socket.on("connect", () => {});
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const [error, setError] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [myMessages, setMyMessages] = useState<Message[]>([]);
  const [all, setAll] = useState<Message[]>([]);
  function sendMessage() {
    if (messageRef.current?.value) {
      setError(false);
      socket.emit("send_message", messageRef.current?.value);
      setMyMessages([
        ...myMessages,
        {
          message: messageRef.current.value,
          id: new Date().toISOString(),
          type: "my",
        },
      ]);
      setAll([
        ...all,
        {
          message: messageRef.current.value,
          id: new Date().toISOString(),
          type: "my",
        },
      ]);
      messageRef.current.value = "";
    } else {
      setError(true);
    }
  }
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages([
        ...messages,
        { message: data.message, id: data.id, type: "" },
      ]);

      setAll([...all, { message: data.message, id: data.id, type: "" }]);
    });
  }, [socket, messages, myMessages]);
  return (
    <div className="app flex flex-col gap-6 lg:w-4/12 md:w-7/12 w-9/12 m-auto min-h-screen justify-center items-center">
      <h1 className="text-4xl font-bold text-sky-500 uppercase text-center">
        Real Time Messages App
      </h1>
      <div className="messages p-4 w-full border flex flex-col gap-1 h-80 overflow-y-scroll">
        {all.map(({ message, id, type }) => (
          <h1
            key={id}
            className={`p-1  ${
              type === "my" ? "bg-sky-200 text-black" : "bg-sky-500 text-white"
            }`}
          >
            {message}
          </h1>
        ))}
        {all.length === 0 && (
          <h1 className="text-gray-300">There Is No Messages Yet</h1>
        )}
      </div>

      <textarea
        ref={messageRef}
        placeholder="Message ..."
        className="border border-gray-300 px-4 w-full min-h-[50px] overflow-y-scroll py-2 outline-none min-w-[200px] resize-none"
      />
      {error && (
        <h1 className="text-rose-800 font-bold">MESSAGE ARE REQUIRED</h1>
      )}
      <button
        onClick={sendMessage}
        className="bg-sky-500 text-white px-4 py-2 tracking-wide hover:scale-95 transition w-full"
      >
        SEND
      </button>
    </div>
  );
}

export default App;
