import React, { useEffect, useState, useContext, useRef } from "react";
import { Button } from "../components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../config/axios";
import { toast } from "sonner";
import {
  initializeSocket,
  receiveMessage,
  sendMessage,
} from "../config/socket.js";
import { UserContext } from "../context/user.context.jsx";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { X, Send, UserPlus, Users } from "lucide-react";

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

  const [fileTree, setFileTree] = useState({
    "app.js": {
      content: `const express = require('express');`,
    },
    "package.json": {
      content: `{
        "name": "temp-server",
      }`,
    },
  });

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
    <main className="h-screen w-screen flex overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white">
      {/* LEFT PANEL */}
      <motion.section
        initial={{ x: -200 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 80 }}
        className="relative flex flex-col h-full w-96 bg-slate-900/70 backdrop-blur-lg border-r border-slate-700"
      >
        <header className="flex justify-between items-center p-3 px-4 w-full bg-slate-800/60 backdrop-blur-lg sticky top-0 z-20 border-b border-slate-700">
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-slate-200 hover:text-white"
            onClick={() => setIsModalOpen(true)}
          >
            <UserPlus size={18} /> <span>Add collaborator</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
          >
            <Users />
          </Button>
        </header>

        {/* Conversation */}
        <div className="conversation-area flex-grow flex flex-col relative pt-2 pb-14 overflow-hidden">
          <div
            ref={messageBox}
            className="message-box p-3 flex-grow flex flex-col gap-3 overflow-y-auto max-h-full 
               [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`${
                  msg.sender._id === "ai"
                    ? "max-w-96 bg-purple-700/40"
                    : "max-w-72 bg-slate-800/60"
                } ${
                  msg.sender._id === user?._id?.toString()
                    ? "ml-auto"
                    : "mr-auto"
                } message flex flex-col p-3 rounded-2xl border border-slate-700 shadow-md`}
              >
                <small className="opacity-70 text-xs mb-1">
                  {msg.sender.email || "You"}
                </small>

                <div className="text-sm prose prose-invert">
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
                          <code className="px-1 py-0.5 bg-slate-700 rounded text-pink-300">
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {msg.message}
                  </ReactMarkdown>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input */}
          <div className="inputField w-full flex absolute bottom-0 z-20 bg-slate-800/80 backdrop-blur-lg border-t border-slate-700">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="p-3 px-4 border-none outline-none flex-grow bg-transparent text-white placeholder:text-slate-400"
              type="text"
              placeholder="Type a futuristic message..."
            />
            <Button onClick={send} size="icon" className="m-2 rounded-full">
              <Send />
            </Button>
          </div>
        </div>

        {/* Collaborator Panel */}
        <AnimatePresence>
          {isSidePanelOpen && (
            <motion.div
              initial={{ x: -400 }}
              animate={{ x: 0 }}
              exit={{ x: -400 }}
              transition={{ type: "spring", stiffness: 80 }}
              className="absolute inset-0 flex flex-col bg-slate-900/95 backdrop-blur-lg border-r border-slate-700 z-30"
            >
              <header className="flex justify-between items-center px-4 p-3 border-b border-slate-700">
                <h1 className="font-semibold text-lg">Collaborators</h1>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidePanelOpen(false)}
                >
                  <X />
                </Button>
              </header>
              <div className="users flex flex-col gap-2 p-3">
                {project?.users?.map((collaborator) => (
                  <Card
                    key={collaborator._id}
                    className="cursor-pointer bg-slate-800/60 hover:bg-slate-700 transition-all border border-slate-700"
                  >
                    <CardContent className="flex items-center gap-4 p-3">
                      <div className="aspect-square w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 text-white rounded-full flex items-center justify-center">
                        <i className="ri-user-fill"></i>
                      </div>
                      <h1 className="font-medium">{collaborator.email}</h1>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* RIGHT PANEL */}
      <section className="right bg-slate-900/50 backdrop-blur-lg flex-grow h-full flex overflow-hidden">
        <div className="explorer h-full w-44 bg-slate-800/60 border-r border-slate-700">
          <div className="file-tree w-full p-2 flex flex-col gap-1">
            {Object.keys(fileTree).map((fileName, key) => (
              <Button
                key={key}
                onClick={() => {
                  setOpenFiles((prev) =>
                    prev.includes(fileName) ? prev : [...prev, fileName]
                  );
                  setCurrentFile(fileName);
                }}
                variant="ghost"
                className="tree-element cursor-pointer p-2 flex items-center gap-2 text-blue-400 hover:bg-slate-700 rounded-lg transition-all"
              >
                <p className="font-medium text-sm">{fileName}</p>
              </Button>
            ))}
          </div>
        </div>

        {currentFile && (
          <div className="code-editor flex-grow flex flex-col overflow-hidden">
            <div className="top p-2 flex bg-slate-800/80 border-b border-slate-700 overflow-x-auto">
              {openFiles.map((file) => (
                <Button
                  key={file}
                  onClick={() => setCurrentFile(file)}
                  variant="ghost"
                  className={`open-file cursor-pointer p-2 px-4 flex items-center w-fit gap-2 rounded-lg ${
                    currentFile === file
                      ? "bg-slate-700 text-white"
                      : "text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <p className="font-medium text-sm">{file}</p>
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
                className="w-full h-full p-3 font-mono text-sm border-none outline-none resize-none bg-slate-900 text-slate-100"
              />
            </div>
          </div>
        )}
      </section>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-slate-900 text-white p-6 rounded-2xl w-96 max-w-full border border-slate-700 shadow-2xl"
            >
              <header className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Select User</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsModalOpen(false)}
                >
                  <X />
                </Button>
              </header>
              <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
                {users.map((usr) => (
                  <Card
                    key={usr._id}
                    onClick={() => handleUserClick(usr._id)}
                    className={`cursor-pointer transition-all ${
                      Array.from(selectedUserId).includes(usr._id)
                        ? "bg-slate-700 border-slate-500"
                        : "bg-slate-800/60 hover:bg-slate-700 border-slate-700"
                    }`}
                  >
                    <CardContent className="flex items-center gap-4 p-3">
                      <div className="aspect-square w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600 text-white">
                        <i className="ri-user-fill"></i>
                      </div>
                      <h1 className="font-medium">{usr.email}</h1>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button
                onClick={addCollaborator}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              >
                Add Collaborator
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Project;
