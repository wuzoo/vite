import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";

export interface ITweet {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createAt: number;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export default function TimeLine() {
  const [tweets, setTweet] = useState<ITweet[]>([]);
  const fetchTweets = async () => {
    const tweetsQuery = query(
      // 쿼리, 데이터 가져오기
      collection(db, "tweets"), // 컬렉션 설정
      orderBy("createAt", "desc") // 날짜 순으로 정렬
    );
    const snapshot = await getDocs(tweetsQuery); // 퀴리로 특정 Document get
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createAt, userId, username, photo } = doc.data();
      return {
        tweet,
        createAt,
        userId,
        username,
        photo,
        id: doc.id, // id는 문서 자체의 id, collection에 포함되지 않음
      };
    });
    setTweet(tweets);
  };
  useEffect(() => {
    fetchTweets();
  });

  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
