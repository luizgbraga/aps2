import React from 'react';

import { Button, Card, Descriptions, Flex, Typography } from 'antd';
import { DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import { AdminLayout } from '../../layout/admin/AdminLayout';
import { useAsync } from '../../utils/async';
import { OccurenceModel } from '../../api/occurences';
import { translateType } from '../../utils/translate';
import { dateDistance } from '../../utils/time';

export const AApproval: React.FC = () => {
  const { result: occurencesToApprove } = useAsync(() =>
    OccurenceModel.listToApprove()
  );
  const approveOccurence = (id: string) => {
    OccurenceModel.confirm(id);
  };

  return (
    <AdminLayout selected="approve" title="Aprovação de ocorrências">
      {occurencesToApprove?.map((occ) => (
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
                onClick={() => approveOccurence(occ.occurence.id)}
                icon={<DeleteOutlined />}
              >
                Descartar
              </Button>
              <Button
                type="primary"
                onClick={() => approveOccurence(occ.occurence.id)}
                icon={<CheckOutlined />}
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
    </AdminLayout>
  );
};
