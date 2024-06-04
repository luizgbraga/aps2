import React from 'react';

import { AdminLayout } from '../../layout/admin/AdminLayout';
import { useAsync } from '../../utils/async';
import { OccurrenceModel } from '../../api/occurrences';
import { Descriptions, Flex, Table, Tabs, TabsProps } from 'antd';
import { Bar, Pie } from '@ant-design/plots';
import DescriptionsItem from 'antd/es/descriptions/Item';
import { MessageModel } from '../../api/messages';
// import { SensorModel } from '../../api/sensor';
// import { useMap } from '../../components/useMap';

interface NeighborhoodFilter {
  text: string;
  value: string;
}

const occurrenceType = {
  flooding: 'Alagamento',
  landslide: 'Deslizamento',
  congestion: 'Congestionamento',
};

export const AHome: React.FC = () => {
  const res = useAsync(() => OccurrenceModel.listApproved());
  const messages = useAsync(() => MessageModel.all());
  console.log(res);
  const countPerZone = useAsync(() => OccurrenceModel.countPerZone());
  const countPerType = useAsync(() => OccurrenceModel.countPerType());
  // const sensors = useAsync(() => SensorModel.list());
  const neighborhoodAdded: string[] = [];
  const neighborhoodFilters = res.result
    ? res.result.reduce((prev: NeighborhoodFilter[], curr) => {
      if (!neighborhoodAdded.includes(curr.neighborhood.name)) {
        neighborhoodAdded.push(curr.neighborhood.name);
        prev.push({
          text: curr.neighborhood.name,
          value: curr.neighborhood.name,
        });
      }
      return prev;
    }, [])
    : [];
  // const ref = useRef<HTMLDivElement>(null);

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Resumo',
      children: (
        <Flex style={{ height: '340px' }}>
          <Flex style={{ width: '50%' }}>
            <Bar data={countPerZone.result} xField="zone" yField="count" />
          </Flex>
          <Flex style={{ width: '50%' }}>
            <Pie
              data={countPerType.result}
              angleField="count"
              colorField="type"
            />
          </Flex>
        </Flex>
      ),
    },
    {
      key: '2',
      label: 'Ocorrências',
      children: (
        <Table
          columns={[
            {
              title: 'Bairro',
              dataIndex: 'neighborhood',
              key: 'neighborhood',
              filters: neighborhoodFilters,
              filterMode: 'tree',
              filterSearch: false,
              onFilter: (value, record) =>
                record.neighborhood.startsWith(value as string),
            },
            {
              title: 'Zona',
              dataIndex: 'zone',
              key: 'zone',
            },
            {
              title: 'Data de criação',
              dataIndex: 'createdAt',
              key: 'createdAt',
            },
          ]}
          expandable={{
            expandedRowRender: (record) => (
              <div>
                <Descriptions title="Detalhes da ocorrência">
                  <DescriptionsItem label="Descrição">
                    {record.occurrence.description}
                  </DescriptionsItem>
                  <DescriptionsItem label="Tipo de ocorrência">
                    {occurrenceType[record.occurrence.type]}
                  </DescriptionsItem>
                  <DescriptionsItem label="Localização">
                    Lat: {record.occurrence.latitude} | Long:{' '}
                    {record.occurrence.longitude}
                  </DescriptionsItem>
                  <DescriptionsItem
                    label={
                      record.occurrence.type === 'flooding'
                        ? 'Índice pluviométrico'
                        : record.occurrence.type === 'landslide'
                          ? 'Índice de terra'
                          : 'Congestionamento'
                    }
                  >
                    {record.sensor
                      ? record.sensor[record.occurrence.type]
                      : ' Não há sensores nesta área'}
                  </DescriptionsItem>
                </Descriptions>
              </div>
            ),
            rowExpandable: (record) =>
              record.occurrence.description ? true : false,
            expandRowByClick: true,
          }}
          dataSource={res.result?.map((row) => ({
            key: row.occurrence.id,
            neighborhood: row.neighborhood.name,
            zone: row.neighborhood.zone,
            createdAt: row.occurrence.createdAt,
            occurrence: row.occurrence,
            sensor: row.sensor,
          }))}
          bordered
          loading={res.loading}
          rowKey={(record) => record.occurrence.id}
          pagination={{ pageSize: 10, hideOnSinglePage: true }}
          rowClassName={(record) => {
            if (record.occurrence.type === 'flooding') {
              return 'blue-row';
            } else if (record.occurrence.type === 'landslide') {
              return 'brown-row';
            } else if (record.occurrence.type === 'congestion') {
              return 'red-row';
            } else {
              return '';
            }
          }}
        />
      ),
    },
    {
      key: '3',
      label: 'Mensagens Operacionais',
      children: (
        <Table
          columns={[
            {
              title: 'Mensagem',
              dataIndex: 'text',
              key: 'text',
            },
            {
              title: 'Rota',
              dataIndex: 'route',
              key: 'route',
            },
            {
              title: 'Data de criação',
              dataIndex: 'createdAt',
              key: 'createdAt',
            },
          ]}
          dataSource={messages.result?.map((row) => ({
            key: row.message.id,
            text: row.message.text,
            route: row.route.long_name,
            createdAt: row.message.createdAt,
          }))}
          bordered
          loading={res.loading}
          rowKey={(record) => record.key}
          pagination={{ pageSize: 10, hideOnSinglePage: true }}
        />
      )
    },
    {
      key: '4',
      label: 'Sensores',
      children: <div>sensores aq</div>
    },
  ];

  return (
    <AdminLayout selected="dashboard" title="Dashboard">
      <Tabs defaultActiveKey="1" items={items} />
    </AdminLayout>
  );
};
