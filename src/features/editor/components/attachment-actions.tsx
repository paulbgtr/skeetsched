import ImageUploading from "react-images-uploading";

import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AttachedContent } from "./attached-content";

export const AttachmentActions = ({
  images,
  onSetImages,
}: {
  images: Record<string, string>[];
  onSetImages: (images: []) => void;
}) => {
  const maxNumber = 4;

  const onChange = (imageList: any) => {
    onSetImages(imageList);
  };

  return (
    <div className="App">
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({ imageList, onImageUpload, onImageRemove }) => (
          <div>
            <div className="flex gap-3 border-b-[1px]">
              {imageList.map((image, index) => (
                <AttachedContent
                  key={index}
                  src={image["data_url"]}
                  onClickRemove={() => onImageRemove(index)}
                />
              ))}
            </div>
            <Button
              disabled={images.length >= maxNumber}
              onClick={onImageUpload}
              variant="ghost"
              className="text-blue-500"
            >
              <ImageIcon className="h-6 w-6" />
            </Button>
          </div>
        )}
      </ImageUploading>
    </div>
  );
};
