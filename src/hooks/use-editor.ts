import { useState, useMemo, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import useAgent from "@/hooks/bsky/use-agent";
import { useToast } from "@/hooks/shadcn/use-toast";
import { useCurrentDraftContext } from "@/context/current-draft-context";
import { queryClient } from "@/lib/react-query/client";
import { createScheduledPost } from "../app/actions/posts/scheduled-posts";
import {
  deleteDrafts,
  updateDrafts,
  getDraftById,
} from "@/app/actions/posts/drafts";
import { formatDateForNotification } from "@/lib/utils";
import { AtpBaseClient, RichText } from "@atproto/api";
import { convertBase64ToBlob } from "@/lib/utils";
import { InputSchema } from "@atproto/api/dist/client/types/com/atproto/admin/getAccountInfo";
import { uploadFile } from "@/app/actions/gcloud/storage";

const useEditor = () => {
  const { toast } = useToast();
  const { agent } = useAgent();
  const { currentDraftId, setCurrentDraftId } = useCurrentDraftContext();
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);

  const { data: draft } = useQuery({
    queryKey: ["draft", currentDraftId],
    queryFn: () => getDraftById(currentDraftId), // todo: fix type err
    enabled: !!currentDraftId,
  });

  useEffect(() => {
    if (draft) setContent(draft[0]?.content || "");
  }, [currentDraftId, draft]);

  const cleanUp = (key?: string) => {
    key && queryClient.invalidateQueries({ queryKey: [key] });
    if (currentDraftId) {
      deleteDraft(currentDraftId);
      setCurrentDraftId(null);
    }
    setContent("");
    setImages([]);
  };

  const { mutate: updateDraft } = useMutation({
    mutationFn: async (content: string) => {
      if (!currentDraftId) return;
      await updateDrafts(currentDraftId, { content });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["drafts"] }),
  });

  const { mutate: deleteDraft } = useMutation({
    mutationFn: deleteDrafts,
    onSuccess: () => cleanUp("drafts"),
  });

  const { mutate: schedulePost, isPending: isPendingSchedulePost } =
    useMutation({
      mutationFn: createScheduledPost,
      onSuccess: ([data]) => {
        const { postAt } = data;
        if (!postAt) return;

        toast({
          title: "Skeet scheduled",
          description: formatDateForNotification(postAt),
        });
        cleanUp("scheduled-posts");
      },
    });

  const { mutate: addPost, isPending: isPendingAddPost } = useMutation({
    mutationFn: async () => {
      if (!agent) return;

      const rt = new RichText({
        text: content,
      });
      await rt.detectFacets(agent as AtpBaseClient);

      const imageBlobs = (await Promise.all(
        images.map(async (image) => {
          return convertBase64ToBlob(image["data_url"]);
        })
      )) as InputSchema[];

      const uploadedImages = await Promise.all(
        imageBlobs.map(async (imageBlob) => {
          const { data } = await agent.uploadBlob(imageBlob, {
            encoding: "image/webp",
          });
          return data.blob;
        })
      );

      const postRecord = {
        $type: "app.bsky.feed.post",
        text: rt.text,
        facets: rt.facets,
        embed: {
          $type: "app.bsky.embed.images",
          images: uploadedImages.map((blob, index) => ({
            alt: `Image ${index + 1}`, // todo: customize alt text
            image: blob,
            aspectRatio: {
              width: 1000,
              height: 500,
            },
          })),
        },
        createdAt: new Date().toISOString(),
      };

      await agent?.post(postRecord);
    },
    onSuccess: () => {
      toast({
        title: "Skeet posted",
        description: "Your skeet has been posted",
      });
      cleanUp();
    },
  });

  const debouncedSaveDraft = useMemo(
    () => debounce((value: string) => updateDraft(value), 500),
    [updateDraft]
  );

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    debouncedSaveDraft(e.target.value);
  };

  const handleSchedulePost = async (postAt: Date) => {
    if (!agent?.sessionManager?.session) return;

    try {
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const { file } = image;
          const blob = new Blob([file]);
          const arrayBuffer = await blob.arrayBuffer();
          const base64 = btoa(
            new Uint8Array(arrayBuffer).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ""
            )
          );

          const url = await uploadFile(base64, file["name"]);
          return url;
        })
      );

      schedulePost({
        handle: agent.sessionManager.session.handle,
        content,
        imageUrls,
        postAt,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return {
    content,
    handleContentChange,
    images,
    setImages,
    handleSchedulePost,
    handlePost: () => addPost(),
    isPendingSchedulePost,
    isPendingAddPost,
  };
};

export default useEditor;
