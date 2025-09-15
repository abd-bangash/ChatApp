import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "../skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import avatar from '../assets/avatar.jpg'

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading, userSentiments  } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;


  const emotionEmojiMap = {
    joy: '😊',
    happiness: '😄',
    excitement: '🤩',
    neutral: '😐',
    sadness: '😢',
    anger: '😡',
    fear: '😨'
  };

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      {/* header */}
      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => {
          const emotion = userSentiments[user._id] || 'neutral';
          const emoji = emotionEmojiMap[emotion] || '😐';
          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}`}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || avatar}
                  alt={user.userame}
                  className="size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                )}
              </div>

              {/* info + emoji */}
              <div className="hidden lg:flex flex-col text-left min-w-0">
                <div className="font-medium truncate flex items-center gap-1">
                  {user.fullname} <span>{emoji}</span>
                </div>
                <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          );
        })}
        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;