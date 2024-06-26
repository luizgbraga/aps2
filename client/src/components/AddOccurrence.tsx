import { Button, Flex, Form, Input, Modal, Radio, Spin, Steps } from 'antd';
import React, { useRef, useState } from 'react';
import { OccurrenceModel, OccurrenceType } from '../api/occurrences';
import { useMap } from './useMap';
import { NeighborhoodModel } from '../api/neighborhood';
import { Status, Wrapper } from '@googlemaps/react-wrapper';
import { MAPS_API_KEY } from '../config';

type Props = {
  open: boolean;
  onCancel: () => void;
};

export const AddOccurrence: React.FC<Props> = (props: Props) => {
  const [step, setStep] = useState(0);
  const [type, setType] = useState<OccurrenceType>('flooding');
  const [description, setDescription] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const { map, prevMarkersRef } = useMap(ref, true);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    const geocoder = new window.google.maps.Geocoder();
    const lastMarker =
      prevMarkersRef.current[prevMarkersRef.current.length - 1];
    if (!lastMarker) return;
    const lat = lastMarker.getPosition()?.lat();
    const lng = lastMarker.getPosition()?.lng();
    if (!lat || !lng) return;
    setLoading(true);
    geocoder.geocode({ location: { lat, lng } }, function (results, status) {
      if (status === window.google.maps.GeocoderStatus.OK) {
        if (!results) {
          return;
        }
        if (results[0]) {
          for (const component of results[0].address_components) {
            if (component.types.includes('sublocality')) {
              NeighborhoodModel.getFromName(component.long_name).then(
                (neighborhood) => {
                  OccurrenceModel.propose(
                    type,
                    lat.toString(),
                    lng.toString(),
                    neighborhood.id,
                    description
                  ).then(() => {
                    setLoading(false);
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

  const render = (status: Status) => {
    if (status === Status.LOADING) {
      return (
        <Flex
          justify="center"
          align="center"
          style={{ width: '100%', height: '100%' }}
        >
          <Spin size="large" />
        </Flex>
      );
    }
    return <span />;
  };

  return (
    <Modal
      open={props.open}
      onCancel={props.onCancel}
      onOk={onSubmit}
      width={800}
      title="Adicionar ocorrência"
      footer={null}
    >
      <Steps
        style={{ marginBottom: 32 }}
        current={step}
        items={[
          {
            title: 'Selecionar localização',
          },
          {
            title: 'Descrição',
          },
        ]}
      />
      <Form layout="vertical">
        {step === 0 && (
          <>
            <Form.Item label="Localização" required>
              <Wrapper apiKey={MAPS_API_KEY} render={render}>
                <div
                  ref={ref}
                  style={{
                    height: '320px',
                    width: '100%',
                    display: map ? 'flex' : 'none',
                  }}
                />
              </Wrapper>
            </Form.Item>
            <Flex justify="end" gap="12px">
              <Button onClick={props.onCancel}>Cancelar</Button>
              <Button type="primary" onClick={() => setStep(1)}>
                Próximo
              </Button>
            </Flex>
          </>
        )}
        {step === 1 && (
          <>
            <Form.Item label="Tipo" required>
              <Radio.Group
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <Radio value="flooding">Alagamento</Radio>
                <Radio value="landslide">Deslizamento</Radio>
                <Radio value="congestion">Congestionamento</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="Descrição" required>
              <Input.TextArea
                placeholder="Insira uma descrição para a sua ocorrência"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Item>
            <Flex justify="end" gap="12px">
              <Button
                onClick={() => {
                  setStep(0);
                  props.onCancel();
                }}
              >
                Cancelar
              </Button>
              <Button type="primary" onClick={onSubmit} loading={loading}>
                Adicionar
              </Button>
            </Flex>
          </>
        )}
      </Form>
    </Modal>
  );
};
