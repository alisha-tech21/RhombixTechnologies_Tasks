import { useState } from "react";
import { Image as ImageIcon, Video } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getAvatarUrl } from "../../utils/avatar";
import CreatePostModal from "./CreatePostModal";
import "../../styles/posts.css";

export default function CreatePostBox({ onPostCreated }) {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="create-post-box">
        <div className="create-post-trigger-row">
          <img
            className="create-post-avatar"
            src={getAvatarUrl(user?.profilePicture, user?.name)}
            alt={user?.name}
          />
          <button
            className="create-post-trigger"
            onClick={() => setModalOpen(true)}
          >
            What's on your mind, {user?.name?.split(" ")[0]}?
          </button>
        </div>

        <div className="create-post-bottom">
          <div className="create-post-tools">
            <button onClick={() => setModalOpen(true)}>
              <ImageIcon size={17} />
              Photo
            </button>
            <button onClick={() => setModalOpen(true)}>
              <Video size={17} />
              Video
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <CreatePostModal
          onClose={() => setModalOpen(false)}
          onPostCreated={onPostCreated}
        />
      )}
    </>
  );
}
