'use client';

import dynamic from 'next/dynamic';

const OfficeScene = dynamic(
  () => import('./_components/3d/OfficeScene'),
  { ssr: false }
);

export default function Home() {
  return <OfficeScene />;
}
