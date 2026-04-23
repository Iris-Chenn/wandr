import type { Metadata } from 'next';
import WandrNavbar from '@/components/WandrNavbar';
import WandrFooter from '@/components/WandrFooter';
import GuidesClient from './GuidesClient';

export const metadata: Metadata = {
  title: 'Guides & journal — Wandr',
  description:
    'Short, numerate, useful travel writing. No "10 magical reasons" listicles. Budget breakdowns, destination deep-dives, FX guides, and more.',
};

export default function GuidesPage() {
  return (
    <>
      <WandrNavbar />

      <main>
        <header className="pghead">
          <span className="wd-eyebrow">Guides &amp; journal</span>
          <h1>
            Travel writing that{' '}
            <span style={{ fontFamily: 'var(--w-font-serif)', fontStyle: 'italic' }}>
              respects your time
            </span>
            .
          </h1>
          <p>
            Short, numerate, useful. No &ldquo;10 magical reasons&rdquo; listicles. Written by the Wandr team
            and a small stable of travel journalists we actually pay fairly.
          </p>
        </header>

        <GuidesClient />
      </main>

      <WandrFooter />
    </>
  );
}
