import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/userContext";
import './after.css'
const AfterRegister = () => {
  const [step, setStep] = useState(1);
  const {user,setUser} = useUser();
  const [formData, setFormData] = useState({
    hobbies: "",
    interest: "",
    relationshipType: "",
    height: "",
    smoking: "",
    drinking: "",
    drugs: "",
    religion: "",
    profilePhoto: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profilePhoto: file });
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        "http://localhost:3000/api/user/add-details",
        formData,
        {
          withCredentials: true,
        }
      );

      if (res.data.code === 1) {
        toast({
          title: res.data.message,
          description: res.data.message,
          status: "success",
          duration: 3000,
        });
        setUser(res.data.user);
        navigate("/");
      } else {
        toast({
          title: res.data.message,
          description: res.data.message,
          status: "error",
          duration: 3000,
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: error.response.data?.message,
        status: "error",
        duration: 3000,
      })
    }
  };

  const steps = [
    {
      id: 1,
      question: "What are your hobbies?",
      input: (
        <input
          type="text"
          name="hobbies"
          value={formData.hobbies}
          onChange={handleChange}
          placeholder="Enter your hobbies"
          className="input-field"
        />
      ),
    },
    {
      id: 2,
      question: "What are you interested in?",
      input: (
        <input
          type="text"
          name="interest"
          value={formData.interest}
          onChange={handleChange}
          placeholder="Enter your interests"
          className="input-field"
        />
      ),
    },
    {
      id: 3,
      question: "What type of relationship are you looking for?",
      input: (
        <input
          type="text"
          name="relationshipType"
          value={formData.relationshipType}
          onChange={handleChange}
          placeholder="Enter relationship type"
          className="input-field"
        />
      ),
    },
    {
      id: 4,
      question: "How tall are you?",
      input: (
        <input
          type="text"
          name="height"
          value={formData.height}
          onChange={handleChange}
          placeholder="Enter your height"
          className="input-field"
        />
      ),
    },
    {
      id: 5,
      question: "Do you smoke?",
      input: (
        <input
          type="text"
          name="smoking"
          value={formData.smoking}
          onChange={handleChange}
          placeholder="Enter if you smoke"
          className="input-field"
        />
      ),
    },
    {
      id: 6,
      question: "Do you drink?",
      input: (
        <input
          type="text"
          name="drinking"
          value={formData.drinking}
          onChange={handleChange}
          placeholder="Enter if you drink"
          className="input-field"
        />
      ),
    },
    {
      id: 7,
      question: "Do you use drugs?",
      input: (
        <input
          type="text"
          name="drugs"
          value={formData.drugs}
          onChange={handleChange}
          placeholder="Enter if you use drugs"
          className="input-field"
        />
      ),
    },
    {
      id: 8,
      question: "What is your religion?",
      input: (
        <input
          type="text"
          name="religion"
          value={formData.religion}
          onChange={handleChange}
          placeholder="Enter your religion"
          className="input-field"
        />
      ),
    },
    {
      id: 9,
      question: "Upload your profile photo",
      input: (
        <div className="relative mb-6">
          <input
            type="file"
            name="profilePhoto"
            onChange={handleFileChange}
            accept="image/*"
            className="input-file"
          />
          {imagePreview && (
            <motion.img
              src={imagePreview}
              alt="Profile Preview"
              className="mt-4 rounded-xl shadow-xl w-32 h-32 object-cover transition-all duration-500 transform hover:scale-110"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </div>
      ),
    },
  ];
  useEffect(() => {
    console.log("User new:", user);
  }, [user]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-300 to-pink-400">
      <div className="p-8 bg-white rounded-xl shadow-lg w-full max-w-lg relative mb-5">
        <motion.h1
          className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Almost Done!
        </motion.h1>
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-center mt-4">
            <h2 className="text-xl mb-7 font-semibold text-gray-800">{steps[step - 1].question}</h2>
            {steps[step - 1].input}
          </div>

          <div className="flex justify-between">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-1 mt-4 text-sm font-medium text-white bg-gray-600 rounded-lg shadow hover:bg-gray-700"
              >
                Back
              </button>
            )}
            {step < steps.length ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-400 to-pink-400 rounded-lg shadow-lg hover:from-indigo-500 hover:to-pink-500 mt-6"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-400 to-pink-400 rounded-lg shadow-lg hover:from-indigo-500 hover:to-pink-500 "
              >
                Submit
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AfterRegister;
