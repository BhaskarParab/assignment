import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const { refetchUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/app/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ email, password }),
      credentials: "include",
    });

    if (res.ok) {
      setSuccess("Login successfull");
      setTimeout(async () => {
        await refetchUser(); // context updates AFTER delay
        navigate("/dashboard", { replace: true });
      }, 1500);
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <>
      <div className="flex justify-center mt-70">
        <div className="bg-white">
          <div className="w-120 h-auto ml-0.5 mb-0.5 bg-black p-6">
            {/* Title */}
            <h1 className="text-white text-2xl font-semibold mb-6 text-center">
              Login
            </h1>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
                className="p-2 bg-gray-200 text-black font-medium outline-none"
              />

              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
                className="p-2 bg-gray-200 text-black font-medium outline-none"
              />

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              {success && (
                <p className="text-green-500 text-sm text-center">{success}</p>
              )}

              {/* Submit Button */}
              <div className="bg-gray-300 w-fit self-center mt-4">
                <button
                  type="submit"
                  className="
                    p-2 w-30 h-12 ml-0.5 mb-0.5 cursor-pointer
                    bg-black text-white font-semibold
                    hover:bg-gray-900
                    active:ml-0 active:mb-0
                    transition duration-200
                  "
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
