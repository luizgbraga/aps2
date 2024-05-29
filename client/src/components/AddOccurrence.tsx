import { Form, Input, Modal, Radio } from 'antd';
import React, { useRef, useState } from 'react';
import { OccurrenceType } from '../api/occurences';
import { useMap } from './useMap';

type Props = {
  open: boolean;
  onCancel: () => void;
};

export const AddOccurrence: React.FC<Props> = (props: Props) => {
  const [type, setType] = useState<OccurrenceType>('flooding');
  const [description, setDescription] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const { map } = useMap(ref, true);

  const onSubmit = () => {
    console.log('todo');
    props.onCancel();
  };

  return (
    <Modal
      open={props.open}
      onCancel={props.onCancel}
      onOk={onSubmit}
      style={{ width: '70vw' }}
    >
      <Form layout="vertical">
        <Form.Item label="Tipo" required>
          <Radio.Group value={type} onChange={(e) => setType(e.target.value)}>
            <Radio value="flooding">Alagamento</Radio>
            <Radio value="landslide">Deslizamento</Radio>
          </Radio.Group>
        </Form.Item>
        <div
          ref={ref}
          style={{
            height: 'calc(286px)',
            width: '100%',
            display: map ? 'flex' : 'none',
          }}
        />
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
