import { Avatar, Button, Card, CardBody, Chip } from '@heroui/react'
import AvatarPhoto from '@/assets/avatar.jpg'
import React from 'react'
import { Link, NavLink } from 'react-router-dom'

const ProfileWidget = () => {
  return (
    <div className="my-8">
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
          </div>
                <Button as={Link} to='/profile' className="mt-3" size="sm" variant="flat" fullWidth>
                  Lihat Profil
                </Button>
        </CardBody>
      </Card>
    </div>
  )
}

export default ProfileWidget