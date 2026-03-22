import React from 'react'

export default function AuthLayout({children}: {children: React.ReactNode}) {
  return (
    <div className='relative flex flex-col items-center justify-center min-h-screen overflow-hidden'>
      {/* Subtle grid background */}
      <div
        className='pointer-events-none absolute inset-0 -z-10'
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, oklch(0.5 0 0 / 8%) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />
      {/* Glow effect */}
      <div className='pointer-events-none absolute top-0 left-1/2 -z-10 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl' />

      {children}
    </div>
  )
}
