import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { Post } from '../types';
import { Calendar, User, Heart, MessageCircle, Tag, ArrowLeft } from 'lucide-react';
import './PostDetail.css';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPost(parseInt(id));
    }
  }, [id]);

  const fetchPost = async (postId: number) => {
    try {
      setIsLoading(true);
      const response = await postsAPI.getPostById(postId);
      setPost(response.data.post);
    } catch (err: any) {
      setError('Post not found or failed to load');
      console.error('Error fetching post:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikePost = async () => {
    if (!post || isLiking) return;

    try {
      setIsLiking(true);
      await postsAPI.likePost(post.id);
      setPost({ ...post, likes: (post.likes || 0) + 1 });
    } catch (err: any) {
      console.error('Error liking post:', err);
      alert('Failed to like post. Please try again.');
    } finally {
      setIsLiking(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="post-detail-container">
        <div className="loading-spinner">Loading post...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="post-detail-container">
        <div className="error-container">
          <div className="error-message">{error}</div>
          <Link to="/" className="back-home-btn">
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="post-detail-container">
      <div className="post-navigation">
        <Link to="/" className="back-btn">
          <ArrowLeft size={18} />
          Back to Posts
        </Link>
      </div>

      <article className="post-detail-card">
        <header className="post-header">
          <h1 className="post-title">{post.title}</h1>
          
          <div className="post-meta">
            <div className="author-info">
              <User size={20} />
              <div className="author-details">
                <span className="author-name">{post.author?.username || 'Unknown'}</span>
                <span className="post-date">{formatDate(post.createdAt || post.created_at)}</span>
              </div>
            </div>
            
            <div className="post-stats">
              <div className="stat">
                <Heart size={18} />
                <span>{post.likes || 0}</span>
              </div>
              
              <div className="stat">
                <MessageCircle size={18} />
                <span>{post.comments || 0}</span>
              </div>
            </div>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="post-tags">
              <Tag size={16} />
              <div className="tags-list">
                {post.tags.map((tag: string, index: number) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </header>

        <div className="post-content">
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <footer className="post-footer">
          <div className="post-actions">
            {true ? ( // Always show like button since no auth
              <button
                onClick={handleLikePost}
                className={`like-btn ${isLiking ? 'liking' : ''}`}
                disabled={isLiking}
              >
                <Heart size={18} />
                {isLiking ? 'Liking...' : 'Like Post'}
              </button>
            ) : (
              <Link to="/login" className="login-to-like">
                <Heart size={18} />
                Login to Like
              </Link>
            )}

            <div className="share-info">
              <small>Published on {formatDate(post.createdAt || post.created_at)}</small>
              {(post.updatedAt || post.updated_at) !== (post.createdAt || post.created_at) && (
                <small>Updated on {formatDate(post.updatedAt || post.updated_at)}</small>
              )}
            </div>
          </div>

          {false && ( // Hide edit controls since no auth system
            <div className="author-actions">
              <Link to={`/edit-post/${post?.id}`} className="edit-post-btn">
                Edit Post
              </Link>
            </div>
          )}
        </footer>
      </article>

      <div className="comments-section">
        <h3>Comments ({post.comments || 0})</h3>
        <div className="comments-placeholder">
          <p>Comments functionality coming soon!</p>
          <small>In the meantime, you can like posts and share your thoughts by creating your own posts.</small>
        </div>
      </div>

      <div className="related-posts">
        <h3>More Posts</h3>
        <div className="related-posts-placeholder">
          <Link to="/" className="view-all-posts">
            View All Posts
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;