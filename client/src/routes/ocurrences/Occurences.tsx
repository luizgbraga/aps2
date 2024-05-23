import React from 'react';
import { BaseLayout } from '../../layout/BaseLayout';
import Cards from './Card';
import { OccurenceDTO } from '../../api/occurences';
import { Space } from 'antd';

const Notifications: React.FC = () => {
  const data: OccurenceDTO[] = [
    {
      id: '1',
      latitude: '1',
      longitude: '1',
      description: 'test',
    },
    {
      id: '2',
      latitude: '1',
      longitude: '1',
      description: 'test',
    },
    {
      id: '3',
      latitude: '1',
      longitude: '1',
      description: 'test',
    },
    {
      id: '4',
      latitude: '1',
      longitude: '1',
      description: 'test',
    },
  ];

  return (
    <BaseLayout selected="notifications" title="Notifications">
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        {data.map((occ) => (
          <Cards key={occ.id} {...occ} />
        ))}
      </Space>
    </BaseLayout>
  );
};

export default Notifications;
