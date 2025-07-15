import React, { useState, useEffect } from 'react'
import { fetchSuggestedSkills } from "../../../../temp/suggestedSkilss.js"
import {FiPlus, FiX, FiLoader,} from "react-icons/fi"
import DashboardCard from "./dashboardCard.jsx"

const selectSkills = ({bio,userSkills}) => {
    const [skills, setSkills] = useState(userSkills || []);
    const [newSkill, setNewSkill] = useState("");
    const [suggestedSkills, setSuggestedSkills] = useState([]);
    const [showAddSkill, setShowAddSkill] = useState(false);
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    useEffect(() => {
        if (newSkill.trim().length < 2) {
            setSuggestedSkills([]);
            return;
        }

        if (typingTimeout) clearTimeout(typingTimeout);

        const timeout = setTimeout(async () => {
            setIsLoadingSuggestions(true);
            const suggestions = await fetchSuggestedSkills(bio, newSkill, skills);
            console.log(suggestions);
            setSuggestedSkills(suggestions || []);
            setIsLoadingSuggestions(false);
        }, 500);

        setTypingTimeout(timeout);
    }, [newSkill]);


    const handleAddSkill = () => {
        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
            setSkills([...skills, newSkill.trim()])
            setNewSkill("")
            setShowAddSkill(false)
        }
    }

    const handleRemoveSkill = (skillToRemove) => {
        setSkills(skills.filter((skill) => skill !== skillToRemove))
    }
    return (
        <DashboardCard title="Skills & Expertise">
            <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                    {/* Existing Skills */}
                    {skills.map((skill) => (
                        <div
                            key={skill}
                            className="flex items-center space-x-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full"
                        >
                            <span>{skill}</span>
                            <button
                                onClick={() => handleRemoveSkill(skill)}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                            >
                                <FiX className="w-3 h-3" />
                            </button>
                        </div>
                    ))}

                    {/* Add Skill Input */}
                    {showAddSkill ? (
                        <div className="relative w-64">
                            <input
                                type="text"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddSkill();
                                    }
                                }}
                                placeholder="Enter a skill"
                                className={`w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${isLoadingSuggestions ? "opacity-50 cursor-wait" : ""
                                    }`}
                                autoFocus
                                disabled={isLoadingSuggestions}
                            />

                            {/* Loading spinner */}
                            {isLoadingSuggestions && (
                                <div className="absolute mt-1 text-sm bg-gray-800 text-gray-500 dark:text-gray-300 px-2 py-1">
                                    <FiLoader className="animate-spin inline mr-1" /> Fetching suggestions...
                                </div>
                            )}

                            {/* GPT Suggested Skills Dropdown */}
                            {!isLoadingSuggestions && suggestedSkills.length > 0 && (
                                <ul className="absolute z-10 w-full mt-1 bg-gray-800 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-lg max-h-40 overflow-y-auto">
                                    {suggestedSkills.map((suggestion) => (
                                        <li
                                            key={suggestion}
                                            onClick={() => {
                                                if (!skills.includes(suggestion)) {
                                                    setSkills([...skills, suggestion]);
                                                }
                                                setNewSkill("");
                                                setSuggestedSkills([]);
                                            }}
                                            className="px-3 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-700 cursor-pointer"
                                        >
                                            {suggestion}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {/* Add / Cancel Buttons */}
                            <div className="flex mt-2 space-x-2">
                                <button
                                    onClick={handleAddSkill}
                                    className="px-2 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                                    disabled={isLoadingSuggestions || !newSkill.trim()}
                                >
                                    Add
                                </button>
                                <button
                                    onClick={() => {
                                        setShowAddSkill(false);
                                        setNewSkill("");
                                        setSuggestedSkills([]);
                                    }}
                                    className="px-2 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowAddSkill(true)}
                            className="flex items-center space-x-1 px-3 py-1 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-full hover:border-blue-500 transition-colors"
                        >
                            <FiPlus className="w-3 h-3" />
                            <span>Add Skill</span>
                        </button>
                    )}
                </div>

                {/* Static Suggested Skills Backup */}
                {suggestedSkills.length > 0 && !showAddSkill && (
                    <div className="mt-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Suggested Skills</h4>
                        <div className="flex flex-wrap gap-2">
                            {suggestedSkills.map((skill) => (
                                <button
                                    key={skill}
                                    onClick={() => !skills.includes(skill) && setSkills([...skills, skill])}
                                    disabled={skills.includes(skill)}
                                    className={`px-2 py-1 text-sm rounded ${skills.includes(skill)
                                        ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                                        }`}
                                >
                                    {skill}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </DashboardCard>
    )
}

export default selectSkills
