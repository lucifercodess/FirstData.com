import React, { useState } from "react";
import { useUser } from "@/context/userContext";
import axios from "axios";
import { toast, useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    gender: user?.gender || "",
    profilePhoto: user?.profilePhoto || "", // Store image file
  });
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState(formData.profilePhoto || "");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePhoto: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Show the image preview
      };
      reader.readAsDataURL(file);
    }
  };
  const handleImageUplaod = async () => {
    try {
      const uploadData = new FormData();
      uploadData.append("profilePhoto", formData.profilePhoto); 
  
      const res = await axios.put(
        "http://localhost:3000/api/user/update-profilePhoto",
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // Ensure cookies are sent
        }
      );
  
      if (res.data.code === 1) {
        toast({
          title: "Success",
          description: res.data.message,
          status: "success",
          duration: 3000,
        });
        setUser(res.data.user);
        navigate('/')
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 3000,
      });
    }
  };
  

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-200 to-pink-400 py-10 px-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-lg transform transition-all duration-500 hover:scale-105 hover:shadow-xl">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="relative">
            {/* Profile image preview */}
            <img
              src={imagePreview || "https://via.placeholder.com/200"}
              alt="Profile"
              className="w-36 h-36 rounded-full object-cover border-4 border-gray-300 shadow-lg transform transition-all duration-300 hover:scale-105"
            />
            <label
              htmlFor="profileImage"
              className="absolute bottom-0 right-0 bg-pink-500 p-2 rounded-full cursor-pointer shadow-lg hover:scale-110 transition-all duration-300"
            >
              <i className="fas fa-camera text-white text-xl"></i>
            </label>
            <input
              type="file"
              id="profileImage"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <button
            onClick={handleImageUplaod}
            className="text-pink-600 font-semibold hover:underline mt-3"
          >
            Change Picture
          </button>
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Update Your Profile
        </h2>

        {/* Profile Form */}
        <form className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="name" className="text-lg font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              className="p-4 mt-2 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none transform transition-all duration-300 hover:shadow-md"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="text-lg font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="p-4 mt-2 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none transform transition-all duration-300 hover:shadow-md"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="phone"
              className="text-lg font-medium text-gray-700"
            >
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              className="p-4 mt-2 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none transform transition-all duration-300 hover:shadow-md"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="gender"
              className="text-lg font-medium text-gray-700"
            >
              Gender
            </label>
            <input
              type="text"
              id="gender"
              value={formData.gender}
              onChange={handleInputChange}
              placeholder="Enter your gender"
              className="p-4 mt-2 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none transform transition-all duration-300 hover:shadow-md"
            />
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-pink-500 text-white py-3 px-8 rounded-lg shadow-lg transform transition-all duration-300 hover:bg-pink-600 hover:shadow-xl"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
