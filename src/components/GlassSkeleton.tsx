import { FC } from 'react';

export const SkillsSkeleton: FC = () => {
  return (
    <section id="skills" aria-busy="true" aria-label="Loading skills" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden animate-pulse">
      {/* Header Skeleton */}
      <div className="text-center space-y-4 mb-16 flex flex-col items-center">
        <div className="w-36 h-7 rounded-full bg-md-surface-container-high border border-md-outline-variant" />
        <div className="w-64 sm:w-96 h-10 rounded-2xl bg-md-surface-container-high" />
        <div className="w-80 sm:w-2/3 max-w-xl h-5 rounded-xl bg-md-surface-container-high" />
      </div>

      {/* Grid of 3 Card Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((key) => (
          <div
            key={key}
            className="flex flex-col justify-between rounded-3xl border border-md-outline-variant bg-md-surface-container-low p-7 sm:p-8 min-h-[380px]"
          >
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-md-surface-container-highest" />
                <div className="space-y-2">
                  <div className="w-36 h-5 rounded-lg bg-md-surface-container-highest" />
                  <div className="w-24 h-3 rounded bg-md-surface-container-high" />
                </div>
              </div>
              <div className="space-y-2 mb-6">
                <div className="w-full h-3.5 rounded bg-md-surface-container-high" />
                <div className="w-5/6 h-3.5 rounded bg-md-surface-container-high" />
                <div className="w-4/6 h-3.5 rounded bg-md-surface-container-high" />
              </div>
            </div>

            <div className="pt-4 border-t border-md-outline-variant space-y-3">
              <div className="w-28 h-3 rounded bg-md-surface-container-highest" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6].map((pill) => (
                  <div key={pill} className="w-20 h-8 rounded-full bg-md-surface-container-high" />
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
    <section id="projects" aria-busy="true" aria-label="Loading projects" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden animate-pulse">
      {/* Header Skeleton */}
      <div className="text-center space-y-4 mb-16 flex flex-col items-center">
        <div className="w-36 h-7 rounded-full bg-md-surface-container-high border border-md-outline-variant" />
        <div className="w-64 sm:w-96 h-10 rounded-2xl bg-md-surface-container-high" />
        <div className="w-80 sm:w-2/3 max-w-xl h-5 rounded-xl bg-md-surface-container-high" />
        
        {/* Filter Pills Skeleton */}
        <div className="flex justify-center gap-2 pt-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-24 h-10 rounded-full bg-md-surface-container-high" />
          ))}
        </div>
      </div>

      {/* Grid of 2 Large Project Card Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[1, 2].map((key) => (
          <div
            key={key}
            className="flex flex-col justify-between rounded-3xl border border-md-outline-variant bg-md-surface-container-low p-7 sm:p-8 min-h-[460px]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-28 h-6 rounded-lg bg-md-surface-container-highest" />
                <div className="w-16 h-5 rounded bg-md-surface-container-high" />
              </div>
              <div className="w-48 h-7 rounded-xl bg-md-surface-container-highest mb-3" />
              <div className="space-y-2 mb-6">
                <div className="w-full h-3.5 rounded bg-md-surface-container-high" />
                <div className="w-full h-3.5 rounded bg-md-surface-container-high" />
                <div className="w-3/4 h-3.5 rounded bg-md-surface-container-high" />
              </div>
              {/* Image Preview Box Skeleton */}
              <div className="w-full h-44 rounded-2xl bg-md-surface-container-high mb-6 border border-md-outline-variant" />
            </div>

            <div className="pt-4 border-t border-md-outline-variant flex items-center justify-between">
              <div className="flex gap-2">
                {[1, 2, 3].map((tag) => (
                  <div key={tag} className="w-16 h-7 rounded-full bg-md-surface-container-high" />
                ))}
              </div>
              <div className="w-28 h-10 rounded-full bg-md-surface-container-highest" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export const ContactSkeleton: FC = () => {
  return (
    <footer id="contact" aria-busy="true" aria-label="Loading contact" className="relative bg-md-surface-container-lowest overflow-hidden pt-24 pb-12 animate-pulse">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <div className="w-44 h-7 rounded-full bg-md-surface-container-highest mb-6" />
        <div className="w-72 sm:w-[500px] h-12 rounded-2xl bg-md-surface-container-highest mb-6" />
        <div className="w-64 sm:w-96 h-5 rounded-xl bg-md-surface-container-high mb-10" />

        {/* Contact Cards Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-5 rounded-3xl bg-md-surface-container-low border border-md-outline-variant h-32 flex flex-col justify-between"
            >
              <div className="flex justify-between items-center">
                <div className="w-10 h-10 rounded-2xl bg-md-surface-container-highest" />
                <div className="w-4 h-4 rounded bg-md-surface-container-high" />
              </div>
              <div className="space-y-1 text-left">
                <div className="w-20 h-4 rounded bg-md-surface-container-highest" />
                <div className="w-32 h-3 rounded bg-md-surface-container-high" />
              </div>
            </div>
          ))}
        </div>

        {/* Email pill skeleton */}
        <div className="w-72 h-14 rounded-full bg-md-surface-container-lowest border border-md-outline" />
      </div>
    </footer>
  );
};
