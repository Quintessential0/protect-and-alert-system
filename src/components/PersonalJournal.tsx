
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PenTool, Plus, Edit3, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JournalEntry {
  id: string;
  title: string | null;
  content: string;
  mood_rating: number | null;
  created_at: string;
  updated_at: string;
}

const PersonalJournal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood_rating: 5
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      toast({
        title: "Error",
        description: "Failed to load journal entries. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveEntry = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const entryData = {
        title: formData.title || null,
        content: formData.content,
        mood_rating: formData.mood_rating,
        user_id: user.id
      };

      if (editingEntry) {
        const { error } = await supabase
          .from('journal_entries')
          .update({ ...entryData, updated_at: new Date().toISOString() })
          .eq('id', editingEntry.id);

        if (error) throw error;
        toast({
          title: "Entry Updated",
          description: "Your journal entry has been updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from('journal_entries')
          .insert(entryData);

        if (error) throw error;
        toast({
          title: "Entry Saved",
          description: "Your journal entry has been saved successfully.",
        });
      }

      setFormData({ title: '', content: '', mood_rating: 5 });
      setShowForm(false);
      setEditingEntry(null);
      fetchEntries();
    } catch (error) {
      console.error('Error saving entry:', error);
      toast({
        title: "Error",
        description: "Failed to save journal entry. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteEntry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Entry Deleted",
        description: "Your journal entry has been deleted.",
      });
      
      fetchEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast({
        title: "Error",
        description: "Failed to delete journal entry. Please try again.",
        variant: "destructive",
      });
    }
  };

  const startEditing = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setFormData({
      title: entry.title || '',
      content: entry.content,
      mood_rating: entry.mood_rating || 5
    });
    setShowForm(true);
  };

  const cancelEditing = () => {
    setEditingEntry(null);
    setFormData({ title: '', content: '', mood_rating: 5 });
    setShowForm(false);
  };

  const getMoodEmoji = (rating: number | null) => {
    if (!rating) return '😐';
    if (rating <= 2) return '😢';
    if (rating <= 4) return '😕';
    if (rating <= 6) return '😐';
    if (rating <= 8) return '🙂';
    return '😊';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with New Entry Button */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Personal Journal</h3>
            <p className="text-gray-600">A safe space for your thoughts and feelings</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Entry</span>
          </button>
        </div>
      </div>

      {/* Journal Entry Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingEntry ? 'Edit Entry' : 'New Journal Entry'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title (optional)
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Give your entry a title..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How are you feeling? (1-10)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.mood_rating}
                  onChange={(e) => setFormData({ ...formData, mood_rating: parseInt(e.target.value) })}
                  className="flex-1"
                />
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getMoodEmoji(formData.mood_rating)}</span>
                  <span className="text-sm font-medium">{formData.mood_rating}/10</span>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your thoughts
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Write about your day, your feelings, your thoughts..."
                required
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={saveEntry}
                disabled={!formData.content.trim()}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>{editingEntry ? 'Update' : 'Save'} Entry</span>
              </button>
              
              <button
                onClick={cancelEditing}
                className="flex items-center space-x-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Journal Entries */}
      <div className="space-y-4">
        {entries.map((entry) => (
          <div key={entry.id} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                {entry.mood_rating && (
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getMoodEmoji(entry.mood_rating)}</span>
                    <span className="text-sm text-gray-500">{entry.mood_rating}/10</span>
                  </div>
                )}
                <div>
                  {entry.title && (
                    <h3 className="font-semibold text-gray-900">{entry.title}</h3>
                  )}
                  <p className="text-sm text-gray-500">
                    {new Date(entry.created_at).toLocaleDateString()} at{' '}
                    {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => startEditing(entry)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="text-gray-700 whitespace-pre-wrap">
              {entry.content}
            </div>
          </div>
        ))}
      </div>

      {entries.length === 0 && !showForm && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <PenTool className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Your Journal</h3>
          <p className="text-gray-600 mb-4">
            Begin documenting your thoughts, feelings, and experiences in your private journal.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Write Your First Entry</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PersonalJournal;
