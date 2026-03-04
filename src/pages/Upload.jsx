import React, { useState } from 'react'
import { AxiosCall } from '../services/AxiosCall';

const Upload = () => {
    const [uploadedFile, setUploadedFile] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleUploadOfFiles = async () => {
        setLoading(true)
        try {
            const formData = new FormData();
            formData.append("project", "Client Onboarding Project");
            Array.from(uploadedFile).forEach((file) => {
                formData.append("files", file);
            });
            const result = await AxiosCall('POST', 'api/upload/', formData, true, true)
            console.log(result);

        } catch (error) {
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
                <button disabled={uploadedFile.length == 0} onClick={handleUploadOfFiles} className='bg-blue-700 border rounded-lg px-8 py-2 flex justify-center items-center disabled:bg-blue-400'>
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