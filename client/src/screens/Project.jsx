import React, { useEffect, useState, useContext, useRef } from "react";
import { Button } from "../components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../config/axios";
import { toast } from "sonner";
import { initializeSocket, receiveMessage, sendMessage } from "../config/socket.js";
import { UserContext } from "../context/user.context.jsx";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const Project = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(new Set());
  const [project, setProject] = useState(null);
  const [message, setMessage] = useState("");
  const { user } = useContext(UserContext);
  const messageBox = useRef(null);
  const [messages, setMessages] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [openFiles, setOpenFiles] = useState([]);

  const [fileTree, setFileTree] = useState({});

  const addCollaborator = () => {
    if (!project?._id) return;

    axios
      .put("/projects/addUsers", {
        users: Array.from(selectedUserId),
        projectId: project._id,
      })
      .then((res) => {
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
      try {
        const message = typeof msg === "string" ? JSON.parse(msg) : msg;
        console.log("📨 New message:", message);
        if (message?.sender?._id !== user._id) {
          setMessages((prev) => [...prev, message]);
        }

        if (message.fileTree) {
          setFileTree(message.fileTree);
        }
      } catch (err) {
        console.error("Invalid message received:", msg, err);
      }
    };

    receiveMessage("message", handler);
    console.log("Socket handler registered");

    axios
      .get("/users/all")
      .then((res) => setUsers(res.data.users))
      .catch((err) => console.error(err));

    if (location.state?.project?._id) {
      axios
        .get(`/projects/get-project/${location.state.project._id}`)
        .then((res) => {
          setProject(res.data);
        })
        .catch((err) => console.error(err));
    }

    return () => {
      socket.off("message", handler);
      socket.disconnect();
    };
  }, [location.state?.project?._id]);

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

  function send() {
    if (!message.trim()) return;

    const payload = {
      message: message,
      sender: { _id: user._id, email: user.email },
    };

    sendMessage("project-message", payload);
    setMessages((prev) => [...prev, payload]);
    setMessage("");
  }

  function scrollToBottom() {
    if (messageBox.current) {
      messageBox.current.scrollTop = messageBox.current.scrollHeight;
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <main className="h-screen w-screen flex overflow-hidden">
      <section className="left relative flex flex-col h-full w-96 bg-slate-300 overflow-hidden">
        <header className="flex justify-between items-center p-2 px-4 w-full bg-slate-100 sticky top-0 z-20">
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

        <div className="conversation-area flex-grow flex flex-col relative pt-2 pb-14 overflow-hidden">
          <div
            ref={messageBox}
            className="message-box p-1 flex-grow flex flex-col gap-1 overflow-y-auto max-h-full scrollbar-hide"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${
                  msg.sender._id === "ai" ? "max-w-80" : "max-w-52"
                } ${
                  msg.sender._id === user?._id?.toString() ? "ml-auto" : ""
                } message flex flex-col p-2 bg-slate-50 w-fit rounded-md`}
              >
                <small className="opacity-65 text-xs">
                  {msg.sender.email || "You"}
                </small>

                <div className="text-sm prose">
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {msg.message}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
          </div>

          <div className="inputField w-full flex absolute bottom-0 z-20 bg-white">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="p-2 px-4 border-none outline-none flex-grow"
              type="text"
              placeholder="Enter message"
            />
            <button
              onClick={send}
              className="px-5 bg-slate-950 text-white"
            >
              <i className="ri-send-plane-fill"></i>
            </button>
          </div>
        </div>

        <div
          className={`sidePanel w-full h-full flex flex-col gap-2 bg-slate-50 absolute transition-all z-30 ${
            isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
          } top-0`}
        >
          <header className="flex justify-between items-center px-4 p-2 bg-slate-200">
            <h1 className="font-semibold text-lg">Collaborators</h1>
            <button
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
              className="p-2"
            >
              <i className="ri-close-fill"></i>
            </button>
          </header>
          <div className="users flex flex-col gap-2">
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

      <section className="right bg-red-50 flex-grow h-full flex overflow-hidden">
        <div className="explorer h-full w-36 bg-slate-200">
          <div className="file-tree w-full">
            {Object.keys(fileTree).map((fileName, key) => (
              <Button
                key={key}
                onClick={() => {
                  setOpenFiles((prev) =>
                    prev.includes(fileName) ? prev : [...prev, fileName]
                  );
                  setCurrentFile(fileName);
                }}
                className="tree-element cursor-pointer p-2 flex items-center gap-2 text-blue-600 bg-slate-300 w-full"
              >
                <p className="font-semibold text-sm">{fileName}</p>
              </Button>
            ))}
          </div>
        </div>

        {currentFile && (
          <div className="code-editor flex-grow flex flex-col overflow-hidden">
            <div className="top p-2 flex bg-slate-100 border-b overflow-x-auto">
              {openFiles.map((file) => (
                <Button
                  key={file}
                  onClick={() => setCurrentFile(file)}
                  className={`open-file cursor-pointer p-2 px-4 flex items-center w-fit gap-2 ${
                    currentFile === file ? "bg-slate-400" : "bg-slate-300"
                  }`}
                >
                  <p className="font-semibold text-sm">{file}</p>
                </Button>
              ))}
            </div>

            <div className="bottom flex-grow overflow-hidden">
              <textarea
                value={fileTree[currentFile]?.content || ""}
                onChange={(e) =>
                  setFileTree({
                    ...fileTree,
                    [currentFile]: {
                      ...fileTree[currentFile],
                      content: e.target.value,
                    },
                  })
                }
                className="w-full h-full p-2 font-mono text-sm border-none outline-none resize-none"
              />
            </div>
          </div>
        )}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md w-96 max-w-full relative">
            <header className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Select User</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2">
                <i className="ri-close-fill"></i>
              </button>
            </header>
            <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
              {users.map((user) => (
                <div
                  key={user._id}
                  className={`user cursor-pointer hover:bg-slate-200 ${
                    Array.from(selectedUserId).indexOf(user._id) != -1
                      ? "bg-slate-200"
                      : ""
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
            <button
              onClick={addCollaborator}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Add Collaborator
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Project;
