import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@/context/userContext";
import LOgo from '../../assets/Logo.gif'

const RegisterForm = () => {
  const [step, setStep] = useState(1);
  const {user,setUser} = useUser();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    age: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData); // Check the formData before sending
  
    try {
      const res = await axios.post(
        "http://localhost:3000/api/user/register",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
  
      console.log('Registration response:', res.data); // Check response
  
      if (res.data.code === 1) {
        console.log('User from registration:', res.data.user); // Verify user data
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        
        toast({
          title: res.data.message,
          description: res.data.message,
          status: "success",
          duration: 3000,
        });
        navigate('/afterRegister');
        
      } else {
        toast({
          title: res.data.message,
          description: res.data.message,
          status: "error",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 3000,
      });
      console.log(error);
    }
  };
  
  useEffect(() => {
    console.log("User state after registration:", user); // This should now be updated
  }, [user]);
  


  const containerClass =
    "w-full max-w-lg mx-auto p-6 bg-gradient-to-br from-gray-100 to-gray-200 shadow-xl rounded-xl relative overflow-hidden";
  const inputClass =
    "w-full px-4 py-3 mt-4 text-sm text-gray-800 bg-gray-50 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-teal-400";
  const buttonClass =
    "px-6 py-2 mt-6 text-sm font-medium text-white bg-gradient-to-r from-teal-400 to-blue-500 rounded-lg shadow hover:from-teal-500 hover:to-blue-600";
  const headingClass = "text-2xl font-semibold text-gray-800 tracking-tight";
  const descriptionClass = "mt-2 text-gray-600";

  const steps = [
    {
      id: 1,
      title: "What’s your name?",
      component: (
        <motion.div
          key="step1"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="text-center"
        >
          <h2 className={headingClass}>Welcome! Let’s start with your name.</h2>
          <p className={descriptionClass}>Tell us what to call you!</p>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className={inputClass}
          />
          <button onClick={handleNext} className={buttonClass}>
            Next
          </button>
        </motion.div>
      ),
    },
    {
      id: 2,
      title: "What's your email?",
      component: (
        <motion.div
          key="step2"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className="text-center"
        >
          <h2 className={headingClass}>What’s your email address?</h2>
          <p className={descriptionClass}>
            We’ll use this to stay in touch with you.
          </p>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className={inputClass}
          />
          <div className="flex justify-between">
            <button onClick={handleBack} className={buttonClass}>
              Back
            </button>
            <button onClick={handleNext} className={buttonClass}>
              Next
            </button>
          </div>
        </motion.div>
      ),
    },
    {
      id: 3,
      title: "Set your password",
      component: (
        <motion.div
          key="step3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-center"
        >
          <h2 className={headingClass}>Create a secure password</h2>
          <p className={descriptionClass}>Make sure it’s strong and safe.</p>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className={inputClass}
          />
          <div className="flex justify-between">
            <button onClick={handleBack} className={buttonClass}>
              Back
            </button>
            <button onClick={handleNext} className={buttonClass}>
              Next
            </button>
          </div>
        </motion.div>
      ),
    },
    {
      id: 4,
      title: "Enter your phone and gender",
      component: (
        <motion.div
          key="step4"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="text-center"
        >
          <h2 className={headingClass}>A few more details</h2>
          <p className={descriptionClass}>Let’s complete your profile.</p>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone number"
            className={inputClass}
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={`${inputClass} mt-4`}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <div className="flex justify-between">
            <button onClick={handleBack} className={buttonClass}>
              Back
            </button>
            <button onClick={handleNext} className={buttonClass}>
              Next
            </button>
          </div>
        </motion.div>
      ),
    },
    {
      id: 5,
      title: "What’s your age?",
      component: (
        <motion.div
          key="step5"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="text-center"
        >
          <h2 className={headingClass}>Final step!</h2>
          <p className={descriptionClass}>Let us know your age.</p>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Enter your age"
            className={inputClass}
          />
          <div className="flex justify-between">
            <button onClick={handleBack} className={buttonClass}>
              Back
            </button>
            <button onClick={handleSubmit} className={buttonClass}>
              Submit
            </button>
          </div>
        </motion.div>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-300">
       {/* Logo */}
       <div className="absolute top-8 left-8 ">
        <img
          src={LOgo}
          alt="App Logo"
          className="h-[100px] w-auto object-contain rounded-full"
        />
      </div>
      <div
        className={` p-10 h-[350px] flex items-center justify-center ${containerClass}`}
      >
        <h1 className="absolute top-4 left-4 p-3 text-sm font-semibold text-gray-700">
          Step {step} of {steps.length}
        </h1>
        {steps.find((s) => s.id === step)?.component}
      </div>
    </div>
  );
};

export default RegisterForm;
