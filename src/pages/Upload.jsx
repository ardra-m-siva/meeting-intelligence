import React, { useState } from 'react'
import { AxiosCall } from '../services/AxiosCall';
import { toast } from 'react-toastify';

const Upload = () => {
    const [uploadedFile, setUploadedFile] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [projectName, setProjectName] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [uploadResult, setUploadResult] = useState(null);

    const handleUploadOfFiles = async () => {
        setLoading(true)
        setError("")
        try {
            const formData = new FormData();
            formData.append("project", projectName);
            Array.from(uploadedFile).forEach((file) => {
                formData.append("files", file);
            });
            const result = await AxiosCall('POST', 'api/upload/', formData, true, true)
            if (result.status == 200) {
                setUploadedFile([])
                setProjectName("")
                setUploadResult(result.data)
                setError("")
                toast.success(`Successfully uploaded ${result.data.files.length} file(s)`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                })
                console.log(result.data);
            } else {
                setError("Upload failed. Please try again.")
                setUploadedFile([])
                setProjectName("")
            }

        } catch (error) {
            setError("Error uploading files. Please try again.")
            console.log(error);
        } finally {
            setLoading(false)
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);

        const invalidFile = files.find(file => {
            const ext = file.name.split(".").pop().toLowerCase();
            return ext !== "txt" && ext !== "vtt";
        });
        if (invalidFile) {
            setError("Only .txt and .vtt files are allowed.");
            setUploadedFile([]);
            return;
        }

        setError("");
        setUploadedFile(files);
    };

    return (
        <div>
            <h5 className='font-bold'>UPLOAD</h5>

            {/* Project Name Input */}
            <div className='mt-4'>
                <label htmlFor='project-name' className='block text-sm font-medium text-white mb-2'>
                    Project Name
                </label>
                <input
                    id='project-name'
                    type='text'
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder='Enter project name'
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white'
                    required
                />
            </div>

            {/* Drag & Drop Upload Area     */}
            <label htmlFor='uploaded-file'>
                <div
                    className={`border mt-4 rounded-lg p-8 text-center transition ${isDragging ? "bg-slate-700 border-blue-500" : "border-slate-600"}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <i className="fa-solid fa-file-arrow-up fa-2xl"></i>
                    <p className="mb-2 mt-4 text-sm text-white text-center">
                        <span className="font-semibold">Click to upload or drag and drop</span>
                    </p>
                    <p className="text-xs text-gray-500">Supported formats .txt .vtt</p>
                    {
                        uploadedFile.length > 0 && <p className='text-sm'>File name: {
                            uploadedFile.map((item, index) =>
                                <span key={index} className='block text-green-400'>{item.name}</span>
                            )
                        } </p>
                    }
                    {
                        error && <p className='text-red-500 text-sm'>{error}</p>
                    }
                </div>
            </label>
            <input id='uploaded-file' hidden type="file" onChange={(e) => {
                const files = Array.from(e.target.files)

                const invalidFile = files.find(file => {
                    const ext = file.name.split(".").pop().toLowerCase();
                    return ext !== "txt" && ext !== "vtt";
                });
                if (invalidFile) {
                    setError("Only .txt and .vtt files are allowed.");
                    setUploadedFile([]);
                    return;
                }

                setError("");
                setUploadedFile(files)
            }} multiple={true} />

            <div className='flex justify-center mt-5'>
                <button disabled={uploadedFile.length == 0 || loading || !projectName.trim()} onClick={handleUploadOfFiles} className='bg-blue-700 border rounded-lg px-8 py-2 flex justify-center items-center disabled:bg-blue-400'>
                    <span>Upload </span>
                    {loading && <div className="animate-spin rounded-full h-4 w-4 border-b border-r border-white ms-1"></div>}
                </button>
            </div>

            {/* Uploaded Files Preview List*/}
            {uploadResult && uploadResult.files && (
                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4 text-white">Upload Summary for '{uploadResult.project}'</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {uploadResult.files.map((file, idx) => (
                            <div key={idx} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                <h4 className="font-semibold text-lg text-blue-400 truncate">{file.file_name}</h4>
                                <div className="mt-2 text-sm text-slate-300 space-y-1">
                                    <p><span className="font-medium text-slate-400">Meeting Date:</span> {file.meeting_date || 'Unknown'}</p>
                                    <p><span className="font-medium text-slate-400">Speakers Detected:</span> {file.speaker_count}</p>
                                    <p><span className="font-medium text-slate-400">Word Count:</span> {file.word_count}</p>
                                    <p><span className="font-medium text-slate-400">Decisions Found:</span> {file.decisions?.length || 0}</p>
                                    <p><span className="font-medium text-slate-400">Action Items Found:</span> {file.action_items?.length || 0}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {/* Upload Progress*/}
        </div>
    )
}

export default Upload