// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const notice = await axios
      .get("https://assets.clippy.kr/notice.json")
      .then((res) => res.data);
    res.status(200).json(notice);
  } catch (err) {
    res.status(500).json({ error: "failed to load notice" });
  }
};

export default handler;
