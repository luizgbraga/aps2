import { Badge, Popover } from 'antd';
import { BellOutlined } from '@ant-design/icons';

export const Notifications = () => {
  const styles = {
    smallFont: { fontSize: '12px' },
    pointer: { cursor: 'pointer' },
    divider: { margin: '8px 0px' },
  };

  const content = <div></div>;

  return (
    <Popover placement="bottom" trigger="click" content={content}>
      <Badge count={[1, 2]?.length}>
        <BellOutlined style={styles.pointer} />
      </Badge>
    </Popover>
  );
};
