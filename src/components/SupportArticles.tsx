
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BookOpen, Star, Tag, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  is_featured: boolean;
  created_at: string;
}

const SupportArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { toast } = useToast();

  const categories = ['all', 'motivation', 'healing', 'empowerment', 'coping'];

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('support_articles')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast({
        title: "Error",
        description: "Failed to load articles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

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

  if (selectedArticle) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <button
          onClick={() => setSelectedArticle(null)}
          className="text-pink-600 hover:text-pink-700 mb-4 flex items-center"
        >
          ← Back to Articles
        </button>
        
        <article className="prose max-w-none">
          <div className="flex items-center space-x-2 mb-4">
            {selectedArticle.is_featured && (
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
            )}
            <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
              {selectedArticle.category}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {selectedArticle.title}
          </h1>
          
          <div className="flex items-center text-gray-500 text-sm mb-6">
            <span>By {selectedArticle.author}</span>
            <span className="mx-2">•</span>
            <Clock className="w-4 h-4 mr-1" />
            <span>{new Date(selectedArticle.created_at).toLocaleDateString()}</span>
          </div>
          
          <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {selectedArticle.content}
          </div>
          
          {selectedArticle.tags.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4 text-gray-500" />
                <div className="flex flex-wrap gap-2">
                  {selectedArticle.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </article>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                selectedCategory === category
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid gap-6">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => setSelectedArticle(article)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                {article.is_featured && (
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                )}
                <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                  {article.category}
                </span>
              </div>
              <BookOpen className="w-5 h-5 text-gray-400" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {article.title}
            </h3>
            
            <p className="text-gray-600 mb-4 line-clamp-3">
              {article.excerpt}
            </p>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>By {article.author}</span>
              <span>{new Date(article.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Articles Found</h3>
          <p className="text-gray-600">
            {selectedCategory === 'all' 
              ? 'No articles are available at the moment.' 
              : `No articles found in the ${selectedCategory} category.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default SupportArticles;
