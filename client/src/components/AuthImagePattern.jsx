import React from 'react'

const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <>
      <div className="hidden lg:flex flex-col items-center justify-center bg-slate-900 text-white p-12 relative overflow-hidden">
      {/* Animated code symbols in background */}
      <div className="absolute inset-0 opacity-10">
        {/* content */}
 <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>
        <p className="text-slate-300 text-center">{subtitle}</p>
      </div>
    </div>
    </>
  )
}

export default AuthImagePattern