import React from 'react'
import { Avatar, Button, Card, CardBody, CardHeader, Chip } from '@heroui/react'
import AvatarPhoto from '@/assets/avatar.jpg'
import { Link } from 'react-router-dom'

const CommunityWidget = () => {
    const community = [
        {
            id: 1,
            name: 'X Riders',
            avatar: AvatarPhoto,
            post: 128,
            member: 540
        },
        {
            id: 2,
            name: 'Telkomsel',
            avatar: AvatarPhoto,
            post: 128,
            member: 540
        },

    ]
  return (
    <div className="my-8">
      <Card className="rounded-2xl">
        <CardHeader>
            <h2 className="text-lg font-semibold">Community</h2>
        </CardHeader>
        <CardBody>
            {community.map(c => (
                <div key={c.id} className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Avatar src={AvatarPhoto} size="sm" />
                        <div className="flex-1 gap-0">
                            <div className="text-sm font-medium">
                                {c.name}
                            </div>
                            <span className="text-xs text-foreground-500">{c.member} Members</span>
                        </div>
                    </div>
                    <Button variant="flat">
                        <Link to="/explore">
                            See All
                        </Link>
                    </Button>
                </div>
            ))}
           
        </CardBody>
      </Card>
    </div>
  )
}

export default CommunityWidget