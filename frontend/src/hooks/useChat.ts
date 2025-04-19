import {useContext} from 'react';
import ChatContext from "@/context/chat.context";

const useChat = () => useContext(ChatContext);

export default useChat;