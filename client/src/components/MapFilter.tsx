import { Select, Space } from 'antd';
import { RouteDTO } from '../api/route';

type Props = {
  routes: RouteDTO[] | null;
};

export const MapFilter: React.FC<Props> = (props: Props) => {
  const getLabelFromRoute = (busRoute: RouteDTO) => {
    let busNumber = busRoute.short_name;
    if (busRoute.desc_name != '' && busRoute.short_name.includes('LECD')) {
      busNumber = busRoute.desc_name;
    }
    return busNumber + ', ' + busRoute.long_name;
  }

  const onSelect = (value: string[]) => {
    console.log(value);
  };

  return (
    <Space style={{ width: '100%' }} direction="vertical">
      <Select
        mode="multiple"
        allowClear
        style={{ width: '100%', marginBottom: '10px' }}
        placeholder="Selecione as linhas"
        defaultValue={[]}
        onChange={onSelect}
        options={props.routes?.map((route) => ({
          label: getLabelFromRoute(route),
          value: route.id
        })).sort((a, b) => a.label.localeCompare(b.label))}
      />
    </Space>
  );
};
