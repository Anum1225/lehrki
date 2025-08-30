import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare, Heart, Reply, Plus, Search, Filter } from 'lucide-react';

const CommunityForum = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Topics', count: 156 },
    { id: 'teaching-tips', label: 'Teaching Tips', count: 42 },
    { id: 'technology', label: 'Educational Technology', count: 38 },
    { id: 'assessment', label: 'Assessment Strategies', count: 31 },
    { id: 'classroom-management', label: 'Classroom Management', count: 25 },
    { id: 'ai-tools', label: 'AI in Education', count: 20 }
  ];

  const posts = [
    {
      id: 1,
      title: "How do you integrate AI tools into your daily teaching routine?",
      author: "Sarah Mitchell",
      authorRole: "High School Teacher",
      category: "ai-tools",
      replies: 23,
      likes: 45,
      timeAgo: "2 hours ago",
      excerpt: "I've been experimenting with AI-powered quiz generation and would love to hear about your experiences...",
      isHot: true
    },
    {
      id: 2,
      title: "Best practices for remote student engagement",
      author: "Michael Chen",
      authorRole: "University Professor",
      category: "teaching-tips",
      replies: 18,
      likes: 32,
      timeAgo: "5 hours ago",
      excerpt: "After teaching online for two years, here are some strategies that have worked well for maintaining student engagement...",
      isHot: false
    },
    {
      id: 3,
      title: "Creating inclusive assessment methods",
      author: "Emma Rodriguez",
      authorRole: "Elementary Teacher",
      category: "assessment",
      replies: 15,
      likes: 28,
      timeAgo: "1 day ago",
      excerpt: "Looking for ways to make assessments more accessible and fair for all students, especially those with learning differences...",
      isHot: false
    },
    {
      id: 4,
      title: "Classroom technology setup on a budget",
      author: "David Kim",
      authorRole: "Middle School Teacher",
      category: "technology",
      replies: 31,
      likes: 67,
      timeAgo: "2 days ago",
      excerpt: "Share your tips for creating an engaging tech-enabled classroom without breaking the budget...",
      isHot: true
    }
  ];

  const featuredDiscussions = [
    {
      title: "Weekly Challenge: Creative Math Problems",
      participants: 124,
      status: "ongoing"
    },
    {
      title: "Resource Sharing: Free Educational Tools",
      participants: 89,
      status: "pinned"
    }
  ];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-primary-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Community Forum</h1>
                <p className="text-gray-600">Connect, share, and learn with educators worldwide</p>
              </div>
            </div>
            <button className="btn-primary flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Search */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search discussions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        activeCategory === category.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{category.label}</span>
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                          {category.count}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Featured Discussions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Featured</h3>
                <div className="space-y-3">
                  {featuredDiscussions.map((discussion, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">{discussion.title}</h4>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{discussion.participants} participants</span>
                        <span className={`px-2 py-1 rounded-full ${
                          discussion.status === 'ongoing' 
                            ? 'bg-green-100 text-green-600'
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          {discussion.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Filters */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-700">Sort by:</span>
                    <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-primary-500 focus:border-primary-500">
                      <option>Most Recent</option>
                      <option>Most Popular</option>
                      <option>Most Replies</option>
                    </select>
                  </div>
                  <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                    <Filter className="w-4 h-4 mr-1" />
                    Filter
                  </button>
                </div>
              </div>

              {/* Posts */}
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    whileHover={{ y: -2 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-primary-600 font-semibold text-sm">
                            {post.author.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{post.author}</h3>
                          <p className="text-sm text-gray-500">{post.authorRole}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {post.isHot && (
                          <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-medium mr-2">
                            🔥 Hot
                          </span>
                        )}
                        <span className="text-sm text-gray-500">{post.timeAgo}</span>
                      </div>
                    </div>

                    <h2 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 cursor-pointer">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <button className="flex items-center text-gray-500 hover:text-primary-600 transition-colors">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          <span className="text-sm">{post.replies} replies</span>
                        </button>
                        <button className="flex items-center text-gray-500 hover:text-red-600 transition-colors">
                          <Heart className="w-4 h-4 mr-1" />
                          <span className="text-sm">{post.likes} likes</span>
                        </button>
                        <button className="flex items-center text-gray-500 hover:text-primary-600 transition-colors">
                          <Reply className="w-4 h-4 mr-1" />
                          <span className="text-sm">Reply</span>
                        </button>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {categories.find(cat => cat.id === post.category)?.label}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-8">
                <button className="btn-secondary">Load More Posts</button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CommunityForum;