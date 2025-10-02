import Photo from '@/assets/photo.jpg'
import AvatarPhoto from '@/assets/avatar.jpg'
import { Avatar, Button, Card, CardBody, CardFooter, CardHeader } from '@heroui/react';
import { Heart, MessageCircle, MoreVertical, Repeat2 } from 'lucide-react';

const Feed = () => {
  const posts = [
    { id: 1, user: { name: "Alya", handle: "@alya", avatar: AvatarPhoto }, time: "2j", emoji: "😍🔥", image: Photo },
    { id: 2, user: { name: "Alya", handle: "@alya", avatar: AvatarPhoto }, time: "2j", emoji: "😍🔥", image: Photo },
    { id: 3, user: { name: "Alya", handle: "@alya", avatar: AvatarPhoto }, time: "2j", emoji: "😍🔥" },
  ];
  return (
    <div className="mt-4 space-y-4">
      {posts.map((post) => (
        <Card key={post.id} className="rounded-2xl overflow-hidden">
            <CardHeader className="flex items-center gap-3">
                <Avatar src={post.user.avatar} size="sm" />
                    <div className="flex-1">
                        <div className="text-sm font-medium">
                            {post.user.name}
                            <span className="text-foreground-500"> {post.user.handle} · {post.time}</span>
                        </div>
                    </div>
                <Button isIconOnly variant="light" aria-label="More">
                    <MoreVertical size={18} />
                </Button>
            </CardHeader>
            <CardBody>
                <div className="text-3xl leading-relaxed">{post.emoji}</div>
                {post.image && (
                    <img src={post.image} alt="post" className="w-full rounded aspect-video object-cover" />
                )}
            </CardBody>
            <CardFooter className="flex gap-4 text-foreground-500">
                <div className="flex items-center gap-2">
                    <Button isIconOnly variant="light">
                        <Heart size={18}></Heart><span className='ml-2'>0</span>
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <Button isIconOnly variant="light">
                        <MessageCircle size={18}/><span className='ml-2'>0</span>
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <Button isIconOnly variant="light">
                    <Repeat2 size={20} /><span className='ml-2'>0</span>
                    </Button>
                </div>

            </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default Feed