import React from "react";

const CommitList = ({ commits }) => {
  if (!commits || !Array.isArray(commits) || commits.length === 0) {
    return (
      <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 mt-6">
        <h2 className="text-lg font-bold mb-4">Recent Commits</h2>
        <p className="text-gray-500 text-sm">No commits available.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 mt-6">
      <h2 className="text-lg font-bold mb-4">Recent Commits</h2>

      <ul className="space-y-3">
        {commits.map((commit, index) => (
          <li
            key={commit._id || index}
            className="p-4 bg-gray-800 rounded-lg border border-gray-700"
          >
            
            <p className="text-indigo-400 font-semibold">
              📝 {commit?.message || "No message"}
            </p>

            <p className="text-sm text-gray-300 mt-1">
              📄 File: {commit?.file?.name || "Unknown file"}
            </p>
 
            <p className="text-sm text-gray-400 mt-1">
              👤 {commit?.author?.username || "Unknown user"}
            </p>

            <p className="text-xs text-gray-500 mt-1">
              {commit?.createdAt
                ? new Date(commit.createdAt).toLocaleString()
                : "Unknown time"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommitList;
