import { Avatar, Button, Card, CardBody, Chip } from '@heroui/react'
import AvatarPhoto from '@/assets/avatar.jpg'
import React from 'react'

const ProfileCard = () => {
  return (
    <div className="sticky top-6 space-y-4">
      <Card className="rounded-2xl">
        <CardBody>
          <div className="flex items-center gap-3">
            <Avatar src={AvatarPhoto} size="md" />
            <div>
              <div className="font-semibold leading-tight">Yasdil Lasoma</div>
              <div className="text-xs text-foreground-500">@yasdil</div>
            </div>
          </div>

          <div className="mt-3 flex gap-2 text-xs">
            <Chip size="sm" variant="flat">128 Post</Chip>
            <Chip size="sm" variant="flat">540 Teman</Chip>
            <Chip size="sm" variant="flat">1.2k Aktivitas</Chip>
          </div>

          <Button className="mt-3" size="sm" variant="flat" fullWidth>
            Edit Profil
          </Button>
        </CardBody>
      </Card>
    </div>
  )
}

export default ProfileCard