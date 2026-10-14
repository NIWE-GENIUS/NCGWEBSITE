import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, ArrowLeft, Mail, MapPin } from 'lucide-react';
import api from '../lib/api';

export default function TeamMemberDetail() {
  const { slug } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/team/slug/${slug}`)
      .then((res) => setMember(res.data))
      .catch(() => setMember(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 text-[#8BCB2A] animate-spin" /></div>;
  if (!member) return <div className="section container-ncg text-center"><p>Member not found</p></div>;

  return (
    <div className="section bg-[#F5F9FB]">
      <div className="container-ncg max-w-3xl">
        <Link to="/team" className="inline-flex items-center gap-2 text-[#064B7A] hover:text-[#8BCB2A] mb-6"><ArrowLeft className="w-4 h-4" /> Back to Team</Link>
        <div className="bg-white border border-[#EDF2F5] rounded-2xl p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-[#064B7A] to-[#8BCB2A] flex items-center justify-center text-white font-bold text-4xl flex-shrink-0">
              {member.profileImageUrl ? <img src={member.profileImageUrl} alt={member.fullName} className="w-full h-full object-cover" /> : member.fullName?.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-heading font-bold text-[#031B2A] mb-1">{member.fullName}</h1>
              <p className="text-lg text-[#064B7A] font-semibold mb-3">{member.position}</p>
              {member.location && <p className="flex items-center gap-2 text-sm text-[#6D7E89] mb-2"><MapPin className="w-4 h-4" /> {member.location}</p>}
              {member.email && <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-sm text-[#064B7A] hover:underline"><Mail className="w-4 h-4" /> {member.email}</a>}
            </div>
          </div>
          {member.bioFull && <div className="mt-6 text-[#163247] leading-relaxed whitespace-pre-wrap">{member.bioFull}</div>}
        </div>
      </div>
    </div>
  );
}