import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Create = () => {
  const router = useRouter();
  const { id } = router.query;
  const [currentId, setCurrentId] = useState(id);
  const [start, setStart] = useState(false);

  const twitchIdToName = async (id: any) => {
    const url = `https://twapi.haenu.com/user/name/${id}`;
    const res = await axios.get(url);
    return res.data.id;
  };

  // extractor 호출
  const getExtractor = async (id: any) => {
    setStart(true);
    const url = "https://api.clippy.kr/extractor";
    const res = await axios.post(
      url,
      {
        streamerId: parseInt(await twitchIdToName(id)),
      },
      {
        withCredentials: true,
      }
    );
    console.log(res);
  };

  useEffect(() => {
    if (id === undefined) return;
    getExtractor(id);
  }, []);

  useEffect(() => {
    if (id === undefined) return;
    start || getExtractor(id);
  }, [id]);

  return (
    <div>
      <h1>Create Page</h1>
      <p>id: {id}</p>
    </div>
  );
};

export default Create;
