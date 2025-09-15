import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import Sentiment from "sentiment";
import { useThemeStore } from "./useThemeStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
   userSentiments: JSON.parse(localStorage.getItem("userSentiments") || "{}"),

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

 sendMessages: async (messageData) => {
    const { selectedUser, messages, userSentiments } = get();
    try {
      const res = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        messageData
      );

      const updatedMessages = [...messages, res.data];
      set({ messages: updatedMessages });

      const combinedText = updatedMessages
        .slice(-10)
        .map(m => m.text || m.message || "")
        .join(" ");

      const sentimentRes = await axiosInstance.post("/analyze/sentiment", {
        text: combinedText
      });

      const emotion = sentimentRes.data.emotion?.toLowerCase() || "neutral";

      // update sentiment per user
      const newSentiments = {
        ...userSentiments,
        [selectedUser._id]: emotion
      };
      localStorage.setItem("userSentiments", JSON.stringify(newSentiments));
      set({ userSentiments: newSentiments });

      const emotionThemeMap = {
        joy: 'cupcake',
        happiness: 'lemonade',
        excitement: 'emerald',
        neutral: 'pastel',
        sadness: 'night',
        anger: 'dracula',
        fear: 'luxury'
      };

      const theme = emotionThemeMap[emotion] || 'pastel';

      useThemeStore.getState().setTheme(theme);

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error sending message");
    }
  },



  setSelectedUser: (selectedUser) => set({ selectedUser }),

  subscribeToMessages: ()=>{
    const {selectedUser} = get();
    if(!selectedUser) return;

    const socket = useAuthStore.getState().socket

    socket.on("newMessage", (newMessage)=>{
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id
      if(!isMessageSentFromSelectedUser) return;
      set({
        messages:[...get().messages, newMessage]
      })
    })
  },

  unsubscribeFromMessagaes : ()=>{
    const socket = useAuthStore.getState().socket
    socket.off("newMessage")
  }
}));
