import React, { useState, useEffect, useRef } from "react";
import "./Chats.css";
import ThemeService from "../themes/ThemeService";
import SenderMessage from "../cards/SendMessage";
import MessageModel from "../models/MessageModel";
import LoadLocalSettings from "../providers/LoadLocalSettings";
import { handleOutgoingChat, reLoadLastChat } from "../providers/ChatHandler";
import GetLinkDetails from "../providers/LinkInfo"; 

// dummy page to route the link from iOS app

const Link: React.FC = () => {
  return null;
};

export default Link;
