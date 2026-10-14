// frontend/src/pages/ProgramDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle, Clock, Users, Award, BookOpen,
  Sparkles, Loader2,
} from 'lucide-react';
import api from '../lib/api';

export default function ProgramDetail() {
  const { slug } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/programs/slug/${slug}`)
      .then((res) => setProgram(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F9FB]">
        <Loader2 className="w-10 h-10 text-[#8BCB2A] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="section container-ncg text-center">
        <p className="text-[#E74C3C] mb-4">{error}</p>
        <Link
          to="/programs"
          className="inline-flex items-center gap-2 bg-[#064B7A] text-white font-semibold px-6 py-3 rounded-md"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Programs
        </Link>
      </div>
    );
  }

  if (!program) return null;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#031B2A] via-[#062F4A] to-[#064B7A] text-white">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-[#8BCB2A] blur-[120px]" />
        </div>

        <div className="relative container-ncg py-16 md:py-24">
          <Link
            to="/programs"
            className="inline-flex items-center gap-2 text-white/70 hover:text-[#8BCB2A] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Programs
          </Link>

          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="inline-flex text-xs font-bold px-3 py-1 rounded-full bg-[#8BCB2A]/20 text-[#8BCB2A] capitalize">
                {program.category}
              </span>
              <span className="inline-flex text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-white capitalize">
                {program.format}
              </span>
              <span className="inline-flex text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-white capitalize">
                {program.level?.replace('_', ' ')}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-heading font-bold leading-[1.1] mb-4 text-white">
              {program.name}
            </h1>
            {program.tagline && (
              <p className="text-xl text-white/80 mb-8">{program.tagline}</p>
            )}

            {/* Quick facts */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-[#8BCB2A] flex-shrink-0" />
                <span>{program.duration || 'Flexible'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-[#8BCB2A] flex-shrink-0" />
                <span>{program.capacity || 'Open'} seats</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Award className="w-4 h-4 text-[#8BCB2A] flex-shrink-0" />
                <span>{program.certificateAvailable ? 'Certificate' : 'No certificate'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-[#8BCB2A]">
                {program.price > 0
                  ? `${Number(program.price).toLocaleString()} ${program.currency}`
                  : 'Free'}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                to={`/programs/${slug}/register`}
                className="inline-flex items-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-bold px-7 py-3.5 rounded-lg hover:bg-[#A8D94A] transition-all"
              >
                <Sparkles className="w-4 h-4" /> Apply Now
              </Link>
              <Link
                to="/contact?purpose=training"
                className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-white/10 transition-all"
              >
                Ask a Question
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="section bg-[#F5F9FB]">
        <div className="container-ncg">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main */}
            <div className="lg:col-span-2 space-y-6">
              {program.descriptionLong && (
                <div className="bg-white border border-[#EDF2F5] rounded-2xl p-7">
                  <h2 className="font-heading font-bold text-2xl text-[#031B2A] mb-4">
                    About this program
                  </h2>
                  <p className="text-[#163247] leading-relaxed whitespace-pre-line">
                    {program.descriptionLong}
                  </p>
                </div>
              )}

              {program.tracks?.length > 0 && (
                <div className="bg-white border border-[#EDF2F5] rounded-2xl p-7">
                  <h2 className="font-heading font-bold text-2xl text-[#031B2A] mb-5 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-[#8BCB2A]" /> Tracks
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {program.tracks.map((t) => (
                      <div
                        key={t.id}
                        className="p-5 rounded-xl bg-[#F5F9FB] border border-[#EDF2F5]"
                      >
                        <h3 className="font-heading font-semibold text-base text-[#031B2A] mb-1">
                          {t.name}
                        </h3>
                        <p className="text-sm text-[#6D7E89]">{t.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {program.outcomes?.length > 0 && (
                <div className="bg-white border border-[#EDF2F5] rounded-2xl p-7">
                  <h2 className="font-heading font-bold text-2xl text-[#031B2A] mb-5">
                    What You'll Learn
                  </h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {program.outcomes.map((o, i) => (
                      <li key={i} className="flex items-start gap-2 text-[#163247]">
                        <CheckCircle className="w-5 h-5 text-[#8BCB2A] flex-shrink-0 mt-0.5" />
                        <span>{o}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {program.requirements?.length > 0 && (
                <div className="bg-white border border-[#EDF2F5] rounded-2xl p-7">
                  <h2 className="font-heading font-bold text-2xl text-[#031B2A] mb-5">
                    Requirements
                  </h2>
                  <ul className="space-y-2">
                    {program.requirements.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-[#163247]">
                        <CheckCircle className="w-5 h-5 text-[#8BCB2A] flex-shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="bg-white border border-[#EDF2F5] rounded-2xl p-7 sticky top-24">
                <h3 className="font-heading font-bold text-lg text-[#031B2A] mb-4">
                  Ready to apply?
                </h3>
                <p className="text-sm text-[#6D7E89] mb-5">
                  Fill out the application form and we'll review it within 5-7 business days.
                </p>

                <Link
                  to={`/programs/${slug}/register`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-bold py-3.5 rounded-lg hover:bg-[#A8D94A] transition-all mb-3"
                >
                  <Sparkles className="w-4 h-4" /> Apply Now
                </Link>

                <Link
                  to="/contact?purpose=training"
                  className="w-full inline-flex items-center justify-center gap-2 border-2 border-[#064B7A] text-[#064B7A] font-semibold py-3 rounded-lg hover:bg-[#F5F9FB] transition-all"
                >
                  Contact Us
                </Link>

                <div className="border-t border-[#EDF2F5] mt-6 pt-6 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#6D7E89]">Duration</span>
                    <span className="font-semibold text-[#031B2A]">{program.duration || 'Flexible'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6D7E89]">Format</span>
                    <span className="font-semibold text-[#031B2A] capitalize">{program.format}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6D7E89]">Level</span>
                    <span className="font-semibold text-[#031B2A] capitalize">
                      {program.level?.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6D7E89]">Price</span>
                    <span className="font-semibold text-[#064B7A]">
                      {program.price > 0
                        ? `${Number(program.price).toLocaleString()} ${program.currency}`
                        : 'Free'}
                    </span>
                  </div>
                  {program.registrationDeadline && (
                    <div className="flex justify-between">
                      <span className="text-[#6D7E89]">Deadline</span>
                      <span className="font-semibold text-[#E74C3C]">
                        {new Date(program.registrationDeadline).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}