import React, { useState } from 'react'
import { AxiosCall } from '../services/AxiosCall';
import { toast } from 'react-toastify';

const Upload = () => {
    const [uploadedFile, setUploadedFile] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleUploadOfFiles = async () => {
        setLoading(true)
        setError("")
        try {
            const formData = new FormData();
            formData.append("project", "Client Onboarding Project");
            Array.from(uploadedFile).forEach((file) => {
                formData.append("files", file);
            });
            const result = await AxiosCall('POST', 'api/upload/', formData, true, true)
            if (result.status == 200) {
                setUploadedFile([])
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
            }

        } catch (error) {
            setError("Error uploading files. Please try again.")
            console.log(error);
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h5 className='font-bold'>UPLOAD</h5>
            {/* Drag & Drop Upload Area     */}
            <label htmlFor='uploaded-file'>
                <div className='border mt-4 rounded-lg p-8 text-center'>
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
                <button disabled={uploadedFile.length == 0 || loading} onClick={handleUploadOfFiles} className='bg-blue-700 border rounded-lg px-8 py-2 flex justify-center items-center disabled:bg-blue-400'>
                    <span>Upload </span>
                    {loading && <div className="animate-spin rounded-full h-4 w-4 border-b border-r border-white ms-1"></div>}
                </button>
            </div>

            {/* Uploaded Files Preview List*/}
            {/* Upload Progress*/}
        </div>
    )
}

export default Upload