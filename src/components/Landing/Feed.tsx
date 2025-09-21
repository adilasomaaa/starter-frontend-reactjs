import Photo from '@/assets/photo.jpg'
import AvatarPhoto from '@/assets/avatar.jpg'
import { Avatar, Button, Card, CardBody, CardFooter, CardHeader } from '@heroui/react';
import { MoreVertical } from 'lucide-react';

const Feed = () => {
  const posts = [
    { id: 1, user: { name: "Alya", handle: "@alya", avatar: AvatarPhoto }, time: "2j", emoji: "😍🔥", image: Photo },
    { id: 1, user: { name: "Alya", handle: "@alya", avatar: AvatarPhoto }, time: "2j", emoji: "😍🔥", image: Photo },
  ];
  return (
    <div className="mt-4 space-y-4">
      {posts.map(post => (
        <Card className="rounded-2xl overflow-hidden">
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
        {post.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.image} alt="post" className="w-full aspect-video object-cover" />
        )}
        <CardBody>
            <div className="text-3xl leading-relaxed">{post.emoji}</div>
        </CardBody>
        <CardFooter className="flex gap-4 text-foreground-500">
            <Button size="sm" variant="light">❤️ 12</Button>
            <Button size="sm" variant="light">💬 3</Button>
            <Button size="sm" variant="light">↗︎ Bagikan</Button>
            <Button size="sm" variant="light">🔖 Simpan</Button>
        </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default Feed