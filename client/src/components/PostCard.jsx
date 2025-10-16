import React, { useState } from "react";
import {
  BadgeCheck,
  Heart,
  MessageCircle,
  Share2,
  ThumbsUp,
  Laugh,
  Lightbulb,
  PartyPopper,
} from "lucide-react";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";
import { dummyUserData } from "../assets/assets";
import { useNavigate } from "react-router-dom";

// Define all available reactions
const reactionsList = [
  { type: "like", icon: <ThumbsUp className="text-blue-500" />, label: "Like" },
  { type: "love", icon: <Heart className="text-red-500 fill-red-500" />, label: "Love" },
  { type: "celebrate", icon: <PartyPopper className="text-yellow-500" />, label: "Celebrate" },
  { type: "insightful", icon: <Lightbulb className="text-orange-500" />, label: "Insightful" },
  { type: "funny", icon: <Laugh className="text-yellow-400" />, label: "Funny" },
];

const PostCard = ({ post }) => {
  const postWithHashtags = post.content.replace(
    /(#\w+)/g,
    '<span class="text-blue-400">$1</span>'
  );

  const currentUser = dummyUserData;

  // Initialize all reactions count
  const [reactionCounts, setReactionCounts] = useState({
    like: 3,
    love: 2,
    celebrate: 1,
    insightful: 0,
    funny: 0,
  });

  const [userReaction, setUserReaction] = useState(null);
  const [showReactions, setShowReactions] = useState(false);

  const totalReactions = Object.values(reactionCounts).reduce((a, b) => a + b, 0);

  const handleReaction = (reactionType) => {
    setShowReactions(false);

    // If user already reacted with this same type — remove it (toggle off)
    if (userReaction === reactionType) {
      setReactionCounts((prev) => ({
        ...prev,
        [reactionType]: Math.max(0, prev[reactionType] - 1),
      }));
      setUserReaction(null);
      return;
    }

    // If user had a different previous reaction — switch it
    if (userReaction) {
      setReactionCounts((prev) => ({
        ...prev,
        [userReaction]: Math.max(0, prev[userReaction] - 1),
        [reactionType]: prev[reactionType] + 1,
      }));
    } else {
      // If user is reacting for the first time
      setReactionCounts((prev) => ({
        ...prev,
        [reactionType]: prev[reactionType] + 1,
      }));
    }

    setUserReaction(reactionType);
  };

  const selectedReaction =
    reactionsList.find((r) => r.type === userReaction) || null;

    const navigate = useNavigate()

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl">
      {/* User Info */}
      <div onClick={()=>navigate('/profile/' + post.user._id)} className="inline-flex items-center gap-3 cursor-pointer">
        <img
          src={post.user.profile_picture}
          alt=""
          className="w-10 h-10 rounded-full shadow"
        />
        <div>
          <div className="flex items-center space-x-1">
            <span>{post.user.full_name}</span>
            <BadgeCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-gray-500 text-sm">
            @{post.user.username} · {moment(post.createdAt).fromNow()}
          </div>
        </div>
      </div>

      {/* Post Content */}
      {post.content && (
        <div
          className="text-gray-800 text-sm whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: postWithHashtags }}
        />
      )}

      {/* Images */}
      <div className="grid grid-cols-2 gap-2">
        {post.image_urls.map((img, index) => (
          <img
            key={index}
            src={img}
            className={`w-full h-48 object-cover rounded-lg ${
              post.image_urls.length === 1 && "col-span-2 h-auto"
            }`}
            alt=""
          />
        ))}
      </div>

      {/* Reaction Summary */}
      {totalReactions > 0 && (
        <div className="flex items-center gap-3 pt-1 text-gray-400 text-sm">
          {/* Show small icons for all reaction types that have > 0 */}
          <div className="flex -space-x-1">
            {reactionsList
              .filter((r) => reactionCounts[r.type] > 0)
              .map((r) => (
                <span
                  key={r.type}
                  className="w-3 h-3 flex items-center justify-center bg-white rounded-full border shadow-sm"
                >
                  {r.icon}
                </span>
              ))}
          </div>
          <span className="text-indigo-700 text-xs">{totalReactions}</span>
        </div>
      )}

      {/* Reaction Buttons */}
      <div className="flex items-center gap-4 text-gray-600 text-sm pt-2 border-t border-gray-500 relative">
        {/* Like button (LinkedIn-style hover) */}
        <div
          className="relative flex items-center gap-1 cursor-pointer"
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={() => setShowReactions(false)}
        >
          <motion.div
            whileTap={{ scale: 0.85 }}
            className="flex items-center gap-1"
            onClick={() => handleReaction("like")}
          >
            {selectedReaction ? (
              <motion.div
                key={selectedReaction.type}
                initial={{ scale: 0 }}
                animate={{ scale: 1.2 }}
                transition={{ duration: 0.2 }}
              >
                {selectedReaction.icon}
              </motion.div>
            ) : (
              <ThumbsUp className="w-5 h-5" />
            )}
            <span className="capitalize">
              {selectedReaction ? selectedReaction.label : "Like"}
            </span>
          </motion.div>

          {/* Reaction Picker */}
          <AnimatePresence>
            {showReactions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-8 left-0 bg-white shadow-lg rounded-full px-3 py-2 flex gap-3 border border-gray-200 z-10"
              >
                {reactionsList.map((r) => (
                  <motion.div
                    key={r.type}
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                    className="cursor-pointer flex flex-col items-center"
                    onClick={() => handleReaction(r.type)}
                  >
                    {r.icon}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Comment */}
        <div className="flex items-center gap-1 cursor-pointer">
          <MessageCircle className="w-5 h-5" />
          <span>{12}</span>
        </div>

        {/* Share */}
        <div className="flex items-center gap-1 cursor-pointer">
          <Share2 className="w-5 h-5" />
          <span>{7}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
