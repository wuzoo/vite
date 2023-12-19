import { atom } from "recoil";

interface IEditTweet {
  userId: string;
  photo?: string;
  id: string;
  tweet: string;
}

export const EditClicked = atom({
  key: "EditClicked",
  default: false,
});

export const EditTweet = atom<IEditTweet>({
  key: "EditTweet",
  default: {
    userId: "",
    photo: "",
    id: "",
    tweet: "",
  },
});
