import { FC } from 'react';

interface SkeletonProps {
  height?: string;
  type?: 'skills' | 'projects' | 'contact' | 'default';
}

export const SkillsSkeleton: FC = () => {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden animate-pulse">
      {/* Header Skeleton */}
      <div className="text-center space-y-4 mb-16 flex flex-col items-center">
        <div className="w-36 h-7 rounded-full bg-slate-800/80 border border-slate-700/40" />
        <div className="w-64 sm:w-96 h-10 rounded-2xl bg-slate-800/90" />
        <div className="w-80 sm:w-2/3 max-w-xl h-5 rounded-xl bg-slate-800/60" />
      </div>

      {/* Grid of 3 Card Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((key) => (
          <div
            key={key}
            className="flex flex-col justify-between rounded-3xl border border-white/[0.08] bg-slate-900/40 backdrop-blur-xl p-7 sm:p-8 min-h-[380px]"
          >
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-800/80" />
                <div className="space-y-2">
                  <div className="w-36 h-5 rounded-lg bg-slate-800/90" />
                  <div className="w-24 h-3 rounded bg-slate-800/60" />
                </div>
              </div>
              <div className="space-y-2 mb-6">
                <div className="w-full h-3.5 rounded bg-slate-800/60" />
                <div className="w-5/6 h-3.5 rounded bg-slate-800/50" />
                <div className="w-4/6 h-3.5 rounded bg-slate-800/40" />
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.06] space-y-3">
              <div className="w-28 h-3 rounded bg-slate-800/70" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6].map((pill) => (
                  <div key={pill} className="w-20 h-7 rounded-xl bg-slate-800/50" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export const ProjectsSkeleton: FC = () => {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden animate-pulse">
      {/* Header Skeleton */}
      <div className="text-center space-y-4 mb-16 flex flex-col items-center">
        <div className="w-36 h-7 rounded-full bg-slate-800/80 border border-slate-700/40" />
        <div className="w-64 sm:w-96 h-10 rounded-2xl bg-slate-800/90" />
        <div className="w-80 sm:w-2/3 max-w-xl h-5 rounded-xl bg-slate-800/60" />
        
        {/* Filter Pills Skeleton */}
        <div className="flex justify-center gap-2 pt-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-24 h-10 rounded-2xl bg-slate-800/60" />
          ))}
        </div>
      </div>

      {/* Grid of 2 Large Project Card Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[1, 2].map((key) => (
          <div
            key={key}
            className="flex flex-col justify-between rounded-3xl border border-white/[0.08] bg-slate-900/40 backdrop-blur-xl p-7 sm:p-8 min-h-[460px]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-28 h-6 rounded-lg bg-slate-800/80" />
                <div className="w-16 h-5 rounded bg-slate-800/50" />
              </div>
              <div className="w-48 h-7 rounded-xl bg-slate-800/90 mb-3" />
              <div className="space-y-2 mb-6">
                <div className="w-full h-3.5 rounded bg-slate-800/60" />
                <div className="w-full h-3.5 rounded bg-slate-800/50" />
                <div className="w-3/4 h-3.5 rounded bg-slate-800/40" />
              </div>
              {/* Image Preview Box Skeleton */}
              <div className="w-full h-44 rounded-2xl bg-slate-800/40 mb-6 border border-white/[0.04]" />
            </div>

            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <div className="flex gap-2">
                {[1, 2, 3].map((tag) => (
                  <div key={tag} className="w-16 h-6 rounded-lg bg-slate-800/50" />
                ))}
              </div>
              <div className="w-28 h-9 rounded-xl bg-slate-800/70" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export const ContactSkeleton: FC = () => {
  return (
    <footer className="relative bg-[#030712] overflow-hidden pt-20 pb-12 animate-pulse">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <div className="w-44 h-7 rounded-full bg-slate-800/80 mb-6" />
        <div className="w-72 sm:w-[500px] h-12 rounded-2xl bg-slate-800/90 mb-6" />
        <div className="w-64 sm:w-96 h-5 rounded-xl bg-slate-800/60 mb-10" />

        {/* Contact Cards Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-slate-900/50 border border-white/[0.08] backdrop-blur-xl h-32 flex flex-col justify-between"
            >
              <div className="flex justify-between items-center">
                <div className="w-9 h-9 rounded-xl bg-slate-800/80" />
                <div className="w-4 h-4 rounded bg-slate-800/60" />
              </div>
              <div className="space-y-1 text-left">
                <div className="w-20 h-4 rounded bg-slate-800/90" />
                <div className="w-32 h-3 rounded bg-slate-800/50" />
              </div>
            </div>
          ))}
        </div>

        {/* Email pill skeleton */}
        <div className="w-72 h-11 rounded-2xl bg-slate-900/60 border border-white/[0.08]" />
      </div>
    </footer>
  );
};

export const SectionSkeleton: FC<SkeletonProps> = ({ height = 'min-h-[400px]', type = 'default' }) => {
  if (type === 'skills') return <SkillsSkeleton />;
  if (type === 'projects') return <ProjectsSkeleton />;
  if (type === 'contact') return <ContactSkeleton />;

  return (
    <div
      className={`w-full max-w-7xl mx-auto my-12 p-8 sm:p-12 rounded-3xl backdrop-blur-xl bg-slate-900/40 border border-white/[0.08] shadow-2xl animate-pulse ${height} flex flex-col justify-center items-center`}
    >
      <div className="w-1/3 h-8 bg-slate-800/70 rounded-2xl mb-6" />
      <div className="w-2/3 max-w-lg h-4 bg-slate-800/50 rounded-xl mb-3" />
      <div className="w-1/2 max-w-md h-4 bg-slate-800/40 rounded-xl" />
    </div>
  );
};

export default SectionSkeleton;
