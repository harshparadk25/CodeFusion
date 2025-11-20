import React, { useState } from "react";
import axios from "../../config/axios";
import { toast } from "sonner";

const FileUploader = ({projectId,onUploadSuccess}) => {
    const [files, setFiles] =useState([]);
    const inputRef = React.useRef(null);
    const handleUpload = async ()=>{
        if(files.length ===0){
            alert("Please select files to upload.");
            return;
        }

        const formData = new FormData();

        for(let f of files){
            formData.append('files', f);
        }

        formData.append('path', '/');
        formData.append('message', 'Uploading files');

        try{
            const res = await axios.post(`/repo/${projectId}/files/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',  
                },
            });
            console.log("Upload successful:", res.data);
            toast.success("Files uploaded successfully!");
            if(onUploadSuccess){
                onUploadSuccess(res.data);
            }
            setFiles([]);
            if(inputRef.current){
                inputRef.current.value = null;
            }
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Failed to upload files.");
        }
    };

    return (
         <div className="bg-gray-900 p-4 rounded-xl border border-gray-700">
      <h2 className="text-lg font-bold mb-2">Upload Files</h2>

      <span className="p-2 bg-gray-800 rounded-md border border-gray-700 inline-block mb-4 w-60 mr-70">
        <input
        type="file"
        ref={inputRef}
        multiple
        onChange={(e) => setFiles([...e.target.files])}
        className="mb-3"
      />
      </span>

      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md"
      >
        Upload
      </button>
    </div>
    )
}

export default FileUploader;