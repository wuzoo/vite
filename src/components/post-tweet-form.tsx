import { addDoc, collection, updateDoc } from "firebase/firestore";
import { useState } from "react";
import styled from "styled-components";
import auth, { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  height: 150px;
  resize: none;
  &::placeholder {
    font-size: 16px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;
const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;
const AttachFileInput = styled.input`
  display: none;
`;
const SubmitBtn = styled.button`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.8;
  }
`;

export default function PostTweetForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      // 복수 파일 업로드 가능
      setFile(files[0]);
      const bytesUnit = ["KB", "MB", "GB", "TB"];

      let uploadsize = files[0].size;
      let digit = -1;

      while (uploadsize > 1024) {
        uploadsize /= 1024;
        digit++;
      }

      console.log(files[0].size);
      console.log(
        `Your File size is ${uploadsize.toFixed(2) + bytesUnit[digit]}.`
      );

      const limit = 1024 ** 2; // 1MB
      if (files[0].size >= limit) {
        alert("Please add file that is 1MB or less");
        setFile(null);
      }
    }
    // byte -> MB -> 1000,000
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    console.log(user);
    if (!user || isLoading || tweet === "" || tweet.length > 180) return;

    // 데이터를 클라우드 데이터베이스와 스토리지에 업로드하고 다운로드 URL을 통해 둘을 연결
    try {
      setIsLoading(true);
      const doc = await addDoc(collection(db, "tweets"), {
        // firestore, 데이터베이스에 아래 객체로 이루어진 컬렉션의 문서 추가
        // addDoc은 문서에 대한 참조 promise를 반환하며, 각 document에게 자동으로 id 부여.
        tweet,
        createAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId: user.uid, // uid : user Id
      });
      if (file) {
        // 지정한 URL로의 storage 레퍼런스 생성
        const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);
        const result = await uploadBytes(locationRef, file); // document 생성 후 이미지를 첨부한다면 이 경로에 저장됨
        const url = await getDownloadURL(result.ref); // 업로드한 파일의 URL get

        await updateDoc(doc, {
          // Doc 업데이트
          photo: url,
        });

        setTweet("");
        setFile(null);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        rows={5}
        maxLength={160}
        onChange={onChange}
        value={tweet}
        placeholder="What is happening"
      ></TextArea>
      <AttachFileButton htmlFor="file">
        {file ? "Photo added ✅" : "Add Photo"}
      </AttachFileButton>
      <AttachFileInput
        onChange={onFileChange}
        type="file"
        id="file"
        accept="image/*"
      />
      <SubmitBtn type="submit">
        {isLoading ? "Posting..." : "Post Tweet"}
      </SubmitBtn>
    </Form>
  );
}
