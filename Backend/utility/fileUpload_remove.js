import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from "dotenv"
dotenv.config({
    path : "./.env"
})

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

export const fileUploadOnCloudinary = async (filePath, folder) => {
    try {
        if (!filePath) return null;
        const uploadFile = await cloudinary.uploader.upload(filePath, {
            folder: folder,
            resource_type : "auto",
            type : 'upload'
        });

        fs.unlinkSync(filePath);
        return uploadFile;
    } catch (error) {
        console.error("Error uploading file to Cloudinary:", error);
        fs.unlinkSync(filePath)
    }
};

export const removeFileFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId,);
        if (result.result !== 'ok') {
            throw new Error(`Failed to delete image with publicId: ${publicId}`);
        }
        return result;
    } catch (error) {
        console.error('Error deleting file from Cloudinary:', error);
        throw new Error('Error deleting file from Cloudinary');
    }
}