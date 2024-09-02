import { Input, Space, Switch } from "antd";
import Preact, { useEffect, useCallback, useState } from "preact/compat";
import { useDispatch, useSelector } from "react-redux";
import { setSearchTerm } from "@/store/actions";
import { TAppRootReducer } from "@/store";
import { debounce } from "lodash";

const { TextArea } = Input;

interface ITextQuery {
  tabKey: number;
}

const TextQuery: Preact.FunctionComponent<ITextQuery> = ({ tabKey }) => {
  const dispatch = useDispatch();
  const searchTab = useSelector((state: TAppRootReducer) =>
    state?.searchState?.search.find((s) => s.tabKey === tabKey)
  );

  // Local state to manage the input value
  const [inputValue, setInputValue] = useState(searchTab?.value ?? "");
  const [ocr, setOcr] = useState(false);

  useEffect(() => {
    if (ocr === true) {
      dispatch(setSearchTerm("OCR", inputValue, tabKey));
    } else {
      dispatch(setSearchTerm("Text", inputValue, tabKey));
    }
  }, [dispatch, tabKey, ocr]);

  useEffect(() => {
    setInputValue(searchTab?.value ?? "");
  }, [searchTab?.value]);

  const debouncedSetSearchTerm = useCallback(
    debounce((value: string) => {
      if (ocr === true) {
        dispatch(setSearchTerm("OCR", value, tabKey));
      } else {
        dispatch(setSearchTerm("Text", value, tabKey));
      }
    }, 300), // 300ms debounce delay
    [dispatch, tabKey]
  );

  const handleSearchTermChange = (e: any) => {
    setInputValue(e.target.value);
    debouncedSetSearchTerm(e.target.value);
  };

  const handleSwitchChange = (checked: boolean) => {
    setOcr(checked);
  };

  useEffect(() => {
    return () => {
      debouncedSetSearchTerm.cancel();
    };
  }, [debouncedSetSearchTerm]);

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Switch
        onChange={handleSwitchChange}
        checkedChildren="OCR"
        value={ocr}
        unCheckedChildren="OCR"
        defaultChecked={false}
      />
      <TextArea
        rows={3}
        key={tabKey}
        style={{ width: "100%" }}
        onChange={handleSearchTermChange}
        placeholder="input search text"
        allowClear
        value={inputValue}
      />
    </Space>
  );
};

export default TextQuery;
