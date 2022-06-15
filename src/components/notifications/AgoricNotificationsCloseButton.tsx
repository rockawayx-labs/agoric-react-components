import React from 'react';
import {IoCloseOutline} from 'react-icons/io5';
import {CloseButtonProps} from 'react-toastify/dist/components';
import styled from 'styled-components';
import theme from '../../theme';

const StyledButton = styled.button`
  all: unset;
  display: flex;
  align-items: center;
`;

export function AgoricNotificationsCloseButton({closeToast}: CloseButtonProps) {
  return (
    <StyledButton onClick={closeToast}>
      <IoCloseOutline size={20} color={theme.colors.text3} />
    </StyledButton>
  );
}
