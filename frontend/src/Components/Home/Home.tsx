import "../../index.css"
import { useNavigate } from 'react-router'
import { useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";

function Home() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // If already logged in → go to dashboard
  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) return null; // prevent flicker

  return (
    <>
    <div className='flex items-center justify-center mt-40'>
    <h1 className='text-4xl font-bold text-white'>User Management System</h1>
    </div>
    <div>
      <div className='flex items-center gap-10 justify-center mt-30'>
        <div className='bg-gray-300 w-fit'>
        <button onClick={() => navigate("/register")} className='p-2 w-30 h-12 ml-0.5 mb-0.5 cursor-pointer bg-black text-white font-semibold  hover:bg-gray-900 active:ml-0 active:mb-0 transition duration-200'>Register</button>
        </div>
        <div className='bg-gray-300 w-fit'>
        <button onClick={() => navigate("/login")} className='p-2 w-30 h-12 ml-0.5 mb-0.5 cursor-pointer bg-black text-white font-semibold  hover:bg-gray-900 active:ml-0 active:mb-0 transition duration-200'>Login</button>
        </div>
      </div>
    </div>
    </>
  )
}

export default Home