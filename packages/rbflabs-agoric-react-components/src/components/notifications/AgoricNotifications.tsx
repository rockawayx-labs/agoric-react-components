import React, {useEffect, useRef} from 'react';
import {Id, toast, ToastContainer, ToastOptions} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAgoricWalletContext from '../../hooks/useAgoricWalletContext';
import {usePrevious} from '../../hooks/usePrevious';
import {AgoricNotificationsCloseButton} from './AgoricNotificationsCloseButton';
import {AgoricNotificationsGroup} from './AgoricNotificationsGroup';
import {AgoricNotificationsToast} from './AgoricNotificationsToast';
import {getConnectNotificationData} from './getConnectNotificationData';
import {getOfferNotificationData} from './getOfferNotificationData';
import {getUpdatedOffer} from './getUpdatedOffer';

const containerId = 'AgoricNotifications';

const defaultToastOptions: ToastOptions = {
  closeOnClick: true,
  draggable: false,
  hideProgressBar: false,
  position: 'bottom-left',
};

interface AgoricNotificationsProps {
  groups?: AgoricNotificationsGroup[];
}

const DEFAULT_GROUPS = [AgoricNotificationsGroup.Connect, AgoricNotificationsGroup.Offer];

export function AgoricNotifications({groups = DEFAULT_GROUPS}: AgoricNotificationsProps = {}) {
  const {offers, walletState} = useAgoricWalletContext();
  const previousOffers = usePrevious(offers);
  const connectToastId = useRef<Id>(0);

  useEffect(() => {
    if (!groups?.includes(AgoricNotificationsGroup.Connect) || !walletState) {
      return;
    }

    const {autoClose, text, type} = getConnectNotificationData(walletState);

    const options: ToastOptions = {...defaultToastOptions, autoClose, containerId};

    if (toast.isActive(connectToastId.current)) {
      toast.update(connectToastId.current, {
        ...options,
        render: () => <AgoricNotificationsToast text={text} type={type} />,
      });
    } else {
      connectToastId.current = toast(<AgoricNotificationsToast text={text} type={type} />, options);
    }
  }, [connectToastId, walletState, groups]);

  useEffect(() => {
    if (!groups?.includes(AgoricNotificationsGroup.Offer)) {
      return;
    }

    const updatedOffer = getUpdatedOffer(previousOffers, offers ?? []);

    if (updatedOffer) {
      const {id, status} = updatedOffer;
      const {autoClose, text, type} = getOfferNotificationData(id, status);

      const options: ToastOptions = {...defaultToastOptions, autoClose, containerId};

      if (toast.isActive(id)) {
        toast.update(id, {
          ...options,
          render: () => <AgoricNotificationsToast text={text} type={type} />,
        });
      } else {
        toast(<AgoricNotificationsToast text={text} type={type} />, {
          ...options,
          toastId: id,
        });
      }
    }
  }, [groups, offers]);

  return (
    <ToastContainer
      enableMultiContainer
      containerId={containerId}
      closeOnClick={false}
      newestOnTop={true}
      closeButton={AgoricNotificationsCloseButton}
    />
  );
}
