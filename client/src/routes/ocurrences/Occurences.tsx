import { Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { OccurenceModel } from '../../api/occurences';
import { BaseLayout } from '../../layout/BaseLayout';
import Cards from './Card';

const Notifications: React.FC = () => {
  const [occurenceList, setOccurenceList] = useState<OccurenceModel[]>([]);

  useEffect(() => {
    const fetchOccurences = async () => {
      const list = await OccurenceModel.list();
      setOccurenceList(list);
    };
    fetchOccurences();
  }, []);

  return (
    <BaseLayout selected="notifications" title="Notifications">
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        {occurenceList.map((occ) => (
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
    </BaseLayout>
  );
};

export default Notifications;
