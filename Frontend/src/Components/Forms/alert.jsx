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
                setTimeLeft((prevTime) => {
                    if (prevTime <= 100) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prevTime - 100;
                });
            }, 100);

            const timeout = setTimeout(() => {
                onClose();
            }, ALERT_DURATION);

            return () => {
                clearInterval(timer);
                clearTimeout(timeout);
            };
        }
    }, [alert, onClose]);

    if (!alert) return null;

    const isSuccess = alert.statusCode === 200 || alert.statusCode === 201;

    const renderMessage = () => {
        if (typeof alert.message === "string") {
            return <span>{alert.message}</span>;
        } else if (typeof alert.message === "object" && alert.message !== null) {
            return (
                <div className="space-y-1">
                    {Object.entries(alert.message).map(([key, value], index) => (
                        <p key={index} className="text-sm">
                            <strong>{key}:</strong> {value}
                        </p>
                    ))}
                </div>
            );
        } else {
            return <span>Something went wrong.</span>;
        }
    };

    return (
        <div className="flex absolute flex-col items-center justify-center z-90">
            <div
                className={`fixed top-4 right-4 p-4 rounded shadow-lg flex flex-col w-80 transition-all duration-300 ease-in-out ${isSuccess ? "bg-green-100" : "bg-red-100"
                    }`}
            >
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                        {isSuccess ? (
                            <FaCheckCircle className="text-green-500 mr-2" />
                        ) : (
                            <FaTimesCircle className="text-red-500 mr-2" />
                        )}
                        <div className={`${isSuccess ? "text-green-700" : "text-red-700"} text-sm`}>
                            {renderMessage()}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <FaTimes />
                    </button>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                        className={`h-1.5 rounded-full transition-all duration-100 ${isSuccess ? "bg-green-500" : "bg-red-500"
                            }`}
                        style={{ width: `${(timeLeft / ALERT_DURATION) * 100}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default Alert;
