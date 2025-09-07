import { useContext } from "react";
import { useChat } from "../../../../../Context/chatContext.jsx";
import { Context } from "../../../../../Context/context.jsx";
import ChatSidebar from "./ChatSideBar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import WelcomeScreen from "./WelcomeScreen.jsx";

const ChatApp = () => {
  const { activeChat, isMobile } = useChat();
  const { verifyUser } = useContext(Context);

  // If user is not logged in, display a login prompt
  if (!verifyUser.isLoggedIn) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Please Login</h2>
          <p className="text-gray-600 ">You need to be logged in to access the chat.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-inter">
      {/* Sidebar - Visible on desktop, hidden on mobile when a chat is active */}
      <div
        className={`${isMobile ? (activeChat ? "hidden" : "w-full") : "w-80 border-r border-gray-200"
          } bg-white flex-shrink-0`}
      >
        <ChatSidebar />
      </div>

      {/* Main Chat Area - Hidden on mobile when sidebar is active */}
      <div className={`${isMobile ? (activeChat ? "w-full" : "hidden") : "flex-1"} flex flex-col`}>
        {activeChat ? <ChatWindow /> : <WelcomeScreen />}
      </div>
    </div>
  );
};

export default ChatApp;
