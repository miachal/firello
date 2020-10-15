import React from 'react';
import ReactLoading from 'react-loading';
import { LoadingContainer } from './styles';

export const Loading = () => (
  <LoadingContainer>
    <ReactLoading type='bars' />
    Loading board...
  </LoadingContainer>
);
