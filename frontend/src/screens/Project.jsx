import React, { useEffect, useState, useContext, useRef } from "react";
import { Button } from "../components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../config/axios";
import { toast } from "sonner";

import {
  initializeSocket,
  receiveMessage,
  sendMessage,
} from "../config/socket";

import { UserContext } from "../context/user.context";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { X, Send, UserPlus, Users } from "lucide-react";

const Project = () => {
  const location = useLocation();
  const { user } = useContext(UserContext);

  const [project, setProject] = useState(null);
  const navigate = useNavigate();

  
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(new Set());

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);

  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [removeUserId, setRemoveUserId] = useState(null);
  const [removeUserEmail, setRemoveUserEmail] = useState("");

 
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messageBox = useRef(null);

  
  const [fileTree, setFileTree] = useState({});
  const [currentFile, setCurrentFile] = useState(null);
  const [openFiles, setOpenFiles] = useState([]);
  const [isPreview, setIsPreview] = useState(true);

 
  const addCollaborator = () => {
    if (!project?._id) return;

    
    const usersToAdd = Array.from(selectedUserId);

    axios
      .put("/projects/addUsers", {
        users: usersToAdd,
        projectId: project._id,
      })
      .then(() => axios.get(`/projects/get-project/${project._id}`))
      .then((res) => {
        setProject(res.data);
        setIsModalOpen(false);
        
        setSelectedUserId(new Set());
        toast.success("Collaborator added successfully");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to add collaborator");
      });
  };

 
  const handleRemoveCollaborator = (userId, email) => {
    setRemoveUserId(userId);
    setRemoveUserEmail(email);
    setShowRemoveDialog(true);
  };

  const confirmRemove = () => {
    if (!project?._id || !removeUserId) return;

    axios.delete(`/projects/${project._id}/remove/${removeUserId}`)
      .then(() => {
        setProject((prev) => ({
          ...prev,
          users: prev.users.filter((u) => u._id !== removeUserId),
        }));
        toast.success(`Removed ${removeUserEmail}`);
        setShowRemoveDialog(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to remove user");
      });
  };

 
  useEffect(() => {
    if (!location.state?.project?._id) return;

    const socket = initializeSocket(location.state.project._id);

    const handler = (msg) => {
      try {
        const parsed = typeof msg === "string" ? JSON.parse(msg) : msg;

        if (
          parsed?.sender?._id !== user._id &&
          parsed?.sender?._id !== "ai"
        ) {
          setMessages((prev) => [...prev, parsed]);
        }

        if (parsed?.type === "ai" && parsed.file) {
          setFileTree((prev) => ({
            ...prev,
            [parsed.file.name]: { content: parsed.file.content },
          }));
        }

        if (parsed.fileTree) setFileTree(parsed.fileTree);
      } catch (err) {
        console.error("Socket parsing error:", err);
      }
    };

    receiveMessage("message", handler);

    receiveMessage("file-updated", (data) => {
      setFileTree((prev) => ({
        ...prev,
        [data.fileName]: { content: data.content },
      }));
      toast.info(`File "${data.fileName}" updated by ${data.updatedBy}`);
    });

    axios.get("/users/all").then((res) => setUsers(res.data.users));

    axios
      .get(`/projects/get-project/${location.state.project._id}`)
      .then((res) => setProject(res.data))
      .catch((err) => {
        console.error("Failed to load project:", err);
      });

    return () => {
      socket.off("message", handler);
      socket.disconnect();
    };
  }, [location.state?.project?._id, user?._id]);

  
  const send = () => {
    if (!message.trim()) return;

    const isAi = message.includes("@ai");

    const payload = {
      message,
      sender: { _id: user._id, email: user.email },
      to: isAi ? "ai" : "user",
    };

    sendMessage("project-message", payload);

    if (!isAi) setMessages((prev) => [...prev, payload]);

    setMessage("");
  };

  useEffect(() => {
    if (messageBox.current) {
      messageBox.current.scrollTop = messageBox.current.scrollHeight;
    }
  }, [messages]);

  
  const handleUserClick = (id) => {
    setSelectedUserId((prev) => {
      const set = new Set(prev);
      if (set.has(id)) set.delete(id);
      else {
        set.add(id);
        toast.success("User selected");
      }
      return set;
    });
  };

  
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchedUsers(users);
      return;
    }

    const timeout = setTimeout(() => {
      axios
        .get(`/users/search?query=${encodeURIComponent(searchQuery)}`)
        .then((res) => setSearchedUsers(res.data.users))
        .catch((err) => console.error("Search users error:", err));
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery, users]);

  
  return (
    <main className="h-screen w-screen flex overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white">
      
      <motion.section
        initial={{ x: -200 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 80 }}
        className="relative flex flex-col h-full w-96 bg-slate-900/70 backdrop-blur-lg border-r border-slate-700"
      >
        
        <header className="flex justify-between items-center p-3 px-4 bg-slate-800/60 border-b border-slate-700">
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-slate-200"
            onClick={() => setIsModalOpen(true)}
          >
            <UserPlus size={18} /> Add Collaborator
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
          >
            <Users />
          </Button>
        </header>

       
        <div className="conversation-area flex-grow flex flex-col relative pt-2 pb-14 overflow-hidden">
          <div
            ref={messageBox}
            className="message-box p-3 flex-grow flex flex-col gap-3 overflow-y-auto"
          >
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${
                  msg.sender._id === "ai"
                    ? "bg-purple-700/40"
                    : "bg-slate-800/60"
                }
                ${
                  msg.sender._id === user._id ? "ml-auto" : "mr-auto"
                }
                max-w-72 message p-3 rounded-2xl border border-slate-700`}
              >
                <small className="opacity-70 text-xs mb-1">
                  {msg.sender.email}
                </small>

                <div className="text-sm">
  <ReactMarkdown
    components={{
      code({ inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || "");

        return !inline && match ? (
          <SyntaxHighlighter
            style={oneDark}
            language={match[1]}
            PreTag="div"
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        ) : (
          <code className="bg-slate-700 px-1 py-0.5 rounded">
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

          
          <div className="inputField w-full flex absolute bottom-0 bg-slate-800/80 border-t border-slate-700">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="p-3 px-4 flex-grow bg-transparent text-white outline-none"
              placeholder="Type a message..."
            />
            <Button onClick={send} size="icon" className="m-2 rounded-full">
              <Send />
            </Button>
          </div>
        </div>

        
        <AnimatePresence>
          {isSidePanelOpen && (
            <motion.div
              initial={{ x: -400 }}
              animate={{ x: 0 }}
              exit={{ x: -400 }}
              className="absolute inset-0 bg-slate-900/95 border-r border-slate-700"
            >
              <header className="flex justify-between p-3 border-b border-slate-700">
                <h1 className="font-semibold">Collaborators</h1>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidePanelOpen(false)}
                >
                  <X />
                </Button>
              </header>

              <div className="users flex flex-col gap-2 p-3">
                {project?.users?.map((collab) => (
                  <Card
                    key={collab._id}
                    className="bg-slate-800/60 hover:bg-slate-700 border border-slate-700"
                  >
                    <CardContent className="flex justify-between items-center p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                          <i className="ri-user-fill text-white"></i>
                        </div>
                        <span className="text-white">{collab.email}</span>
                      </div>

                      
                      {String(project?.owner) === String(user?._id) && (
                        <button
                          onClick={() =>
                            handleRemoveCollaborator(collab._id, collab.email)
                          }
                          className="text-red-400 hover:text-red-200"
                        >
                          <i className="ri-delete-bin-6-line text-lg"></i>
                        </button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      
<section className="right bg-slate-900/50 flex-grow flex flex-col">

  
  <div className="w-full flex justify-end p-3 border-b border-slate-700 bg-slate-800/60">
    <Button variant="ghost" className="text-white" onClick={() => navigate(-1)}>
      Back
    </Button>
  </div>

  
  <div className="flex flex-grow overflow-hidden">

    
    <div className="explorer w-48 bg-slate-800/60 border-r border-slate-700 p-2 overflow-y-auto">
      {Object.keys(fileTree).map((fileName, i) => (
        <Button
          key={i}
          variant="ghost"
          className="w-full text-left text-blue-400 hover:bg-slate-700"
          onClick={() => {
            if (!openFiles.includes(fileName)) {
              setOpenFiles((prev) => [...prev, fileName]);
            }
            setCurrentFile(fileName);
          }}
        >
          {fileName}
        </Button>
      ))}
    </div>

    
    {currentFile && (
      <div className="editor flex-grow relative overflow-hidden">

        
        <div className="flex bg-slate-800/80 border-b border-slate-700 p-2 gap-2 overflow-x-auto">
          {openFiles.map((file) => (
            <Button
              key={file}
              variant="ghost"
              className={`px-4 ${file === currentFile ? "bg-slate-700" : ""}`}
              onClick={() => setCurrentFile(file)}
            >
              {file}
            </Button>
          ))}
        </div>

        
        <div className="relative h-full overflow-auto">

         
          <div className="absolute right-5 top-3 flex gap-2 z-10">
            <Button
              size="sm"
              variant="ghost"
              className="bg-slate-700"
              onClick={() => setIsPreview((p) => !p)}
            >
              {isPreview ? "Edit" : "Preview"}
            </Button>

            <Button
              size="sm"
              className="bg-blue-600"
              onClick={() => {
                sendMessage("file-update", {
                  fileName: currentFile,
                  content: fileTree[currentFile].content,
                });
                toast.success("File saved!");
              }}
            >
              Save
            </Button>
          </div>

          
          {(() => {
            const content = fileTree[currentFile]?.content ?? "";
            const ext = currentFile.split(".").pop();

            const isCode =
              /\n/.test(content) || /function|const|import|class/.test(content);

            if (isPreview && isCode) {
              return (
                <SyntaxHighlighter
                  language={ext}
                  style={oneDark}
                  customStyle={{
                    height: "100%",
                    background: "transparent",
                    fontSize: "14px",
                    margin: 0,
                  }}
                >
                  {content}
                </SyntaxHighlighter>
              );
            }

            return (
              <textarea
                value={content}
                onChange={(e) =>
                  setFileTree((prev) => ({
                    ...prev,
                    [currentFile]: { content: e.target.value },
                  }))
                }
                className="w-full h-full bg-slate-900 text-white p-4 outline-none resize-none font-mono"
              />
            );
          })()}

        </div>
      </div>
    )}

  </div>
</section>


      
      <AnimatePresence>
        {showRemoveDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              className="bg-slate-900 p-6 rounded-xl border border-slate-700 w-96"
            >
              <h3 className="text-xl font-bold mb-4">Remove Collaborator</h3>
              <p className="text-gray-300 mb-6">
                Remove <span className="text-white">{removeUserEmail}</span>?
              </p>

              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setShowRemoveDialog(false)}>
                  Cancel
                </Button>
                <Button className="bg-red-600" onClick={confirmRemove}>
                  Remove
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              className="bg-slate-900 p-6 rounded-xl border border-slate-700 w-96 max-h-[80vh] overflow-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Select User</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                  <X />
                </Button>
              </div>

              <input
                type="text"
                value={searchQuery}
                placeholder="Search users..."
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 mb-4 bg-slate-800 border border-slate-600 rounded-lg outline-none"
              />

              
              {(searchedUsers || [])
                .filter(
                  (usr) =>
                    !((project?.users || []).some((u) => String(u._id) === String(usr._id)))
                )
                .map((usr) => (
                  <Card
                    key={usr._id}
                    onClick={() => handleUserClick(usr._id)}
                    className={`cursor-pointer mb-2 ${
                      selectedUserId.has(usr._id)
                        ? "bg-slate-700 border-slate-500"
                        : "bg-slate-800 border-slate-700 hover:bg-slate-700"
                    }`}
                  >
                    <CardContent className="flex items-center gap-4 p-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center">
                        <i className="ri-user-fill text-white"></i>
                      </div>
                      <span>{usr.email}</span>
                    </CardContent>
                  </Card>
                ))}

              <Button onClick={addCollaborator} className="w-full bg-blue-600 mt-4">
                Add
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Project;
