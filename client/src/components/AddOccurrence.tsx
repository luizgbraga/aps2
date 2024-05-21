import { Form, Input, Modal, Radio } from 'antd';
import React, { useState } from 'react';
import { OccurenceModel, OccurenceType } from '../api/occurences';

type Props = {
  open: boolean;
  onCancel: () => void;
};

export const AddOccurrence: React.FC<Props> = (props: Props) => {
  const [type, setType] = useState<OccurenceType>('flooding');
  const [description, setDescription] = useState('');

  const onSubmit = () => {
    OccurenceModel.create(type, description, '0', '0').then((res) => {
      console.log(res);
    });
    props.onCancel();
  };

  return (
    <Modal open={props.open} onCancel={props.onCancel} onOk={onSubmit}>
      <Form layout="vertical">
        <Form.Item label="Tipo" required>
          <Radio.Group value={type} onChange={(e) => setType(e.target.value)}>
            <Radio value="flooding">Alagamento</Radio>
            <Radio value="landslide">Deslizamento</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Descrição" required>
          <Input.TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
