import React, { useEffect } from "preact/compat";
import { selectorAppState } from "@store/selectors";
import { setAppError } from "@store/actions";
import { useDispatch, useSelector } from "react-redux";
import { TRootState } from "@/types/store";
import toast from '@components/Toast'

type TProps = {
  children?: React.ReactNode;
};

export const AppError: React.FC<TProps> = ({ children }) => {
  const { apiError } = useSelector(({ appState }: TRootState) =>
    selectorAppState(appState)
  );
  const showSwal = () => {
    toast(apiError, 'error');
    dispatch(setAppError(""))
  };

  const dispatch = useDispatch();

  useEffect(() => {
    if (apiError !== "") {
      showSwal()
    }
  }, [apiError]);

  return <>{children}</>;
};
