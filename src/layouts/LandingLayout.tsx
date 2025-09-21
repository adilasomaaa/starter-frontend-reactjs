import React from 'react'
import LeftNav from '../components/Landing/LeftNav'
import TopTabs from '../components/Landing/TopTabs'
import Composer from '../components/Landing/Composer'
import Feed from '../components/Landing/Feed'
import ProfileCard from '../components/Landing/ProfileCard'
import MobileNav from '../components/Landing/MobileNav'

const LandingLayout = () => {
    const [activeTab, setActiveTab] = React.useState('media')
  return (
    <div className="min-h-screen bg-background text-foreground">
        {/* LeftNav sudah fixed, render di luar grid */}
        <LeftNav />

        {/* Container utama: feed di tengah, ada padding kiri agar tidak ketimpa nav fixed */}
        <div className="mx-auto max-w-[1200px] px-4 lg:px-6 lg:pl-24">
            <div className="grid grid-cols-12 gap-8">
                {/* CENTER (feed) */}
                <main className="col-span-12 lg:col-span-8 xl:col-span-7 2xl:col-span-6 mx-auto max-w-[700px] w-full">
                    <TopTabs active={activeTab} onChange={setActiveTab} />
                    <Composer />
                    <Feed />
                </main>

                {/* RIGHT (profil kecil) */}
                <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 2xl:col-span-3">
                    <div className="ml-auto w-[280px]">
                        <ProfileCard />
                    </div>
                </aside>
            </div>
        </div>

        <MobileNav />
    </div>
  )
}

export default LandingLayout