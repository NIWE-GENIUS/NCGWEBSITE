// src/pages/collaboration/Community.jsx
import { Network, Users, Mic, MessageCircle, Calendar, Heart } from 'lucide-react';
import CollaborationHero from '../../components/shared/CollaborationHero';
import CTABox from '../../components/shared/CTABox';

const AREAS = [
  { Icon: Users, title: 'Tech Meetups', desc: 'Host and support community gatherings for developers and innovators.' },
  { Icon: Mic, title: 'Speaker Series', desc: 'Bring expert talks and knowledge-sharing events to the community.' },
  { Icon: MessageCircle, title: 'Study Groups', desc: 'Facilitate peer learning groups around technology topics.' },
  { Icon: Calendar, title: 'Events', desc: 'Collaborate on hackathons, workshops, and technology events.' },
  { Icon: Heart, title: 'Volunteer Programs', desc: 'Channel community energy into meaningful volunteer contributions.' },
  { Icon: Network, title: 'Ecosystem Building', desc: 'Strengthen Rwanda\'s technology and innovation community.' },
];

export default function Community() {
  return (
    <>
      <CollaborationHero
        tag="Community Collaboration"
        titleStart="Build Community"
        titleHighlight="Together"
        titleEnd=""
        subtitle="Engage with tech communities, developer groups, and grassroots initiatives."
        IconComponent={Network}
        primaryCTA={{ to: '/register', label: 'Join Us' }}
        secondaryCTA={{ to: '/contact', label: 'Contact Us' }}
      />

      <section className="section bg-white">
        <div className="container-ncg">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#031B2A] mb-4">
              Community <span className="text-[#8BCB2A]">Initiatives</span>
            </h2>
            <p className="text-[#6D7E89] text-lg">
              Communities are where technology meets purpose. We help build and support them.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AREAS.map(({ Icon, title, desc }, i) => (
              <div key={i} className="bg-white border border-[#EDF2F5] rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#8BCB2A]/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#8BCB2A]" />
                </div>
                <h3 className="font-heading font-semibold text-base text-[#031B2A] mb-2">{title}</h3>
                <p className="text-sm text-[#6D7E89] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABox
        tag="Join the Community"
        title="Be Part of the"
        highlight="NCG Ecosystem"
        subtitle="Connect with innovators, developers, and entrepreneurs across Rwanda."
        primary={{ to: '/register', label: 'Join Us' }}
        secondary={{ to: '/contact', label: 'Contact Us' }}
      />
    </>
  );
}