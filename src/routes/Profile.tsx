import styled from "styled-components";
import auth, { storage } from "../firebase";
import { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;
const AvatarUploadBtn = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;
const AvatarInput = styled.input`
  display: none;
`;
const AvatarImg = styled.img`
  width: 100%;
`;
const Name = styled.span`
  font-size: 22px;
`;

export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);

  const onInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
    const { files } = e.target;
    if (!user) return;

    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`); // avatars 폴더에 유저 ID로 사진 업로드
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);

      setAvatar(avatarUrl);

      await updateProfile(user, {
        photoURL: avatarUrl,
      });
    }
  };

  return (
    <Wrapper>
      <AvatarUploadBtn htmlFor="avatar">
        {Boolean(avatar) ? (
          <AvatarImg src={avatar || ""} />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
              clip-rule="evenodd"
            />
          </svg>
        )}
      </AvatarUploadBtn>
      <AvatarInput
        onChange={onInputChange}
        id="avatar"
        type="file"
        accept="image/*"
      />
      <Name>{user?.displayName ?? "Anonymous"}</Name>
    </Wrapper>
  );
}
