import { Card, Button } from 'antd';
import React from 'react';
import { OccurenceDTO } from '../../api/occurences';
import { ExportOutlined } from '@ant-design/icons';

const Cards: React.FC<OccurenceDTO> = ({
  id,
  latitude,
  longitude,
  neighborhoodId,
  description,
}) => {
  return (
    <Card
      title={`Notificação #${id}`}
      extra={
        <Button>
          Ver no mapa <ExportOutlined />
        </Button>
      }
    >
      <p>{description}</p>
      <p>{latitude}</p>
      <p>{longitude}</p>
      <p>{neighborhoodId}</p>
    </Card>
  );
};

export default Cards;
