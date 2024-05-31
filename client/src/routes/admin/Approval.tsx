import React from 'react';

import { AdminLayout } from '../../layout/admin/AdminLayout';
import { useAsync } from '../../utils/async';
import { OccurenceModel } from '../../api/occurences';
import { Button, Card } from 'antd';

export const AApproval: React.FC = () => {
  const { result: occurencesToApprove } = useAsync(() =>
    OccurenceModel.listToApprove()
  );
  const approveOccurence = (id: string) => {
    OccurenceModel.confirm(id);
  };

  return (
    <AdminLayout selected="approve">
      {occurencesToApprove?.map((occ) => (
        <Card
          title={occ.type}
          extra={
            <Button onClick={() => approveOccurence(occ.id)}>Aprove</Button>
          }
        >
          <p>{occ.description}</p>
        </Card>
      ))}
    </AdminLayout>
  );
};
