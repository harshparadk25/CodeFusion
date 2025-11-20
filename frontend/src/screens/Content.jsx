import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../config/axios";
import { toast } from "sonner";

const Content = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialContent = location.state?.content || "No content available.";
  const filename = location.state?.filename || "Unnamed File";

  const [content, setContent] = React.useState(initialContent);
  const [isEditable, setIsEditable] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  
  const [showDialog, setShowDialog] = React.useState(false);
  const [commitMessage, setCommitMessage] = React.useState("");

  const finalSave = async () => {
    setIsSaving(true);

    try {
      await axiosInstance.put(
        `/repo/${location.state.projectId}/files/${location.state.fileId}`,
        {
          content,
          message: commitMessage || `Updated file ${filename}`,
        }
      );

      toast.success("File content saved successfully!");
      setIsEditable(false);
      setShowDialog(false);
      setCommitMessage("");

    } catch (error) {
      console.error("Error saving file content:", error);
      toast.error("Failed to save file content.");
    }

    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur border-b border-gray-700 p-4 flex items-center justify-between shadow-md">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-all shadow"
        >
          Back
        </button>

        <h2 className="text-2xl font-bold tracking-wide text-gray-100 drop-shadow">
          {filename}
        </h2>

        {!isEditable ? (
          <button
            onClick={() => setIsEditable(true)}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all shadow"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={() => setShowDialog(true)}
            disabled={isSaving}
            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition-all shadow"
          >
            Save
          </button>
        )}
      </header>

      {/* Content */}
      <div className="p-8 max-w-4xl mx-auto">
        {!isEditable ? (
          <pre
            className="
              whitespace-pre-wrap break-words 
              bg-gray-900 
              p-6 
              rounded-xl 
              border border-gray-700 
              shadow-lg 
              text-gray-200
              overflow-y-auto
              no-scrollbar
            "
            style={{ maxHeight: "75vh" }}
          >
            {content}
          </pre>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="
              w-full 
              p-6 
              h-[75vh] 
              bg-gray-900 
              border border-gray-700 
              rounded-xl 
              shadow-lg
              text-gray-200 
              focus:outline-none focus:ring-2 focus:ring-indigo-500
              resize-none 
              overflow-y-auto 
              no-scrollbar
            "
          />
        )}
      </div>

      {/* 🔥 Save Confirmation Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 shadow-2xl w-96 animate-fadeIn">
            <h3 className="text-xl font-bold mb-4 text-white">
              Add a Commit Message
            </h3>

            <textarea
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="Describe what you changed..."
              className="w-full p-3 h-28 bg-gray-800 border border-gray-700 rounded-lg text-white resize-none focus:outline-none"
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowDialog(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
              >
                Cancel
              </button>

              <button
                onClick={finalSave}
                disabled={isSaving}
                className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Confirm Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

    </div>
  );
};

export default Content;
