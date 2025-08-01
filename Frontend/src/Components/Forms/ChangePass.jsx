import React, { useContext, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Context } from "../../Context/context";

const ChangePass = () => {
    const { token } = useParams()
    const { userAuth, showAlert } = useContext(Context)
    const { updatePassword } = userAuth
    const [newPass, setNewPass] = useState("");
    const [showPass, setShowPass] = useState(false);
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await updatePassword({ new_pass: newPass, token })
            showAlert(data)
            if (data.statusCode === 200) {
                navigate("/")
            }
        } catch (error) {
            console.log("error during update pass", error.message)
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 p-6">
            {/* Back Button */}

            <Link to={"/login"}>
                <button
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 mb-8 self-start hover:text-blue-600 transition"
                >
                    <FaArrowLeft size={20} />
                    <span className="font-medium text-lg">Back</span>
                </button>
            </Link>

            {/* Form Container */}
            <div className="max-w-md mt-32 w-full mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
                    Change Password
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="newPassword"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                id="newPassword"
                                type={showPass ? "text" : "password"}
                                value={newPass}
                                onChange={(e) => setNewPass(e.target.value)}
                                placeholder="Enter your new password"
                                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                aria-label={showPass ? "Hide password" : "Show password"}
                            >
                                {showPass ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
                    >
                        Change Password
                    </button>
                </form>
            </div>
        </div>
    );
};


export default ChangePass
