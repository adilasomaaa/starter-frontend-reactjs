import { Avatar, Button, Card, CardBody, Chip } from '@heroui/react'
import React from 'react'
import { Link } from 'react-router-dom'
import AvatarPhoto from '@/assets/avatar.jpg'
import { DotIcon, EllipsisVertical, PencilIcon, Settings } from 'lucide-react'

interface ProfileCardProps {
    isUser?: boolean | true
}

const ProfileCard = ({isUser}: ProfileCardProps) => {
  return (
    <div className="mt-[20px]">
      <Card className="rounded-2xl p-4">
        <CardBody>
            <div className="grid grid-cols-12 grid-rows-5 gap-4">
                <div className="col-span-4 row-span-5">
                    <Avatar src={AvatarPhoto} className="md:w-30 md:h-30 w-20 h-20"></Avatar>
                </div>
                <div className="col-span-8 row-span-5 col-start-5">
                    <div className="flex justify-between">
                        <div className="flex items-center gap-3">
                            <div>
                                <div className="font-semibold leading-tight">Yasdil Lasoma</div>
                                <div className="text-xs text-foreground-500">@yasdil</div>
                            </div>
                        </div>
                        {isUser && (
                            <div className="flex items-center gap-2">
                                <Link to='/settings'>
                                    <Button isIconOnly variant="light" aria-label="More"><EllipsisVertical className="h-4 w-4"/></Button>
                                </Link>
                            </div>
                        )} {!isUser && (
                            <div className="flex items-center gap-2">
                                <Link to='/profile'>
                                    <Button isIconOnly variant="light" aria-label="More"><EllipsisVertical className="h-4 w-4"/></Button>
                                </Link>
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-3 flex gap-2 items-center overflow-x-scroll text-xs">
                        <Chip size="sm" variant="flat">128 Post</Chip>
                        <Chip size="sm" variant="flat">540 Followers</Chip>
                        <Chip size="sm" variant="flat">540 Following</Chip>
                    </div>
                    <div className="mt-3">
                        <span className='text-sm'>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</span>
                    </div>
                </div>
            </div>
            {!isUser && (
                <div className="grid grid-cols-12 grid-rows-1 gap-4 mt-6">
                    <div className="col-span-6">
                        <Link to='/login'>
                            <Button variant="solid" color="primary" className="w-full">Follow</Button>
                        </Link>
                    </div>
                    <div className="col-span-6 col-start-7">
                        <Button variant="solid" className="w-full">Message</Button>
                    </div>
                </div>
            )}
        </CardBody>
      </Card>
    </div>
  )
}

export default ProfileCard