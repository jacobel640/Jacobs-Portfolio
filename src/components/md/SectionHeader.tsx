import { FC, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Reveal, RevealItem } from './Reveal';

interface SectionHeaderProps {
  icon: LucideIcon;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
}

/** The eyebrow chip, display title and lead paragraph every section opens with. */
export const SectionHeader: FC<SectionHeaderProps> = ({ icon: Icon, eyebrow, title, lead }) => (
  <Reveal className="relative z-10 flex flex-col items-center text-center gap-4 mb-14">
    <RevealItem className="inline-flex items-center gap-2 h-8 px-4 rounded-full text-label-md uppercase tracking-wider bg-md-surface-container-high text-md-on-surface-variant border border-md-outline-variant/60">
      <Icon className="w-3.5 h-3.5 text-md-primary" aria-hidden="true" />
      <span>{eyebrow}</span>
    </RevealItem>

    <RevealItem>
      <h2 className="text-headline-lg sm:text-display-sm lg:text-display-md text-md-on-surface text-balance">{title}</h2>
    </RevealItem>

    {lead && (
      <RevealItem>
        <p className="text-body-lg sm:text-lg text-md-on-surface-variant max-w-2xl mx-auto text-pretty">{lead}</p>
      </RevealItem>
    )}
  </Reveal>
);
