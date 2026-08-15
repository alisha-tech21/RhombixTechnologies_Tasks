import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Send, ArrowLeft, MoreVertical } from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import api from "../../services/api";
import socket from "../../services/socket";
import { useAuth } from "../../context/AuthContext";
import { getAvatarUrl } from "../../utils/avatar";
import "../../styles/messages.css";

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const units = [
    ["d", 86400],
    ["h", 3600],
    ["m", 60],
  ];
  for (const [label, secs] of units) {
    const val = Math.floor(seconds / secs);
    if (val >= 1) return `${val}${label}`;
  }
  return "now";
}

export default function Messages() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState(new Set());
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  const messagesEndRef = useRef(null);

  // Load conversation list
  useEffect(() => {
    loadConversations();
  }, []);

  // If arriving via ?user=<id> (from a profile "Message" button), start/open that conversation
  useEffect(() => {
    const startUserId = searchParams.get("user");
    if (startUserId) {
      api.post(`/messages/conversations/${startUserId}`).then((res) => {
        openConversation(res.data.conversation);
        loadConversations();
      });
    }
  }, [searchParams]);
  const filteredConversations = conversations.filter((conv) =>
    conv.otherUser.name.toLowerCase().includes(searchText.toLowerCase()),
  );
  // Real-time incoming messages
  // Real-time incoming messages
  useEffect(() => {
    const handleNewMessage = async (data) => {
      const isViewingThisChat =
        activeConv && data.conversationId === activeConv._id;

      if (isViewingThisChat) {
        setMessages((prev) => [...prev, data.message]);
        // I'm actively looking at this chat — mark it read immediately so no unread badge appears
        try {
          await api.put(`/messages/${data.conversationId}/read`);
        } catch {
          // non-critical, ignore
        }
      }

      loadConversations();
      window.dispatchEvent(new Event("messages-count-refresh"));
    };

    socket.on("new_message", handleNewMessage);
    return () => socket.off("new_message", handleNewMessage);
  }, [activeConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    socket.emit("get_online_users", (ids) => setOnlineUserIds(new Set(ids)));

    const handleStatus = ({ userId, online }) => {
      setOnlineUserIds((prev) => {
        const next = new Set(prev);
        online ? next.add(userId) : next.delete(userId);
        return next;
      });
    };

    socket.on("user_status", handleStatus);
    return () => socket.off("user_status", handleStatus);
  }, []);
  const loadConversations = async () => {
    try {
      const res = await api.get("/messages/conversations");
      setConversations(res.data.conversations);
    } finally {
      setLoadingConvs(false);
    }
  };

  const openConversation = async (conv) => {
    const otherUser = conv.participants
      ? conv.participants.find((p) => p._id !== user._id)
      : conv.otherUser;

    setActiveConv({ _id: conv._id, otherUser });
    setShowChatOnMobile(true);
    setShowChatMenu(false);
    setLoadingMsgs(true);

    try {
      const res = await api.get(`/messages/${conv._id}`);
      setMessages(res.data.messages);
      loadConversations();
      window.dispatchEvent(new Event("messages-count-refresh"));
    } finally {
      setLoadingMsgs(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeConv) return;

    const currentText = text;
    setText("");
    try {
      const res = await api.post(`/messages/${activeConv._id}`, {
        text: currentText,
      });

      // If the server had to create a fresh conversation (because the recipient
      // deleted the old one), switch to it — otherwise the next message would
      // hit the old, deleted conversation again and create yet another duplicate.
      if (
        res.data.conversationId &&
        res.data.conversationId !== activeConv._id
      ) {
        setActiveConv((prev) => ({ ...prev, _id: res.data.conversationId }));
      }

      setMessages((prev) => [...prev, res.data.message]);
      loadConversations();
    } catch {
      setText(currentText);
    }
  };
  const handleDeleteConversation = async () => {
    if (!activeConv) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this conversation?",
    );

    if (!confirmed) return;

    try {
      await api.delete(`/messages/conversations/${activeConv._id}`);

      setConversations((prev) =>
        prev.filter((conv) => conv._id !== activeConv._id),
      );

      setActiveConv(null);
      setMessages([]);
      setShowChatMenu(false);
      setShowChatOnMobile(false);
    } catch (error) {
      console.error("Delete conversation error:", error);
    }
  };
  const handleDeleteMessage = async (messageId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?",
    );

    if (!confirmed) return;

    try {
      await api.delete(`/messages/${messageId}`);

      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));

      loadConversations();
    } catch (error) {
      console.error("Delete message error:", error);
    }
  };

  return (
    <MainLayout hideRightSidebar>
      <div className="messages-shell">
        {/* ---------- Conversation list ---------- */}
        <div
          className={`conversations-panel ${showChatOnMobile ? "hide-on-mobile" : ""}`}
        >
          <div className="conversations-header">
            <div className="conversations-title">
              <h2>Chats</h2>
              <button className="new-chat-btn" title="New message">
                ✎
              </button>
            </div>

            <div className="conversation-search">
              <span>⌕</span>
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>

          {loadingConvs ? (
            <p className="friends-empty-state">Loading...</p>
          ) : conversations.length === 0 ? (
            <p className="friends-empty-state">
              No conversations yet. Visit a friend's profile and click "Message"
              to start one.
            </p>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv._id}
                className={`conversation-item ${activeConv?._id === conv._id ? "active" : ""}`}
                onClick={() => openConversation(conv)}
              >
                <img
                  src={getAvatarUrl(
                    conv.otherUser.profilePicture,
                    conv.otherUser.name,
                  )}
                  alt={conv.otherUser.name}
                />
                <div className="conversation-item-info">
                  <p className="conversation-name">{conv.otherUser.name}</p>
                  <p className="conversation-preview">
                    {conv.lastMessage?.text || "Say hello 👋"}
                  </p>
                </div>
                <div className="conversation-meta">
                  {conv.lastMessageAt && (
                    <span className="conversation-time">
                      {timeAgo(conv.lastMessageAt)}
                    </span>
                  )}
                  {conv.unreadCount > 0 && (
                    <span className="conversation-unread-badge">
                      {conv.unreadCount}
                    </span>
                  )}
                  <button
                    className="conversation-delete-btn"
                    title="Delete conversation"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteConversation(conv._id);
                    }}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ---------- Active chat window ---------- */}
        <div
          className={`chat-panel ${!showChatOnMobile ? "hide-on-mobile" : ""}`}
        >
          {!activeConv ? (
            <div className="chat-empty-state">
              <p>Select a conversation to start chatting</p>
            </div>
          ) : (
            <>
              <div className="chat-header">
                <button
                  className="chat-back-btn"
                  onClick={() => setShowChatOnMobile(false)}
                >
                  <ArrowLeft size={18} />
                </button>

                <img
                  src={getAvatarUrl(
                    activeConv.otherUser.profilePicture,
                    activeConv.otherUser.name,
                  )}
                  alt={activeConv.otherUser.name}
                  onClick={() =>
                    navigate(`/profile/${activeConv.otherUser._id}`)
                  }
                />

                <div className="chat-header-user">
                  <p
                    className="chat-header-name"
                    onClick={() =>
                      navigate(`/profile/${activeConv.otherUser._id}`)
                    }
                  >
                    {activeConv.otherUser.name}
                  </p>

                  <span
                    className={`chat-status ${
                      onlineUserIds.has(activeConv.otherUser._id)
                        ? "online"
                        : ""
                    }`}
                  >
                    {onlineUserIds.has(activeConv.otherUser._id)
                      ? "Online"
                      : "Offline"}
                  </span>
                </div>

                {/* Three dots menu */}
                <div className="chat-header-menu">
                  <button
                    className="chat-menu-btn"
                    onClick={() => setShowChatMenu((prev) => !prev)}
                    aria-label="Chat options"
                  >
                    <MoreVertical size={20} />
                  </button>

                  {showChatMenu && (
                    <div className="chat-menu-dropdown">
                      <button
                        className="chat-menu-delete"
                        onClick={handleDeleteConversation}
                      >
                        Delete conversation
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="chat-messages">
                {loadingMsgs ? (
                  <p className="friends-empty-state">Loading messages...</p>
                ) : messages.length === 0 ? (
                  <p className="friends-empty-state">
                    No messages yet. Say hi!
                  </p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`chat-bubble-row ${msg.sender._id === user._id ? "mine" : "theirs"}`}
                    >
                      <div className="chat-bubble-wrapper">
                        <div className="chat-bubble">
                          <p>{msg.text}</p>

                          <span className="chat-bubble-time">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        {msg.sender._id === user._id && (
                          <button
                            className="message-delete-btn"
                            title="Delete message"
                            onClick={() => handleDeleteMessage(msg._id)}
                          >
                            🗑
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <form className="chat-input-form" onSubmit={handleSend}>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <button type="submit">
                  <Send size={16} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
