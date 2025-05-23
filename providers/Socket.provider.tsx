'use client';

import React from 'react';
import io, { Socket } from 'socket.io-client';

import { RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { QualiCarriereChatInterface } from '@/interfaces/role/user/quali-carriere/chatInterface';
import {
  newMessageReducer,
  setQuestionReducer,
} from '@/redux/slices/role/user/qualiCarriere.slice';
import { QualiCarriereQuestionInteface } from '@/interfaces/role/user/quali-carriere/questionInterface';
import { SectionInfoInterface } from '@/interfaces/role/user/cv-minute/sectionInfo.interface';
import { CvThequeCritereInterface } from '@/interfaces/role/recruiter/cvtheque/cvtheque-critere.interface';
import { setCvThequeCritereReducer } from '@/redux/slices/role/recruiter/cvtheque.slice';

interface SocketContextType {
  isSocketReady: boolean;
  onlineUsers: string[];
  isLoadingResponse: boolean;
  isLoadingQuestion: boolean;
  setIsLoadingResponse: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoadingQuestion: React.Dispatch<React.SetStateAction<boolean>>;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const SocketContext = React.createContext<SocketContextType | undefined>(
  undefined,
);

export const useSocket = (): SocketContextType => {
  const context = React.useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

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

      socket.on(
        'cvThequeCritere',
        (cvThequeCritere: CvThequeCritereInterface) => {
          dispatch(setCvThequeCritereReducer({ cvThequeCritere }));
        },
      );

      return () => {
        socket.off('roomJoined');

        socket.off('getOnlineUsers');
        socket.off('qualiCarriereMessage');
        socket.off('qualiCarriereQuestion');
        socket.off('cvThequeCritere');

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
