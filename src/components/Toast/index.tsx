import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function Toast(title: string, type: "success" | "error" | "warning" | "info") {
  withReactContent(Swal).fire({
    toast: true,
    position: "top",
    icon: type,
    iconColor: "white",
    customClass: {
      popup: "colored-toast",
    },
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    title: `${title}`,
  });
}

export default Toast;
