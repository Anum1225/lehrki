import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Heart, Reply, Send, MessageSquare, ThumbsUp } from 'lucide-react';

const PostDetailModal = ({ isOpen, onClose, post, onReply }) => {
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState([
    {
      id: 1,
      author: 'John Teacher',
      content: 'Great question! I\'ve been using AI tools for about 6 months now and the key is to start small.',
      timeAgo: '1 hour ago',
      likes: 5
    },
    {
      id: 2,
      author: 'Maria Santos',
      content: 'I agree with John. Also, make sure to always review AI-generated content before using it with students.',
      timeAgo: '45 minutes ago',
      likes: 3
    }
  ]);

  const handleSubmitReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newReply = {
      id: Date.now(),
      author: 'You',
      content: replyText,
      timeAgo: 'just now',
      likes: 0
    };

    setReplies([...replies, newReply]);
    setReplyText('');
    onReply(newReply);
  };

  const handleLikeReply = (replyId) => {
    setReplies(replies.map(reply => 
      reply.id === replyId 
        ? { ...reply, likes: reply.likes + 1 }
        : reply
    ));
  };

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-primary-600 font-semibold">
                {post.author.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{post.author}</h3>
              <p className="text-sm text-gray-500">{post.authorRole} • {post.timeAgo}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Post Content */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div className="prose max-w-none text-gray-700">
            <p>{post.excerpt}</p>
            <p className="mt-4">
              This is the full content of the post. In a real implementation, this would contain 
              the complete post content with proper formatting, images, and other media.
            </p>
            <p className="mt-4">
              The AI tools I've been experimenting with include automated quiz generation, 
              personalized feedback systems, and adaptive learning paths. The key is to maintain 
              the human element while leveraging AI to enhance the learning experience.
            </p>
          </div>
          
          {/* Post Actions */}
          <div className="flex items-center space-x-6 mt-6 pt-4 border-t border-gray-100">
            <button className="flex items-center text-gray-500 hover:text-red-600 transition-colors">
              <Heart className="w-5 h-5 mr-2" />
              <span>{post.likes} likes</span>
            </button>
            <button className="flex items-center text-gray-500 hover:text-primary-600 transition-colors">
              <MessageSquare className="w-5 h-5 mr-2" />
              <span>{replies.length} replies</span>
            </button>
            <button className="flex items-center text-gray-500 hover:text-primary-600 transition-colors">
              <Reply className="w-5 h-5 mr-2" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Replies Section */}
        <div className="flex-1 overflow-y-auto max-h-96">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Replies ({replies.length})
            </h3>
            
            <div className="space-y-4 mb-6">
              {replies.map((reply) => (
                <motion.div
                  key={reply.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-primary-600 font-semibold text-sm">
                          {reply.author.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{reply.author}</h4>
                        <p className="text-sm text-gray-500">{reply.timeAgo}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleLikeReply(reply.id)}
                      className="flex items-center text-gray-500 hover:text-primary-600 transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      <span className="text-sm">{reply.likes}</span>
                    </button>
                  </div>
                  <p className="text-gray-700 ml-11">{reply.content}</p>
                </motion.div>
              ))}
            </div>

            {/* Reply Form */}
            <form onSubmit={handleSubmitReply} className="border-t border-gray-200 pt-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold text-sm">You</span>
                </div>
                <div className="flex-1">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write your reply..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    rows="3"
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      type="submit"
                      disabled={!replyText.trim()}
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Post Reply
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PostDetailModal;