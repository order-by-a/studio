'use client';

import Terminal from '@/components/terminal';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <main role="application">
      {isClient ? <Terminal /> : null}
    </main>
  );
}
