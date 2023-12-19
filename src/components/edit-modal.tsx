import ReactDOM from "react-dom";
import styled from "styled-components";
import usePortal from "../hooks/use-portal";
import {
  Form,
  TextArea,
  AttachFileButton,
  AttachFileInput,
  SubmitBtn,
} from "./post-tweet-form";
import { useRecoilState, useRecoilValue } from "recoil";
import { EditClicked, EditTweet } from "../atoms/atom";
import { db, storage } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Overlay = styled.div`
  width: 100%;
  height: 100vh;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.7);
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const EditForm = styled(Form)`
  width: 40%;
  max-width: 500px;
`;
const Photo = styled.img`
  width: 150px;
  height: 200px;
  border-radius: 10px;
  margin-left: 20px;
`;

export default function EditModal() {
  const parentElement = usePortal("edit-modal");

  const [tw, setTw] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [url, setURL] = useState("");

  const [EditisClicked, setEditisClicked] = useRecoilState(EditClicked);
  const tweet = useRecoilValue(EditTweet);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTw(e.target.value);
  };

  const onOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log(e.target);
    console.log(e.currentTarget);

    console.log(e.bubbles);

    if (e.target === e.currentTarget) {
      setEditisClicked(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files && files.length === 1) {
      setFile(files[0]);

      console.log(e.target.files);
      console.log(URL.createObjectURL(files[0]));

      setURL(URL.createObjectURL(files[0]));
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // const user = auth.currentUser;

    try {
      const docRef = doc(db, "tweets", tweet.id);
      const docSnap = await getDoc(docRef);
      console.log(docSnap.data());

      let url = "";

      if (file) {
        const locationRef = ref(storage, `tweets/${tweet.userId}/${tweet.id}`);
        const result = await uploadBytes(locationRef, file);
        url = await getDownloadURL(result.ref);
      }
      await updateDoc(docRef, {
        photo: url,
        tweet: tw,
      });
    } catch (e) {
      console.log(e);
    }
  };

  return parentElement && EditisClicked
    ? ReactDOM.createPortal(
        <Overlay onClick={(e) => onOverlayClick(e)}>
          <EditForm onSubmit={onSubmit}>
            <TextArea
              rows={5}
              maxLength={160}
              placeholder={tweet.tweet}
              onChange={onChange}
              value={tw}
            ></TextArea>
            <AttachFileButton htmlFor="edit-file">Edit Photo</AttachFileButton>
            <AttachFileInput
              onChange={onFileChange}
              type="file"
              id="edit-file"
              accept="image/*"
            />
            <SubmitBtn type="submit">Edit Tweet</SubmitBtn>
          </EditForm>
          <Photo src={file ? url : tweet?.photo} />
        </Overlay>,
        parentElement
      )
    : null;
}
