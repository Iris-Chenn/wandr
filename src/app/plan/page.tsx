import type { Metadata } from 'next';
import PlanForm from './PlanForm';

export const metadata: Metadata = {
  title: 'Plan a trip — Wandr',
  description:
    "Tell us your budget. We'll find every trip you can actually afford — live flights, hotels, plans, all in one place.",
};

// Full-bleed plan page — has its own topbar with Light/Dark toggle, no standard nav/footer
export default function PlanPage() {
  return <PlanForm />;
}
