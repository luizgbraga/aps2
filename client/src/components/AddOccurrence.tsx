import { Form, Input, Modal, Radio } from 'antd';
import React, { useState } from 'react';

type Props = {
  open: boolean;
  onCancel: () => void;
};

type OccurrenceType = 'Alagamento' | 'Deslizamento';

export const AddOccurrence: React.FC<Props> = (props: Props) => {
  const [type, setType] = useState<OccurrenceType>('Alagamento');
  const [description, setDescription] = useState('');

  const onSubmit = () => {
    console.log({ type, description });
    props.onCancel();
  };

  return (
    <Modal open={props.open} onCancel={props.onCancel} onOk={onSubmit}>
      <Form layout="vertical">
        <Form.Item label="Tipo" required>
          <Radio.Group value={type} onChange={(e) => setType(e.target.value)}>
            <Radio value="Alagamento">Alagamento</Radio>
            <Radio value="Deslizamento">Deslizamento</Radio>
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
