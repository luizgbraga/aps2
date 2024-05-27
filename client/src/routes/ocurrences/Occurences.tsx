import { Button, Drawer, Select, Space } from 'antd';
import React, { useState } from 'react';
import { OccurenceModel } from '../../api/occurences';
import { BaseLayout } from '../../layout/BaseLayout';
import Cards from './Card';
import { useAsync } from '../../utils/async';
import { NeighborhoodModel } from '../../api/neighborhood';

const Notifications: React.FC = () => {
  const { result: occurenceList } = useAsync(() => OccurenceModel.list());
  const { result: neighborhoods } = useAsync(() => NeighborhoodModel.list());
  const [openDrawer, setOpenDrawer] = useState(false);

  const subscribe = () => {
    console.log('todo');
  };

  return (
    <BaseLayout
      selected="notifications"
      title="Notifications"
      extra={
        <Button
          type="primary"
          style={{ marginTop: '10px' }}
          onClick={() => setOpenDrawer(true)}
        >
          Subscribe
        </Button>
      }
    >
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        {occurenceList?.map((occ) => (
          <Cards
            key={occ.id}
            {...{
              id: occ.id,
              type: occ.type,
              latitude: occ.latitude,
              longitude: occ.longitude,
              neighborhoodId: occ.neighborhoodId,
              description: occ.description,
            }}
          />
        ))}
      </Space>
      <Drawer
        title="Subscribe to neighborhood"
        placement="right"
        closable={true}
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        width={500}
      >
        <Select
          placeholder="Select neighborhood"
          style={{ width: '100%' }}
          options={neighborhoods?.map((n) => ({ label: n.name, value: n.id }))}
        />
        <Button type="primary" onClick={subscribe}>
          Bora
        </Button>
      </Drawer>
    </BaseLayout>
  );
};

export default Notifications;
