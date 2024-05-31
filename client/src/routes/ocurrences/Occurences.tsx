import { Button, Drawer, Select, Space, Table } from 'antd';
import React, { useState } from 'react';
import { OccurenceModel } from '../../api/occurences';
import Cards from './Card';
import { useAsync } from '../../utils/async';
import { NeighborhoodModel } from '../../api/neighborhood';
import { LoggedLayout } from '../../layout/logged/LoggedLayout';
import { SubscriptionModel } from '../../api/subscription';

const Notifications: React.FC = () => {
  const { result: occurenceList } = useAsync(() => OccurenceModel.list());
  const { result: neighborhoods } = useAsync(() => NeighborhoodModel.list());
  const { result: subscriptions } = useAsync(() => SubscriptionModel.list());
  const [openDrawer, setOpenDrawer] = useState(false);
  const [neighborhoodToSubscribe, setNeighborhoodToSubscribe] = useState<
    string[]
  >([]);

  const subscribe = () => {
    const promises = [] as Promise<SubscriptionModel>[];
    neighborhoodToSubscribe.forEach((id) => {
      promises.push(SubscriptionModel.subscribe(id));
    });
    Promise.all(promises).then(() => {
      setOpenDrawer(false);
    });
  };

  return (
    <LoggedLayout
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
            key={occ.occurence.id}
            {...{
              id: occ.occurence.id,
              type: occ.occurence.type,
              latitude: occ.occurence.latitude,
              longitude: occ.occurence.longitude,
              neighborhoodId: occ.occurence.neighborhoodId,
              description: occ.occurence.description,
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
          mode="multiple"
          placeholder="Select neighborhood"
          style={{ width: '100%' }}
          options={neighborhoods?.map((n) => ({ label: n.name, value: n.id }))}
          onChange={(value) => setNeighborhoodToSubscribe(value)}
        />
        <Button
          type="primary"
          onClick={subscribe}
          style={{ marginTop: '20px' }}
        >
          Bora
        </Button>
        <Table
          columns={[
            {
              title: 'Neighborhood',
              dataIndex: 'neighborhood',
              key: 'neighborhood',
            },
          ]}
          dataSource={subscriptions?.map((s) => ({
            key: s.id,
            neighborhood: s.name,
          }))}
        />
      </Drawer>
    </LoggedLayout>
  );
};

export default Notifications;
