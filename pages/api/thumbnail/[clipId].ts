import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getClip } from "../../../util/clippy";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { clipId } = req.query;
  if (clipId) {
    const clipInfo = await getClip(clipId as string);
    if (!clipInfo) return res.status(404).end();

    const thumbnailData = await axios
      .get(clipInfo.cfVideoThumbnail, { responseType: "arraybuffer" })
      .then((res) => res.data)
      .catch(() => null);
    if (!thumbnailData) return res.status(404).end();
    const thumbnailBuffer = Buffer.from(thumbnailData, "base64");

    return res
      .setHeader("Content-Type", "image/jpg")
      .setHeader("Content-Length", thumbnailBuffer.length)
      .end(thumbnailBuffer);
  }
};

export default handler;
