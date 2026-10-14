import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Calendar, Tag, ArrowRight } from 'lucide-react';
import api from '../lib/api';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/blog?limit=20')
      .then((res) => setPosts(res.data || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="section bg-[#F5F9FB]">
      <div className="container-ncg">
        <div className="text-center mb-12">
          <h1 className="section-title">Blog & Insights</h1>
          <p className="section-subtitle">News, tutorials, and insights from NCG.</p>
        </div>
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-[#8BCB2A] animate-spin" /></div>
        ) : posts.length === 0 ? (
          <div className="bg-white border border-[#EDF2F5] rounded-2xl p-12 text-center">
            <p className="text-[#6D7E89]">No blog posts yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p) => (
              <Link key={p.id} to={`/blog/${p.slug}`} className="group bg-white border border-[#EDF2F5] rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all">
                {p.featuredImage && (
                  <div className="h-48 bg-[#F5F9FB] overflow-hidden">
                    <img src={p.featuredImage} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-heading font-bold text-lg text-[#031B2A] mb-2 group-hover:text-[#064B7A]">{p.title}</h3>
                  <p className="text-sm text-[#6D7E89] mb-4 line-clamp-2">{p.excerpt}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#064B7A]">Read More <ArrowRight className="w-4 h-4" /></span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}