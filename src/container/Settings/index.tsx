import Toast from "@/components/Toast";
import { TAppRootReducer } from "@/store";
import { setAppSettings } from "@/store/actions";
import { Row, Col, Space, Radio, InputNumber, InputNumberProps } from "antd";
import Preact, { useCallback } from "preact/compat";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { debounce } from "lodash";

const StyledSpace = styled(Space)`
  width: 100%;
  margin-top: 2rem;
`;

const SettingSearch: Preact.FunctionComponent = () => {
  const dispatch = useDispatch();
  const settings = useSelector(
    (state: TAppRootReducer) => state.appState.settings
  );
  const notify = () => {
    Toast("Settings saved successfully", "success");
  };

  const onChangeSettingVecorSearch = (e: any) => {
    dispatch(setAppSettings("vectorSearch", e.target.value));
    notify();
  };

  const debounceOnChangeInput = useCallback(
    debounce((field, value: any) => {
      dispatch(setAppSettings(field, value));
      notify();
      // Add your logic here
    }, 500), // 300ms throttle time
    []
  );

  const onChangeMaxQuery: InputNumberProps["onChange"] = (value: number) => {
    debounceOnChangeInput("maxQuery", value);
  };

  const onChangeKQuery: InputNumberProps["onChange"] = (value: number) => {
    debounceOnChangeInput("kQuery", value);
  };

  const onChangeDisplay: InputNumberProps["onChange"] = (value: number) => {
    debounceOnChangeInput("display", value);
  };

  return (
    <>
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        <Row>
          <Col span={24}>
            <h3>Setting vector search</h3>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Row>
              <Radio.Group
                value={settings.vectorSearch}
                onChange={onChangeSettingVecorSearch}
              >
                <Radio.Button value="faiss">Faiss</Radio.Button>
                <Radio.Button value="usearch">USearch</Radio.Button>
              </Radio.Group>
            </Row>
          </Col>
        </Row>
      </Space>
      <StyledSpace direction="vertical" size="small" style={{ width: "100%" }}>
        <Row>
          <Col span={24}>
            <h3>Setting k query in vector search</h3>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <InputNumber
              min={1}
              max={1000}
              defaultValue={settings.kQuery}
              onChange={onChangeKQuery}
            />
          </Col>
        </Row>
      </StyledSpace>
      <StyledSpace direction="vertical" size="small" style={{ width: "100%" }}>
        <Row>
          <Col span={24}>
            <h3>Setting display results</h3>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <InputNumber
              min={1}
              max={50}
              defaultValue={settings.display}
              onChange={onChangeDisplay}
            />
          </Col>
        </Row>
      </StyledSpace>
      <StyledSpace direction="vertical" size="small" style={{ width: "100%" }}>
        <Row>
          <Col span={24}>
            <h3>Setting maximum query</h3>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <InputNumber
              min={1}
              max={10}
              defaultValue={settings.maxQuery}
              onChange={onChangeMaxQuery}
            />
          </Col>
        </Row>
      </StyledSpace>
    </>
  );
};

export default SettingSearch;
