import React from "react";
import Logo from "../../assets/Logo.gif";
import { Link, useNavigate } from "react-router-dom";
import Logout from "../../assets/user-logout.png";
import { useUser } from "@/context/userContext";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import Profile from '../../assets/profile.png';
const Home = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const handleLogout = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/user/logout", {
        withCredentials: true,
      });
      if (res.data.code === 1) {
        toast({
          title: "success",
          description: res.data.message,
          status: "success",
          duration: 3000,
        });
        navigate("/login");
        setUser(null);
      }
      console.log(res.data);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 3000,
      });
    }
  };
  return (
    <div className="mx-3 my-4 p-3">
      <div className="h-10 flex items-center justify-between">
        <Link to={"/"}>
          <div>
            <img src={Logo} alt="" className="h-[50px] w-[50px] rounded-full" />
          </div>
        </Link>
        <div className="">
          <Link to="/profile">
          <button>
            <div>
              <img src={Profile} alt="" className="w-[50px] h-[50px] cursor-pointer"/>
            </div>
          </button>
          </Link>
          <button onClick={handleLogout}>
            <div>
              <img
                src={Logout}
                alt=""
                className="w-[50px] h-[50px] cursor-pointer ml-5"
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
