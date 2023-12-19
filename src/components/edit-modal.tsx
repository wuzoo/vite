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
import auth, { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";

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

export default function EditModal() {
  const [tw, setTw] = useState("");

  const parentElement = usePortal("edit-modal");

  const [EditisClicked, setEditisClicked] = useRecoilState(EditClicked);
  const tweet = useRecoilValue(EditTweet);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTw(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // const user = auth.currentUser;

    try {
      const docRef = doc(db, "tweets", tweet.id);
      const docSnap = await getDoc(docRef);
      console.log(docSnap.data());

      await updateDoc(docRef, {
        tweet: tw,
      });
    } catch (e) {
      console.log(e);
    }
  };

  return parentElement && EditisClicked
    ? ReactDOM.createPortal(
        <Overlay>
          <EditForm onSubmit={onSubmit}>
            <TextArea
              rows={5}
              maxLength={160}
              placeholder={tweet.tweet}
              onChange={onChange}
              value={tw}
            ></TextArea>
            <AttachFileButton htmlFor="file">Edit Photo</AttachFileButton>
            <AttachFileInput type="file" id="file" accept="image/*" />
            <SubmitBtn type="submit">Edit Tweet</SubmitBtn>
          </EditForm>
        </Overlay>,
        parentElement
      )
    : null;
}
