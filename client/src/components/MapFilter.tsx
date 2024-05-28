import { Select, Space } from 'antd';
import { RouteDTO } from '../api/route';

type Props = {
  routes: RouteDTO[] | null;
  loading: boolean;
};

export const MapFilter: React.FC<Props> = (props: Props) => {
  const getLabelFromRoute = (busRoute: RouteDTO) => {
    let busNumber = busRoute.short_name;
    if (busRoute.desc_name != '' && busRoute.short_name.includes('LECD')) {
      busNumber = busRoute.desc_name;
    }
    return busNumber + ', ' + busRoute.long_name;
  };

  const onSelect = (value: string[]) => {
    console.log(value);
  };

  return (
    <Space style={{ width: '100%' }} direction="vertical">
      <Select
        allowClear
        autoFocus
        mode="multiple"
        placeholder="Selecione as linhas"
        style={{ width: '100%', marginBottom: '10px' }}
        defaultValue={[]}
        onChange={onSelect}
        loading={props.loading}
        options={props.routes
          ?.map((route) => ({
            label: getLabelFromRoute(route),
            value: route.id,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))}
        filterOption={(inputValue, option) => {
          if (!option) return false;
          return option.label.toLowerCase().includes(inputValue.toLowerCase());
        }}
      />
    </Space>
  );
};
