import React from 'react';

import { AdminLayout } from '../../layout/admin/AdminLayout';
import { useAsync } from '../../utils/async';
import { RoutesModel } from '../../api/route';
import { Table } from 'antd';

export const ABus: React.FC = () => {
  const res = useAsync(() => RoutesModel.getAllRoutes());
  return (
    <AdminLayout selected="bus" title=" Ônibus">
      <Table
        columns={[
          {
            title: 'Identificador',
            dataIndex: 'short_name',
            key: 'short_name',
          },
          {
            title: 'Nome',
            dataIndex: 'long_name',
            key: 'long_name',
          },
          {
            title: 'Ações',
            key: 'actions',
            render: (route) => (
              <span>
                <a href={`/_admin/bus/${route.id}`}>Ver rota</a>
              </span>
            ),
          },
        ]}
        dataSource={res.result!}
        loading={res.loading}
        rowKey="id"
        pagination={{ pageSize: 8 }}
      />
    </AdminLayout>
  );
};
