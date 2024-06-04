import {
  DeleteOutlined,
  PushpinOutlined,
  WarningOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Descriptions,
  Drawer,
  Flex,
  Rate,
  Select,
  Space,
  Table,
  Tag,
} from 'antd';
import React, { useState } from 'react';
import { NeighborhoodModel } from '../../api/neighborhood';
import { OccurrenceModel } from '../../api/occurrences';
import { SubscriptionModel } from '../../api/subscription';
import { LoggedLayout } from '../../layout/logged/LoggedLayout';
import { useAsync } from '../../utils/async';
import { dateDistance } from '../../utils/time';
import { translateType } from '../../utils/translate';

const Notifications: React.FC = () => {
  const { result: occurrenceList } = useAsync(() => OccurrenceModel.list());
  const { result: neighborhoods } = useAsync(() => NeighborhoodModel.list());
  const { result: subscriptions, refetch: refetchSubscriptions } = useAsync(
    () => SubscriptionModel.list()
  );
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
      refetchSubscriptions();
    });
  };

  const unsubscribe = (neighborhoodId: string) => {
    SubscriptionModel.unsubscribe(neighborhoodId).then(() => {
      refetchSubscriptions();
    });
  };

  return (
    <LoggedLayout
      selected="notifications"
      title="Notificações"
      extra={
        <Button
          type="primary"
          onClick={() => setOpenDrawer(true)}
          icon={<PlusOutlined />}
        >
          Inscrever-se em bairros
        </Button>
      }
    >
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        {occurrenceList?.occurrences.map((occ, i) => (
          <Card
            title={
              <span>
                {translateType(occ.occurrence.type)}
                <span style={{ fontWeight: '400' }}>
                  {' - '}
                  {dateDistance(occ.occurrence.createdAt as Date, true)}
                  {i < occurrenceList.unread && (
                    <Tag color="red" style={{ marginLeft: '10px' }}>
                      Não lida
                    </Tag>
                  )}
                </span>
              </span>
            }
            extra={<Button icon={<PushpinOutlined />}>Ver no mapa</Button>}
          >
            <Descriptions
              column={1}
              layout="horizontal"
              items={[
                {
                  key: '1',
                  label: 'Bairro',
                  children: occ.neighborhood.name,
                },
                {
                  key: '2',
                  label: 'Descrição',
                  children: occ.occurrence.description,
                },
                {
                  key: '3',
                  label: 'Gravidade',
                  children: (
                    <Rate
                      defaultValue={3}
                      character={<WarningOutlined />}
                      disabled
                    />
                  ),
                },
              ]}
            />
          </Card>
        ))}
      </Space>
      <Drawer
        title="Inscreva-se em bairros"
        placement="right"
        closable={true}
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        width={500}
      >
        <Flex
          align="center"
          justify="space-between"
          gap={10}
          style={{ marginBottom: '20px' }}
        >
          <Select
            mode="multiple"
            placeholder="Selecionar bairros"
            style={{ width: '100%' }}
            options={neighborhoods?.map((n) => ({
              label: n.name,
              value: n.id,
            }))}
            onChange={(value) => setNeighborhoodToSubscribe(value)}
            filterOption={(inputValue, option) => {
              if (!option) return false;
              return option.label
                .toLowerCase()
                .includes(inputValue.toLowerCase());
            }}
          />
          <Button type="primary" onClick={subscribe}>
            Inscrever-se
          </Button>
        </Flex>
        <Table
          columns={[
            {
              title: 'Bairro',
              dataIndex: 'neighborhood',
              key: 'neighborhood',
              render: (_, rec) => (
                <Flex align="center" justify="space-between">
                  {rec.neighborhood}
                  <Button
                    onClick={() => unsubscribe(rec.key)}
                    type="primary"
                    danger
                  >
                    <DeleteOutlined />
                  </Button>
                </Flex>
              ),
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
