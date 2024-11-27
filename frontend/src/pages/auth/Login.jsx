import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/userContext';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const Login = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
   try {
    const res = await axios.post('http://localhost:3000/api/user/login',{email,password},{
      withCredentials: true,
    })
    if(res.data.code === 1){
      toast({
        title: "success",
        description: res.data.message,
        status:'success',
        duration: 3000,
      });
      setUser(res.data.user);
      navigate('/');
    }
   } catch (error) {
    console.log(error);
    toast({
      title: "Error",
      description: error.response?.data?.message || "Something went wrong.",
      status: "error",
      duration: 3000,
    })
   }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-teal-500">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 transform transition duration-300 ease-in-out hover:scale-105">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          Welcome Back!
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-lg font-medium text-gray-600 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-lg font-medium text-gray-600 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold rounded-md hover:bg-gradient-to-l hover:from-teal-500 hover:to-blue-500 transition duration-300 ease-in-out"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <span className="text-gray-600">Don't have an account?</span>
          <a href="/register" className="text-blue-500 hover:underline ml-1 font-semibold">
            Register here
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
