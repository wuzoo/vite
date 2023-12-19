import styled from "styled-components";
import { ITweet } from "./timeline";
import auth, { db, storage } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useSetRecoilState } from "recoil";
import { EditClicked, EditTweet } from "../atoms/atom";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 4fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;
const Column = styled.div``;
const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;
const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;
const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  margin-top: 10px;
  padding: 5px 10px;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 5px;
`;

const EditButton = styled(DeleteButton)`
  background-color: white;
  color: black;
  margin-left: 8px;
`;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
  const setEditStatus = useSetRecoilState(EditClicked);
  const setEditTweet = useSetRecoilState(EditTweet);

  const user = auth.currentUser;

  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this tweet?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  const onEdit = () => {
    setEditTweet({
      userId,
      photo,
      id,
      tweet,
    });
    setEditStatus(true);
  };

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        <Payload>{tweet}</Payload>
        {user?.uid === userId ? (
          <>
            <DeleteButton onClick={onDelete}>Delete</DeleteButton>
            <EditButton onClick={() => onEdit()}>Edit</EditButton>
          </>
        ) : null}
      </Column>
      <Column>{photo && <Photo src={photo} />}</Column>
    </Wrapper>
  );
}
