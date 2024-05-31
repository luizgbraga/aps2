import { Form, Input, Modal, Radio } from 'antd';
import React, { useRef, useState } from 'react';
import { OccurenceModel, OccurrenceType } from '../api/occurences';
import { useMap } from './useMap';
import { NeighborhoodModel } from '../api/neighborhood';

type Props = {
  open: boolean;
  onCancel: () => void;
};

export const AddOccurrence: React.FC<Props> = (props: Props) => {
  const [type, setType] = useState<OccurrenceType>('flooding');
  const [description, setDescription] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const { map, prevMarkersRef } = useMap(ref, true);

  const onSubmit = async () => {
    const geocoder = new window.google.maps.Geocoder();
    const lastMarker =
      prevMarkersRef.current[prevMarkersRef.current.length - 1];
    if (!lastMarker) return;
    const lat = lastMarker.getPosition()?.lat();
    const lng = lastMarker.getPosition()?.lng();
    if (!lat || !lng) return;
    geocoder.geocode({ location: { lat, lng } }, function (results, status) {
      if (status === window.google.maps.GeocoderStatus.OK) {
        if (!results) return;
        if (results[0]) {
          for (const component of results[0].address_components) {
            if (component.types.includes('sublocality')) {
              NeighborhoodModel.getFromName(component.long_name).then(
                (neighborhood) => {
                  OccurenceModel.propose(
                    type,
                    lat.toString(),
                    lng.toString(),
                    neighborhood.id,
                    description
                  ).then(() => {
                    props.onCancel();
                  });
                }
              );
            }
          }
        }
      }
    });
  };

  return (
    <Modal
      open={props.open}
      onCancel={props.onCancel}
      onOk={onSubmit}
      width={800}
    >
      <Form layout="vertical">
        <Form.Item label="Tipo" required>
          <Radio.Group value={type} onChange={(e) => setType(e.target.value)}>
            <Radio value="flooding">Alagamento</Radio>
            <Radio value="landslide">Deslizamento</Radio>
            <Radio value="congestion">Congestionamento</Radio>
          </Radio.Group>
        </Form.Item>
        <div
          ref={ref}
          style={{
            height: 'calc(300px)',
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
