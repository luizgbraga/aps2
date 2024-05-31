import React, { useState } from 'react';

import { Button, Card, Descriptions, Flex, Spin, Typography } from 'antd';
import { DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import { AdminLayout } from '../../layout/admin/AdminLayout';
import { useAsync } from '../../utils/async';
import { OccurenceModel } from '../../api/occurences';
import { translateType } from '../../utils/translate';
import { dateDistance } from '../../utils/time';

export const AApproval: React.FC = () => {
  const [loading, setLoading] = useState(-1);
  const {
    result: occurencesToApprove,
    refetch,
    loading: loadingOccurences,
  } = useAsync(() => OccurenceModel.listToApprove());
  const approveOccurence = (id: string, i: number) => {
    setLoading(i);
    OccurenceModel.confirm(id).then(() => {
      refetch();
      setLoading(-1);
    });
  };

  return (
    <AdminLayout selected="approve" title="Aprovação de ocorrências">
      {loadingOccurences && (
        <Flex
          justify="center"
          align="center"
          style={{ width: '100%', height: '400px' }}
        >
          <Spin />
        </Flex>
      )}
      {!loadingOccurences && !occurencesToApprove?.length && (
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
        {!loadingOccurences &&
          occurencesToApprove?.map((occ, i) => (
            <Card
              title={
                <span>
                  {translateType(occ.occurence.type)}
                  <span style={{ fontWeight: '400' }}>
                    {' - '}
                    {dateDistance(occ.occurence.createdAt as Date, true)}
                  </span>
                </span>
              }
              extra={
                <Flex gap="16px">
                  <Button
                    onClick={() => approveOccurence(occ.occurence.id, i)}
                    icon={<DeleteOutlined />}
                  >
                    Descartar
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => approveOccurence(occ.occurence.id, i)}
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
                    children: occ.occurence.description,
                  },
                  {
                    key: '3',
                    label: 'Localização',
                    children: (
                      <Typography.Text
                        copyable
                      >{`${occ.occurence.latitude}, ${occ.occurence.longitude}`}</Typography.Text>
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
