import { Select, Space } from 'antd';
import type { SelectProps } from 'antd';

export default function MapFilter() {
  const options: SelectProps['options'] = [
    {
      label: '636, Merck - Saens Peña',
      value: 'O0636AAA0A',
    },
    {
      label: '955, Maré - Terminal Alvorada',
      value: 'O0803AAP0A',
    },
    {
      label: 'SP803, Senador Camará - Terminal Sulacap',
      value: 'O0955AAA0A',
    },
  ];

  const handleChange = (value: string[]) => {
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
        onChange={handleChange}
        options={options}
      />
    </Space>
  );
}
