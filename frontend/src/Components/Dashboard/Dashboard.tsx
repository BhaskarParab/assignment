import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router";

function Dashboard() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) return <p className="text-center mt-60">Loading...</p>;

  if (!user) {
    navigate("/", { replace: true });
    return null;
  }

  // if (error) {
  //   return <p className="text-red-500 mt-60 text-center">{error}</p>;
  // }

  // if (!user) {
  //   return <p className="text-center">Loading...</p>;
  // }

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/app/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      await logout();   
      navigate("/", { replace: true });
    }
  };

  return (
    <>
      <div className="flex justify-center mt-70">
        <div className="bg-white">
          <div className="bg-black text-gray-100 p-6 w-120 h-auto ml-0.5 mb-0.5">
            <h1 className="text-2xl mb-4 text-center font-bold">
              User Profile
            </h1>

            <p className="flex text-lg md:text-2xl mt-6 font-semibold text-gray-300 gap-2">
              <b className="font-extralight text-white">Name:</b> {user.name}
            </p>
            <p className="flex text-lg md:text-2xl mt-6 font-semibold text-gray-300 gap-2">
              <b className="font-extralight text-white">Email:</b> {user.email}
            </p>
            <p className="flex text-lg md:text-2xl mt-6 font-semibold text-gray-300 gap-2">
              <b className="font-extralight text-white">Age:</b> {user.age}
            </p>
            <p className="flex text-lg md:text-2xl mt-6 font-semibold text-gray-300 gap-2">
              <b className="font-extralight text-white">Fun Fact:</b>{" "}
              {user.funfact}
            </p>
          </div>
        </div>
      </div>
      <div>
      <div className='flex items-center gap-10 justify-center mt-8'>
        <div className='bg-gray-300 w-fit'>
        <button onClick={handleLogout} className='p-2 w-30 h-12 ml-0.5 mb-0.5 cursor-pointer bg-black text-white font-semibold  hover:bg-gray-900 active:ml-0 active:mb-0 transition duration-200'>Logout</button>
        </div>
        <div className='bg-gray-300 w-fit'>
        <button onClick={() => navigate("/tasks")} className='p-2 w-30 h-12 ml-0.5 mb-0.5 cursor-pointer bg-black text-white font-semibold  hover:bg-gray-900 active:ml-0 active:mb-0 transition duration-200'>Tasks</button>
        </div>
      </div>
    </div>
    </>
  );
}

export default Dashboard;
