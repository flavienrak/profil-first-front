'use client';

import React from 'react';
import io, { Socket } from 'socket.io-client';

import { RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { QualiCarriereChatInterface } from '@/interfaces/quali-carriere/chatInterface';
import {
  newMessageReducer,
  setQuestionReducer,
} from '@/redux/slices/qualiCarriere.slice';
import { QualiCarriereQuestionInteface } from '@/interfaces/quali-carriere/questionInterface';
import { SectionInfoInterface } from '@/interfaces/cv-minute/sectionInfo.interface';

interface SocketContextType {
  isSocketReady: boolean;
  onlineUsers: string[];
  isLoadingResponse: boolean;
  setIsLoadingResponse: React.Dispatch<React.SetStateAction<boolean>>;
  isLoadingQuestion: boolean;
  setIsLoadingQuestion: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SocketContext = React.createContext<SocketContextType | undefined>(
  undefined,
);

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [isSocketReady, setIsSocketReady] = React.useState(false);
  const [onlineUsers, setOnlineUsers] = React.useState<string[]>([]);
  const [isLoadingResponse, setIsLoadingResponse] = React.useState(false);
  const [isLoadingQuestion, setIsLoadingQuestion] = React.useState(false);

  React.useEffect(() => {
    if (user?.id && apiUrl) {
      const newSocket = io(apiUrl, { query: { id: user.id } });
      setSocket(newSocket);
    }
  }, [user?.id]);

  React.useEffect(() => {
    if (socket) {
      socket.on('roomJoined', () => {
        setIsSocketReady(true);
      });

      socket.on('getOnlineUsers', (users: string[]) => {
        setOnlineUsers(users);
      });

      socket.on(
        'qualiCarriereMessage',
        (message: QualiCarriereChatInterface) => {
          dispatch(newMessageReducer({ message }));
          setIsLoadingResponse(true);
        },
      );

      socket.on(
        'qualiCarriereQuestion',
        ({
          experience,
          question,
          totalQuestions,
        }: {
          experience: SectionInfoInterface;
          question: QualiCarriereQuestionInteface;
          totalQuestions: number;
        }) => {
          dispatch(
            setQuestionReducer({
              experience,
              qualiCarriereQuestion: question,
              totalQuestions,
            }),
          );
          setIsLoadingQuestion(true);
        },
      );

      return () => {
        socket.off('roomJoined');

        socket.off('getOnlineUsers');
        socket.off('qualiCarriereMessage');
        socket.off('qualiCarriereQuestion');

        socket.disconnect();
      };
    }
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{
        isSocketReady,
        onlineUsers,
        isLoadingResponse,
        setIsLoadingResponse,
        isLoadingQuestion,
        setIsLoadingQuestion,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
