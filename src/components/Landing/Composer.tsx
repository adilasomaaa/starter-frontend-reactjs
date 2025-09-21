import { Avatar, Button, Card, CardBody, Textarea } from "@heroui/react";
import { ImageIcon, Send, Smile } from "lucide-react";
import React from "react";

// Composer.jsx
const Composer = () => {
  const [text, setText] = React.useState("");
  const [images, setImages] = React.useState([]);
  const fileRef = React.useRef(null);
  const canPost = text.trim().length > 0 || images.length > 0;

//   const onPick = (e) => {
//     const files = Array.from(e.target.files || []);
//     setImages(files.map((f) => ({ name: f.name, url: URL.createObjectURL(f) })));
//   };

  return (
    <Card className="mt-4 rounded-2xl">
      <CardBody>
        <div className="flex gap-3">
          <Avatar src="/avatar.png" size="md" radius="full" />
          <div className="flex-1">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              minRows={2}
              maxRows={6}
              placeholder="Ungkapkan dengan emoji… 😄"
              variant="bordered"
              classNames={{
                input: "bg-transparent",
              }}
            />
            {/* {images.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {images.map((img) => (
                  <div key={img.url} className="aspect-square overflow-hidden rounded-xl border border-default-200">
                    <img src={img.url} alt={img.name} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )} */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="flat"
                  startContent={<Smile size={18} />}
                  className="bg-content2"
                >
                  Emoji
                </Button>
                <Button
                  variant="flat"
                  startContent={<ImageIcon size={18} />}
                  className="bg-content2"
                //   onPress={() => fileRef.current?.click()}
                >
                  Gambar
                </Button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                //   onChange={onPick}
                />
              </div>
              <Button
                color="primary"
                startContent={<Send size={16} />}
                isDisabled={!canPost}
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default Composer