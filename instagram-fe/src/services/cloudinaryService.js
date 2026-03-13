import axiosClient from "../api/axiosClient";

/**
 * CloudinaryService handles image and video uploads via the backend API.
 * The backend handles the actual Cloudinary interaction securely.
 */
const cloudinaryService = {
    /**
     * Upload a file to Cloudinary via backend.
     * API: POST /upload
     * 
     * @param {File} file - The file to upload
     * @param {string} folder - Optional folder name
     * @returns {Promise<{url: string, publicId: string}>}
     */
    upload: async (file, folder = "general") => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        try {
            // axiosClient handles baseURL and auth headers
            // It returns the 'data' part of ApiResponse directly
            const response = await axiosClient.post("/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            return {
                url: response.url,
                publicId: response.publicId,
                mediaType: file.type.startsWith("video/") ? "VIDEO" : "IMAGE",
            };
        } catch (error) {
            console.error("Upload error:", error);
            throw error;
        }
    },

    /**
     * Upload multiple files.
     * API: POST /upload/multiple
     */
    uploadMultiple: async (files, folder = "general") => {
        const formData = new FormData();
        Array.from(files).forEach((file) => {
            formData.append("files", file);
        });
        formData.append("folder", folder);

        try {
            return await axiosClient.post("/upload/multiple", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        } catch (error) {
            console.error("Multiple upload error:", error);
            throw error;
        }
    },
};

export default cloudinaryService;
