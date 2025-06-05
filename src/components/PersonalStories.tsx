
import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, Share2, Plus, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const PersonalStories = () => {
  const [stories, setStories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newStory, setNewStory] = useState({
    title: '',
    content: '',
    story_type: 'survival',
    is_anonymous: false,
    author_name: '',
    tags: []
  });
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const { data, error } = await supabase
        .from('personal_stories')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStories(data || []);
    } catch (error) {
      console.error('Error fetching stories:', error);
      toast({
        title: "Error",
        description: "Failed to load stories.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('personal_stories')
        .insert({
          user_id: newStory.is_anonymous ? null : user.id,
          title: newStory.title,
          content: newStory.content,
          story_type: newStory.story_type,
          is_anonymous: newStory.is_anonymous,
          author_name: newStory.is_anonymous ? null : newStory.author_name,
          tags: newStory.tags,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Story Submitted",
        description: "Your story has been submitted for review and will be published once approved.",
      });

      setNewStory({
        title: '',
        content: '',
        story_type: 'survival',
        is_anonymous: false,
        author_name: '',
        tags: []
      });
      setShowForm(false);
      
      // Refresh stories to show any immediately approved ones
      fetchStories();
    } catch (error) {
      console.error('Error submitting story:', error);
      toast({
        title: "Error",
        description: "Failed to submit story.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLikeStory = async (storyId: string) => {
    if (!user) return;

    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('story_likes')
        .select('id')
        .eq('story_id', storyId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Unlike
        await supabase
          .from('story_likes')
          .delete()
          .eq('story_id', storyId)
          .eq('user_id', user.id);

        // Update count
        await supabase.rpc('decrement_story_likes', { story_id: storyId });
      } else {
        // Like
        await supabase
          .from('story_likes')
          .insert({
            story_id: storyId,
            user_id: user.id
          });

        // Update count
        await supabase.rpc('increment_story_likes', { story_id: storyId });
      }

      fetchStories();
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  const addTag = (tag: string) => {
    if (!newStory.tags.includes(tag)) {
      setNewStory({
        ...newStory,
        tags: [...newStory.tags, tag]
      });
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewStory({
      ...newStory,
      tags: newStory.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Personal Stories</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Share Your Story</span>
          </button>
        </div>

        {showForm && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-4">Share Your Story</h3>
            <form onSubmit={handleSubmitStory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Story Title
                </label>
                <input
                  type="text"
                  value={newStory.title}
                  onChange={(e) => setNewStory({...newStory, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Give your story a meaningful title"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Story Type
                  </label>
                  <select
                    value={newStory.story_type}
                    onChange={(e) => setNewStory({...newStory, story_type: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="survival">Survival Story</option>
                    <option value="recovery">Recovery Journey</option>
                    <option value="prevention">Prevention Tips</option>
                    <option value="support">Support & Help</option>
                    <option value="awareness">Awareness</option>
                  </select>
                </div>

                {!newStory.is_anonymous && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Author Name
                    </label>
                    <input
                      type="text"
                      value={newStory.author_name}
                      onChange={(e) => setNewStory({...newStory, author_name: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Your name or preferred name"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Story
                </label>
                <textarea
                  value={newStory.content}
                  onChange={(e) => setNewStory({...newStory, content: e.target.value})}
                  rows={6}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Share your experience, insights, or advice. Your story could help others..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (optional)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {['safety', 'awareness', 'support', 'recovery', 'prevention', 'community'].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addTag(tag)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                
                {newStory.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {newStory.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-purple-600 hover:text-purple-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={newStory.is_anonymous}
                  onChange={(e) => setNewStory({...newStory, is_anonymous: e.target.checked})}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="anonymous" className="flex items-center space-x-2 text-sm text-gray-700">
                  {newStory.is_anonymous ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>Share anonymously</span>
                </label>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Share Story'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-6">
          {stories.length > 0 ? (
            stories.map((story) => (
              <div key={story.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{story.title}</h3>
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-sm text-gray-600">
                        By {story.is_anonymous ? 'Anonymous' : (story.author_name || 'Community Member')}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium capitalize">
                        {story.story_type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed">{story.content}</p>

                {story.tags && story.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {story.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLikeStory(story.id)}
                      className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">{story.likes_count || 0}</span>
                    </button>
                    
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-sm">Support</span>
                    </button>
                    
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors">
                      <Share2 className="w-4 h-4" />
                      <span className="text-sm">Share</span>
                    </button>
                  </div>
                  
                  <span className="text-sm text-gray-500">
                    {new Date(story.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Stories Yet</h3>
              <p className="text-gray-600">Be the first to share your story and inspire others.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalStories;
