import { Form, Input, Modal } from 'antd';
import React from 'react';

type Props = {
  open: boolean;
  onCancel: () => void;
};

export const AddOccurrence: React.FC<Props> = (props: Props) => {
  return (
    <Modal open={props.open} onCancel={props.onCancel}>
      <Form layout="vertical">
        <Form.Item label="Description" required>
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};
