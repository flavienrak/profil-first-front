'use client';

import React from 'react';
import Image from 'next/image';
import Popup from '@/components/utils/Popup';
import Footer from '@/components/utils/Footer';
import UserSidebar from '@/components/role/candidat/UserSidebar';
import PrimaryButton from '@/components/utils/role/user/button/PrimaryButton';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { updateUserInfosService } from '@/services/user.service';
import { updateUserReducer } from '@/redux/slices/user.slice';
import { welcomeMessage } from '@/lib/conditions/welcome';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default function UserSideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useSelector((state: RootState) => state.user);
  const { showMenu, showFooter } = useSelector(
    (state: RootState) => state.persistInfos,
  );

  const dispatch = useDispatch();

  const [showConditions, setShowConditions] = React.useState(false);
  const [showFreeUse, setShowFreeUse] = React.useState(false);
  const [conditionsLoading, setConditionsLoading] = React.useState(false);
  const [freeUseLoading, setFreeUseLoading] = React.useState(false);
  const [acceptConditions, setAcceptConditions] = React.useState(false);

  React.useEffect(() => {
    if (user?.userInfos) {
      setShowConditions(!user.userInfos.acceptConditions);
      setShowFreeUse(
        user.userInfos.acceptConditions && !user.userInfos.acceptFreeUse,
      );
    }
  }, [user?.userInfos]);

  const handleAcceptConditions = async () => {
    setConditionsLoading(true);
    const res = await updateUserInfosService({ acceptConditions: true });

    if (res.userInfos) {
      dispatch(updateUserReducer({ user: { userInfos: res.userInfos } }));
    }
    setConditionsLoading(false);
  };

  const handleAcceptFreeUse = async () => {
    setFreeUseLoading(true);
    const res = await updateUserInfosService({ acceptFreeUse: true });

    if (res.userInfos) {
      dispatch(updateUserReducer({ user: { userInfos: res.userInfos } }));
    }
    setFreeUseLoading(false);
  };

  return (
    <div className="relative flex w-full min-h-screen [background-image:var(--bg-primary)] overflow-hidden">
      <UserSidebar showMenu={showMenu} />
      <div
        className={`w-full h-screen flex flex-col transition-[max-width] duration-500  ${
          showMenu ? 'max-w-[calc(100%-16rem)]' : 'max-w-[calc(100%-5rem-1px)]'
        }`}
      >
        {showConditions ? (
          <Popup>
            <div className="h-[26rem] w-[30rem] flex flex-col justify-between gap-6 px-4 pb-4">
              <h2 className="font-bold text-5xl text-center leading-16 text-[var(--u-primary-color)]">
                Bienvenue sur Profil First CV !
              </h2>
              <div className="max-h-[55vh] flex flex-col gap-4 text-[var(--text-primary-color)] rounded-md overflow-y-auto">
                {welcomeMessage.map((item) => (
                  <p key={`welcome-message-${item.id}`}>{item.value}</p>
                ))}
              </div>
              <div className="flex flex-col gap-12">
                <div className="flex items-center justify-center gap-3">
                  <Checkbox
                    id="terms"
                    checked={acceptConditions}
                    onCheckedChange={(checked: boolean) =>
                      setAcceptConditions(checked)
                    }
                    className="cursor-pointer border-[var(--text-primary-color)]"
                  />
                  <Label htmlFor="terms" className="text-lg">
                    J'accepte les règles d'utilisation du site
                  </Label>
                </div>
                <div className="flex justify-center">
                  <PrimaryButton
                    label="Valider"
                    isLoading={conditionsLoading}
                    onClick={handleAcceptConditions}
                    className={`w-1/2 h-12 px-8 text-base rounded-lg ${
                      !acceptConditions
                        ? 'pointer-events-none opacity-80 bg-[var(--bg-primary-color)] text-[var(--text-primary-color)]'
                        : ''
                    }`}
                  />
                </div>
              </div>
            </div>
          </Popup>
        ) : showFreeUse ? (
          <Popup large>
            <div className="w-[40rem] h-[75vh] flex flex-col justify-between gap-5 px-4 pb-4">
              <h2 className="font-bold text-center text-5xl leading-14 text-[var(--u-primary-color)]">
                Utiliser gratuitement vos <br />
                10 000 crédits IA <br />
                pour tester Profil First
              </h2>
              <div className="max-h-[40vh] flex justify-center select-none">
                <Image
                  src="/free-use.png"
                  alt="Free Use"
                  height={300}
                  width={300}
                  className=""
                />
              </div>
              <div className="flex justify-center">
                <PrimaryButton
                  label="Démarrer"
                  isLoading={freeUseLoading}
                  onClick={handleAcceptFreeUse}
                  className="w-1/2 h-12 px-8 text-base rounded-lg"
                />
              </div>
            </div>
          </Popup>
        ) : (
          <div
            className={`h-full transition-[max-height] duration-500 ${
              showFooter ? 'max-h-[calc(100vh-5rem)]' : 'max-h-screen'
            }`}
          >
            {children}
          </div>
        )}
        <Footer />
      </div>
    </div>
  );
}
