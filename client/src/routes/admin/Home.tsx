import React from 'react';

import { AdminLayout } from '../../layout/admin/AdminLayout';
import { useAsync } from '../../utils/async';
import { OccurenceModel } from '../../api/occurences';
import { Descriptions, Table } from 'antd';
import DescriptionsItem from 'antd/es/descriptions/Item';

interface NeighborhoodFilter {
  text: string,
  value: string
}

const occurenceType = {
  flooding: 'Alagamento',
  landslide: 'Deslizamento',
  congestion: 'Congestionamento'
}

export const AHome: React.FC = () => {
  const res = useAsync(() => OccurenceModel.listApproved());
  const neighborhoodAdded: string[] = [];
  const neighborhoodFilters = res.result ? res.result.reduce((prev: NeighborhoodFilter[], curr) => {
    if (!neighborhoodAdded.includes(curr.neighborhood.name)) {
      neighborhoodAdded.push(curr.neighborhood.name);
      prev.push({ text: curr.neighborhood.name, value: curr.neighborhood.name });
    }
    return prev
  }, []) : [];

  return (
    <AdminLayout selected="dashboard" title="Dashboard">
      <Table
        columns={[
          {
            title: 'Bairro',
            dataIndex: ['neighborhood', 'name'],
            key: 'neighborhood',
            filters: neighborhoodFilters,
            filterMode: 'tree',
            filterSearch: false,
            onFilter: (value, record) => record.neighborhood.name.startsWith(value as string),
          },
          {
            title: 'Zona',
            dataIndex: ['neighborhood', 'zone'],
            key: 'description'
          },
          {
            title: 'Data de criação',
            dataIndex: ['occurence', 'createdAt'],
            key: 'createdAt'
          },
        ]}
        expandable={{
          expandedRowRender: (record) => (<div>
            <Descriptions title="Detalhes da ocorrência">
              <DescriptionsItem label="Descrição">{record.occurence.description}</DescriptionsItem>
              <DescriptionsItem label="Tipo de ocorrência">{occurenceType[record.occurence.type]}</DescriptionsItem>
              <DescriptionsItem label="Índice pluviométrico">{record.occurence.updatedAt?.toLocaleString()}</DescriptionsItem>
              <DescriptionsItem label="Índice pluviométrico">{record.occurence.description}</DescriptionsItem>
              <DescriptionsItem label="Índice pluviométrico">{record.occurence.description}</DescriptionsItem>
              <DescriptionsItem label="Índice pluviométrico">{record.occurence.description}</DescriptionsItem>
            </Descriptions>
          </div>),
          rowExpandable: (record) => record.occurence.description ? true : false,
          expandRowByClick: true
        }}
        dataSource={res.result!}
        bordered
        loading={res.loading}
        rowKey={(record) => record.occurence.id}
        pagination={{ pageSize: 10, hideOnSinglePage: true }}
        rowClassName={(record) => {
          if (record.occurence.type === 'flooding') {
            return 'blue-row';
          } else if (record.occurence.type === 'landslide') {
            return 'brown-row';
          } else if (record.occurence.type === 'congestion') {
            return 'red-row';
          }else {
            return '';
          }
        }}
      />
    </AdminLayout>
  );
};
