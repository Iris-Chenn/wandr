import type { Metadata } from 'next';
import WandrNavbar from '@/components/WandrNavbar';
import WandrFooter from '@/components/WandrFooter';
import PlanForm from './PlanForm';

export const metadata: Metadata = {
  title: 'Plan a trip — Wandr',
  description:
    "Tell us your budget. We\u2019ll find every trip you can actually afford \u2014 live flights, hotels, plans, all in one place.",
};

export default function PlanPage() {
  return (
    <>
      <WandrNavbar />

      <main>
        {/* Page header */}
        <header className="pghead">
          <span className="wd-eyebrow">Plan a trip</span>
          <h1>
            Tell us your budget.<br />We&apos;ll do the math.
          </h1>
          <p>
            No &ldquo;preferred destination&rdquo; field. No loyalty-program upsell.
            Just one number and a couple of dates, and every trip that fits.
          </p>
        </header>

        {/* Interactive form + breakdown */}
        <PlanForm />
      </main>

      <WandrFooter />
    </>
  );
}
