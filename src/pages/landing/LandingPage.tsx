import React from 'react'
import TopTabs from '../../components/Landing/TopTabs'
import Composer from '../../components/Landing/Composer'
import Feed from '../../components/Landing/Feed'
import ProfileWidget from '../../components/Landing/ProfileWidget'

const LandingPage = () => {
  const [activeTab, setActiveTab] = React.useState('teman')
  return (
    <>
      <main className="col-span-12 lg:col-span-8 xl:col-span-6 xl:col-start-3">
          <TopTabs active={activeTab} onChange={setActiveTab} />
          <Composer />
          <Feed />
      </main>

      <aside className="hidden lg:block lg:col-span-4 xl:col-span-3">
          <ProfileWidget />
      </aside>
    </>
  )
}

export default LandingPage