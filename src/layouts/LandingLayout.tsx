import React from 'react'
import LeftNav from '../components/Landing/LeftNav'
import MobileNav from '../components/Landing/MobileNav'
import { Outlet } from 'react-router-dom'

const LandingLayout = () => {
    
  return (
    <div className="min-h-screen bg-background text-foreground">
        {/* LeftNav sudah fixed, render di luar grid */}
        <LeftNav />

        <div className="mx-auto max-w-[1200px] px-4 lg:px-6 lg:pl-28">
            <div className="grid grid-cols-12 gap-8">
                <Outlet/>

            </div>
        </div>

        <MobileNav />
    </div>
  )
}

export default LandingLayout