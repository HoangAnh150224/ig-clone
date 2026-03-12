/**
 * CloudinaryService handles image and video uploads to Cloudinary.
 * You need to set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env
 */
const cloudinaryService = {
    upload: async (file) => {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dqmivv1hp"; // Default placeholder if not set
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "ig-clone-preset";

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        // Determine if it's a video or image
        const resourceType = file.type.startsWith("video/") ? "video" : "image";

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || "Cloudinary upload failed");
            }

            const data = await response.json();
            return {
                url: data.secure_url,
                mediaType: resourceType.toUpperCase(), // IMAGE or VIDEO
                publicId: data.public_id,
            };
        } catch (error) {
            console.error("Cloudinary upload error:", error);
            throw error;
        }
    },
};

export default cloudinaryService;
