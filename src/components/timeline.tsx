import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";
import { Unsubscribe } from "firebase/auth";

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
  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    const fetchTweets = async () => {
      const tweetsQuery = query(
        // 쿼리, 데이터 가져오기
        collection(db, "tweets"), // 컬렉션 설정
        orderBy("createAt", "desc"), // 날짜 순으로 정렬
        limit(25) // 최대 25개
      );
      // onSnapshot 함수는 구독 취소 함수를 반환.
      // 즉, 유저가 해당화면을 보고 있지 않다면 리스너를 킬 필요가 x
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
        // 문서를 한번만 가져오는 것 대신에, 쿼리에 리스너를 추가하는 것
        // 무언가가 삭제, 편집, 생성되면 해당 쿼리의 문서를 보면서 필요한 데이터를 추출.
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
      });
    };

    fetchTweets();

    return () => {
      unsubscribe && unsubscribe(); // 컴포넌트 cleanup 시 현재 unsubscribe가 활성화되어있다면, 호출하여 구독 취소(즉 리스너 종료)
    };
  }, []);

  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
