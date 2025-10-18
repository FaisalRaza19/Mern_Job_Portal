// import React, { useState, useEffect, useContext } from "react";
// import { FaCheckCircle, FaTimesCircle, FaTimes } from "react-icons/fa";
// import { Context } from "../../Context/context.jsx";

// const ALERT_DURATION = 5000;

// const Alert = () => {
//     const { alert, onClose } = useContext(Context);
//     const [timeLeft, setTimeLeft] = useState(ALERT_DURATION);

//     useEffect(() => {
//         if (alert) {
//             setTimeLeft(ALERT_DURATION);

//             const timer = setInterval(() => {
//                 setTimeLeft((prevTime) => {
//                     if (prevTime <= 100) {
//                         clearInterval(timer);
//                         return 0;
//                     }
//                     return prevTime - 100;
//                 });
//             }, 100);

//             const timeout = setTimeout(() => {
//                 onClose();
//             }, ALERT_DURATION);

//             return () => {
//                 clearInterval(timer);
//                 clearTimeout(timeout);
//             };
//         }
//     }, [alert, onClose]);

//     if (!alert) return null;

//     const isSuccess = alert.statusCode === 200 || alert.statusCode === 201;

//     const renderMessage = () => {
//         if (!alert || !alert.message) return <span>Something went wrong.</span>;

//         if (typeof alert.message === "string") {
//             // If backend sends "Internal server error" or "message: Internal server error"
//             return <span>{alert.message.replace(/^message:\s*/i, "").trim()}</span>;
//         }

//         if (typeof alert.message === "object") {
//             // If backend sends an object like { message: "Internal server error", statusCode: 500 }
//             const msg =
//                 alert.message.message ||
//                 alert.message.error ||
//                 alert.message.detail ||
//                 Object.values(alert.message)[0] ||
//                 "Something went wrong.";
//             return <span>{msg}</span>;
//         }

//         return <span>Something went wrong.</span>;
//     };

//     return (
//         <div className="flex absolute flex-col items-center justify-center z-90">
//             <div
//                 className={`fixed top-4 right-4 p-4 rounded shadow-lg flex flex-col w-80 transition-all duration-300 ease-in-out ${isSuccess ? "bg-green-100" : "bg-red-100"
//                     }`}
//             >
//                 <div className="flex items-center justify-between mb-2">
//                     <div className="flex items-center">
//                         {isSuccess ? (
//                             <FaCheckCircle className="text-green-500 mr-2" />
//                         ) : (
//                             <FaTimesCircle className="text-red-500 mr-2" />
//                         )}
//                         <div className={`${isSuccess ? "text-green-700" : "text-red-700"} text-sm`}>
//                             {renderMessage()}
//                         </div>
//                     </div>
//                     <button
//                         onClick={onClose}
//                         className="text-gray-500 hover:text-gray-700 transition-colors"
//                     >
//                         <FaTimes />
//                     </button>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-1.5">
//                     <div
//                         className={`h-1.5 rounded-full transition-all duration-100 ${isSuccess ? "bg-green-500" : "bg-red-500"
//                             }`}
//                         style={{ width: `${(timeLeft / ALERT_DURATION) * 100}%` }}
//                     ></div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Alert;


import React, { useState, useEffect, useContext } from "react";
import { FaCheckCircle, FaTimesCircle, FaTimes } from "react-icons/fa";
import { Context } from "../../Context/context.jsx";

const ALERT_DURATION = 5000;

const Alert = () => {
    const { alert, onClose } = useContext(Context);
    const [timeLeft, setTimeLeft] = useState(ALERT_DURATION);

    useEffect(() => {
        if (alert) {
            setTimeLeft(ALERT_DURATION);

            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 100) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 100;
                });
            }, 100);

            const timeout = setTimeout(onClose, ALERT_DURATION);

            return () => {
                clearInterval(timer);
                clearTimeout(timeout);
            };
        }
    }, [alert, onClose]);

    if (!alert) return null;

    const isSuccess = alert.statusCode === 200 || alert.statusCode === 201;

    const renderMessage = () => {
        if (!alert?.message) return <span>Something went wrong.</span>;

        if (typeof alert.message === "string") {
            return <span>{alert.message.replace(/^message:\s*/i, "").trim()}</span>;
        }

        if (typeof alert.message === "object") {
            const msg =
                alert.message.message ||
                alert.message.error ||
                alert.message.detail ||
                Object.values(alert.message)[0] ||
                "Something went wrong.";
            return <span>{msg}</span>;
        }

        return <span>Something went wrong.</span>;
    };

    return (
        <div className="fixed top-4 right-4 sm:right-6 md:right-8 z-[9999] flex flex-col gap-3">
            <div
                className={`w-full max-w-xs sm:max-w-sm md:max-w-md p-4 rounded-2xl shadow-xl border backdrop-blur-md flex flex-col gap-2 transition-all duration-300 ease-in-out ${isSuccess
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "bg-red-50 border-red-200 text-red-700"
                    }`}
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2">
                        {isSuccess ? (
                            <FaCheckCircle className="text-green-500 text-lg sm:text-xl flex-shrink-0 mt-0.5" />
                        ) : (
                            <FaTimesCircle className="text-red-500 text-lg sm:text-xl flex-shrink-0 mt-0.5" />
                        )}
                        <div className="text-sm sm:text-base leading-snug break-words">
                            {renderMessage()}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors text-lg sm:text-xl"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div
                        className={`h-1.5 transition-all duration-100 ${isSuccess ? "bg-green-500" : "bg-red-500"
                            }`}
                        style={{ width: `${(timeLeft / ALERT_DURATION) * 100}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default Alert;

