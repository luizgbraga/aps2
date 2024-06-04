import React, { useState } from 'react';

import { Button, Card, Descriptions, Flex, Spin, Typography } from 'antd';
import { DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import { AdminLayout } from '../../layout/admin/AdminLayout';
import { useAsync } from '../../utils/async';
import { OccurrenceModel } from '../../api/occurrences';
import { translateType } from '../../utils/translate';
import { dateDistance } from '../../utils/time';

export const AApproval: React.FC = () => {
  const [loading, setLoading] = useState(-1);
  const {
    result: occurrencesToApprove,
    refetch,
    loading: loadingOccurrences,
  } = useAsync(() => OccurrenceModel.listToApprove());
  const approveOccurrence = (id: string, i: number) => {
    setLoading(i);
    OccurrenceModel.confirm(id).then(() => {
      refetch();
      setLoading(-1);
    });
  };
  const deleteOccurrence = (id: string, i: number) => {
    setLoading(i);
    OccurrenceModel.delete(id).then(() => {
      refetch();
      setLoading(-1);
    });
  };

  return (
    <AdminLayout selected="approve" title="Aprovação de ocorrências">
      {loadingOccurrences && (
        <Flex
          justify="center"
          align="center"
          style={{ width: '100%', height: '400px' }}
        >
          <Spin />
        </Flex>
      )}
      {!loadingOccurrences && !occurrencesToApprove?.length && (
        <Flex
          justify="center"
          align="center"
          style={{ width: '100%', height: '400px' }}
        >
          <Typography.Text type="secondary">
            Não há ocorrências para aprovar
          </Typography.Text>
        </Flex>
      )}
      <Flex gap="20px" vertical>
        {!loadingOccurrences &&
          occurrencesToApprove?.map((occ, i) => (
            <Card
              title={
                <span>
                  {translateType(occ.occurrence.type)}
                  <span style={{ fontWeight: '400' }}>
                    {' - '}
                    {dateDistance(occ.occurrence.createdAt as Date, true)}
                  </span>
                </span>
              }
              extra={
                <Flex gap="16px">
                  <Button
                    onClick={() => deleteOccurrence(occ.occurrence.id, i)}
                    icon={<DeleteOutlined />}
                  >
                    Descartar
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => approveOccurrence(occ.occurrence.id, i)}
                    icon={<CheckOutlined />}
                    loading={loading === i}
                  >
                    Notificar
                  </Button>
                </Flex>
              }
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
                    label: 'Localização',
                    children: (
                      <Typography.Text
                        copyable
                      >{`${occ.occurrence.latitude}, ${occ.occurrence.longitude}`}</Typography.Text>
                    ),
                  },
                  {
                    key: '4',
                    label: 'Sensores',
                    children: 'Não há sensores nessa área',
                  },
                ]}
              />
            </Card>
          ))}
      </Flex>
    </AdminLayout>
  );
};
