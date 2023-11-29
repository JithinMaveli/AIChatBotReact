import { useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [prompt, updatePrompt] = useState(undefined);

  const chat = async (e, message) => {
    e.preventDefault();

    if (!message) return;
    setIsTyping(true);

    let msgs = chats;
    msgs.push({ role: "User", content: message });
    setChats(msgs);

    setMessage("");

    fetch("http://localhost:1337/", {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content: message
        })
    }).then((response) => response.json())
        .then((data) => {
            // console.log("inside then response :" + data.output);
            // msg = data.output;
            msgs.push({ role: "Assistant", content: data.output });
            setChats(msgs);
            setIsTyping(false);
        }).catch((error) => {
          console.log(error);
        })

    // alert(message);
  };

  const sendPrompt = async (event) => {
    alert(event.key);
    if (event.key !== "Enter") {
      return;
    }

    try {
      setLoading(true);

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      };

      const res = await fetch("http://localhost:3000/ask", requestOptions);

      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      const { message } = await res.json();
      setAnswer(message);
    } catch (err) {
      console.error(err, "err");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1>Artificial Intelligence: Assignment</h1>
      <h2>Custom ChatBot using ChatGPT APIs</h2>
      <h3>Student Details:</h3>
      <h3>ID: 2022MT12292</h3>
      <h3>Name: Jithin M P</h3>
      <section>
        {chats && chats.length
          ? chats.map((chat, index) => (
              <p key={index} className={chat.role === "user" ? "user_msg" : ""}>
                <span>
                  <b>{chat.role}</b>
                </span>
                <span>:</span>
                <span>{chat.content}</span>
              </p>
            ))
          : ""}
      </section>

      <div className={isTyping ? "" : "hide"}>
        <p>
          <i>{isTyping ? "..." : ""}</i>
        </p>
      </div>
      {/* <form action="" onSubmit={(e) => chat(e, message)}>
        <input
          type="text"
          name="message"
          value={message}
          placeholder="Type a message here and hit Enter..."
          onChange={(e) => setMessage(e.target.value)}
        />
      </form> */}
      <form action="" onSubmit={(e) => sendPrompt(e, message)}>
        <input
          type="text"
          name="message"
          value={message}
          placeholder="Type a message here and hit Enter..."
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
    </main>
  );
}
export default App;