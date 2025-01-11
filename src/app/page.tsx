'use client';
import { Button } from '@nextui-org/react';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  return (
    <div>
      <h1>Landing Page</h1>
      <Button onPress={() => router.push('/staking')}>Go to staking</Button>
    </div>
  );
}
