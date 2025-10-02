import React, { type Key } from 'react'
import ProfileCard from '../../components/Landing/ProfileCard'
import Feed from '../../components/Landing/Feed'
import { Card, CardBody, Tab, Tabs } from '@heroui/react'
import CommunityWidget from '../../components/Landing/CommunityWidget'

const ProfilPage = () => {
    const [selected, setSelected] = React.useState("all");
  return (
    <>
        <main className="col-span-12 lg:col-span-8 xl:col-span-6 xl:col-start-3">
            <ProfileCard></ProfileCard>
            <Tabs className='mt-6' fullWidth aria-label="Options" selectedKey={selected} onSelectionChange={(key: any) => setSelected(key)}
    >
                <Tab key="all" title="All">
                    <Feed></Feed>
                </Tab>
                <Tab key="repost" title="Repost">
                    <Feed></Feed>
                </Tab>
                <Tab key="tag" title="Tagged">
                    <Feed></Feed>
                </Tab>
            </Tabs>
            
        </main>
        <aside className="hidden lg:block lg:col-span-4 xl:col-span-3">
            <CommunityWidget />
        </aside>
    </>
  )
}

export default ProfilPage