import React, { useEffect, useState ,useContext} from "react";
import { Button } from "../components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../config/axios";
import { toast } from "sonner";
import {initializeSocket , receiveMessage,sendMessage} from "../config/socket.js"; 
import { UserContext } from "../context/user.context.jsx";
import Markdown from "markdown-to-jsx"


const Project = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(new Set());
  const [project, setProject] = useState(null); 
  const [messages, setMessages] = useState('');
  const user = useContext(UserContext);
  const messageBox = React.createRef();

  // Add collaborator
  const addCollaborator = () => {
    if (!project?._id) return;

    axios
      .put("/projects/addUsers", {
        users: Array.from(selectedUserId), 
        projectId: project._id,
      })
      .then((res) => {
        console.log(res.data);
        setProject(res.data); 
        setIsModalOpen(false);
        toast.success("Collaborator added successfully");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  
  useEffect(() => {

    if (!location.state?.project?._id) return;

  const socket = initializeSocket(location.state.project._id);

   const handler = (msg) => {
    console.log("📩 Incoming msg:", msg);
    if (msg?.sender?._id !== user._id) {
      appendIncomingMessage(msg);
    }
  };

  receiveMessage("message", handler);

 

  axios
    .get("/users/all")
    .then((res) => setUsers(res.data.users))
      .catch((err) => console.error(err));

    if (location.state?.project?._id) {
      axios
        .get(`/projects/get-project/${location.state.project._id}`)
        .then((res) => {
          console.log("Fetched project:", res.data);
          setProject(res.data);
        })
        .catch((err) => console.error(err));
    }
    return () => {
    socket.off("message", handler); // 👈 important
    socket.disconnect();
    console.log("🔌 Socket disconnected on unmount");
  };


  }, [location.state?.project?._id]);

  // Select collaborator
  const handleUserClick = (userId) => {
    setSelectedUserId((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(userId)) {
        newSelected.delete(userId);
      } else {
        newSelected.add(userId);
        toast.success("User selected");
      }
      return newSelected;
    });
  };

 function appendIncomingMessage(msg) {
  const messageBox = document.querySelector(".message-box");
  if (!messageBox) return;

  const senderEmail = msg?.sender?.email || "Unknown";
  const messageText = msg?.message || "";

  const messageElement = document.createElement("div");
  messageElement.className =
    "message flex flex-col gap-1 p-2 m-3 bg-white/10 rounded-lg max-w-xs break-words mr-auto";

    if (msg.sender._id === "ai-bot") {
      const markDown = (<Markdown>{messageText}</Markdown>);
      messageElement.innerHTML = `<small class="opacity-65 text-xs">${senderEmail}</small>
      <p class="text-sm">${markDown}</p>`;
    }

  messageElement.innerHTML = `
    <small class="opacity-65 text-xs">${senderEmail}</small>
    <p class="text-sm">${messageText}</p>
  `;

  messageBox.appendChild(messageElement);
  scrollToBottom();
}



function appendOutgoingMessage(msg) {
  const messageBox = document.querySelector(".message-box");
  if (!messageBox) return;

  const senderEmail = msg?.sender?.email || "You";
  const messageText = msg?.message || "";

  const messageElement = document.createElement("div");
  messageElement.className =
    "ml-auto message flex flex-col gap-1 p-2 m-3 bg-white/10 rounded-lg max-w-xs break-words";

  messageElement.innerHTML = `
    <small class="opacity-65 text-xs">${senderEmail}</small>
    <p class="text-sm">${messageText}</p>
  `;

  messageBox.appendChild(messageElement);
  scrollToBottom();
}


  function send() {
  if (!messages.trim()) return;

  const payload = {
    message: messages,
    sender: { _id: user._id, email: user.email },
  };

  sendMessage("project-message", payload);
  appendOutgoingMessage(payload);
  setMessages('');
}

function scrollToBottom() {
  const messageBox = document.querySelector(".message-box");
  if (!messageBox) return;

  messageBox.scrollTop = messageBox.scrollHeight;
}





  return (
    <main className="h-screen w-screen flex overflow-hidden">
      <section className="left relative flex flex-col h-screen min-w-85 bg-slate-300">
        {/* Header */}
        <header className="flex justify-between items-center p-2 px-4 w-full bg-slate-100 absolute z-10 top-0">
          <button className="flex gap-2" onClick={() => setIsModalOpen(true)}>
            <i className="ri-add-fill mr-1"></i>
            <p>Add collaborator</p>
          </button>
           
          <button
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            className="p-2"
          >
            <i className="ri-group-fill"></i>
          </button>
        </header>

        
        <div className="conversation-area pt-14 pb-10 flex-grow flex flex-col h-full relative">
          <div ref={messageBox} className="message-box flex-grow flex flex-col overflow-auto ">
            
           
          </div>
          
          <div className="inputField w-full flex absolute bottom-0">
            <input
              value={messages}
              onChange={(e) => setMessages(e.target.value)}
              className="p-2 px-4 border-none outline-none flex-grow"
              type="text"
              placeholder="Enter message"
            />
            <button onClick={send} className="px-5 bg-slate-950 text-white">
              <i className="ri-send-plane-fill"></i>
            </button>
          </div>
        </div>

        
        <div
          className={`side-panel w-full h-full bg-red-500 absolute right-86 top-20 transition-all ${
            isSidePanelOpen ? "translate-x-full" : ""
          }`}
        >
          <header className="flex justify-between items-center px-4 p-2 bg-slate-200">
            <h1 className="font-semibold text-lg ml-3">Collaborators</h1>
            <button
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
              className="p-2"
            >
              <i className="ri-close-fill"></i>
            </button>
          </header>

          <div className="user flex flex-col gap-2 mt-2">
            {project?.users?.map((collaborator) => (
              <div
                key={collaborator._id}
                className="user flex items-center gap-4 p-2 cursor-pointer hover:bg-slate-500"
              >
                <div className="aspect-square w-10 h-10 bg-slate-600 text-white rounded-full flex items-center justify-center">
                  <i className="ri-user-fill"></i>
                </div>
                <h1 className="font-semibold text-lg">
                  {collaborator.email}
                </h1>
              </div>
            ))}
          </div>
        </div>
      </section>

      <h1 className="absolute left-1/2 transform -translate-x-1/2 font-semibold text-lg">
    {project?.name || "Project"}
  </h1>

      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md w-96 max-w-full relative">
            <header className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Select User</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2">
                <i className="ri-close-fill"></i>
              </button>
            </header>
            <div className="users-list flex flex-col gap-2 mb-16 max-h-80 overflow-auto">
              {users.map((user) => (
                <div
                  key={user._id}
                  className={`user cursor-pointer hover:bg-slate-200 ${
                    selectedUserId.has(user._id) ? "bg-slate-200" : ""
                  } p-2 flex gap-2 items-center`}
                  onClick={() => handleUserClick(user._id)}
                >
                  <div className="aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600">
                    <i className="ri-user-fill absolute"></i>
                  </div>
                  <h1 className="font-semibold text-lg">{user.email}</h1>
                </div>
              ))}
            </div>

            <Button
              onClick={addCollaborator}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Add Collaborators
            </Button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Project;
