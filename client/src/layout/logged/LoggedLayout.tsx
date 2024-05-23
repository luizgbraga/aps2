import React from 'react';
import { BaseLayout } from '../BaseLayout';

type Props = {
  children: React.ReactNode;
  selected: string;
  projectless?: boolean;
  title?: string;
  extra?: React.ReactNode;
  refetch?: () => void;
};

export const LoggedLayout: React.FC<Props> = (props: Props) => {
  return <BaseLayout {...props} />;
};
