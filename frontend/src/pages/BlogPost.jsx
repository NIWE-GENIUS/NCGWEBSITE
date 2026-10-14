import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import api from '../lib/api';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/blog/slug/${slug}`)
      .then((res) => setPost(res.data))
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 text-[#8BCB2A] animate-spin" /></div>;
  if (!post) return <div className="section container-ncg text-center"><p>Post not found</p><Link to="/blog" className="btn-primary mt-4 inline-flex">Back to Blog</Link></div>;

  return (
    <article className="section bg-white">
      <div className="container-ncg max-w-3xl">
        <Link to="/blog" className="inline-flex items-center gap-2 text-[#064B7A] hover:text-[#8BCB2A] mb-6"><ArrowLeft className="w-4 h-4" /> Back to Blog</Link>
        {post.featuredImage && <img src={post.featuredImage} alt={post.title} className="w-full h-auto rounded-2xl mb-8" />}
        <h1 className="text-3xl md:text-5xl font-heading font-bold text-[#031B2A] mb-4">{post.title}</h1>
        <p className="text-lg text-[#6D7E89] mb-8">{post.excerpt}</p>
        <div className="text-[#163247] leading-relaxed whitespace-pre-wrap">{post.content}</div>
      </div>
    </article>
  );
}