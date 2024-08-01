import React, { useEffect } from "preact/compat";
import { selectorAppState } from "@store/selectors";
import { setAppError } from "@store/actions";
import { useDispatch, useSelector } from "react-redux";
import { TRootState } from "@/types/store";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

type TProps = {
  children?: React.ReactNode;
};

export const AppError: React.FC<TProps> = ({ children }) => {
  const { apiError } = useSelector(({ appState }: TRootState) =>
    selectorAppState(appState)
  );
  const showSwal = () => {
    withReactContent(Swal).fire({
      toast: true,
      position: "top",
      icon: "error",
      iconColor: "white",
      customClass: {
        popup: "colored-toast",
      },
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      title: `${apiError}`,
    });
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
