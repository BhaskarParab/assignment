import { useState } from "react";
import { useNavigate } from "react-router";

interface FormType {
  name: string;
  email: string;
  age: string;
  funfact: string;
  password: string;
}

function Register() {
  const [form, setForm] = useState<FormType>({
    name: "",
    email: "",
    age: "",
    funfact: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<FormType>>({});
  const [successMsg, setSuccessMsg] = useState<string>(""); // For success response
  const [backendError, setBackendError] = useState<string>(""); // Backend error

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear field error
    setSuccessMsg(""); // clear success on typing
    setBackendError(""); // clear backend error on typing
  };

  const validate = () => {
    const newErrors: Partial<FormType> = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Email is invalid";

    if (!form.age.trim()) newErrors.age = "Age is required";
    else if (!/^\d+$/.test(form.age)) newErrors.age = "Age must be a number";

    if (!form.funfact.trim()) newErrors.funfact = "Fun fact is required";

    if (!form.password.trim()) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return; // stop if validation fails

    const payload = {
      ...form,
      age: parseInt(form.age, 10),
    };

    try {
      const res = await fetch("http://localhost:5000/app/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json(); // parse JSON response

      if (res.ok) {
        setSuccessMsg(data.message || "User registered successfully!");
        setBackendError("");
        setForm({ name: "", email: "", age: "", funfact: "", password: "" });
        setErrors({});
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 1500);
      } else if (res.status === 409) {
        setBackendError(data.message || "Email already exists");
        setSuccessMsg("");
      } else {
        setBackendError(data.message || "Registration failed");
        setSuccessMsg("");
      }

      console.log("Response from backend =>", data);
    } catch (err) {
      setBackendError("Cannot connect to backend");
      setSuccessMsg("");
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center mt-50">
      <div className="bg-white">
        <div className="w-120 h-auto ml-0.5 mb-0.5 bg-black p-6">
          <h1 className="text-white text-2xl font-semibold mb-6 text-center">
            Register
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name */}
            <div>
              <input
                onChange={handleChange}
                name="name"
                type="text"
                placeholder="Full Name"
                value={form.name}
                className="p-2 bg-gray-200 text-black font-medium outline-none w-full"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-2">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                onChange={handleChange}
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                className="p-2 bg-gray-200 text-black font-medium outline-none w-full"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-2">{errors.email}</p>
              )}
            </div>

            {/* Age */}
            <div>
              <input
                onChange={handleChange}
                name="age"
                type="text"
                placeholder="Age"
                value={form.age}
                className="p-2 bg-gray-200 text-black font-medium outline-none w-full"
              />
              {errors.age && (
                <p className="text-red-500 text-sm mt-2">{errors.age}</p>
              )}
            </div>

            {/* Fun Fact */}
            <div>
              <input
                onChange={handleChange}
                name="funfact"
                type="text"
                placeholder="Fun Fact"
                value={form.funfact}
                className="p-2 bg-gray-200 text-black font-medium outline-none w-full"
              />
              {errors.funfact && (
                <p className="text-red-500 text-sm mt-2">{errors.funfact}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <input
                onChange={handleChange}
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                className="p-2 bg-gray-200 text-black font-medium outline-none w-full"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-2">{errors.password}</p>
              )}
            </div>

            {/* Backend error */}
            {backendError && (
              <p className="text-red-500 flex justify-center text-sm mt-2">
                {backendError}
              </p>
            )}

            {/* Success message */}
            {successMsg && (
              <p className="text-green-500 flex justify-center text-sm mt-2">
                {successMsg}
              </p>
            )}

            {/* Submit Button */}
            <div className="bg-gray-300 w-fit self-center mt-4">
              <button
                type="submit"
                className="p-2 w-30 h-12 ml-0.5 mb-0.5 cursor-pointer bg-black text-white font-semibold hover:bg-gray-900 active:ml-0 active:mb-0 transition duration-200"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
