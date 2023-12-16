import Swal from "sweetalert2";

export function generarMensajeExito(textoMensaje: string) {
    Swal.fire({
        title: textoMensaje,
        timer: 2000,
        showConfirmButton: false,
        icon: "success",
        toast: true,
        position: 'bottom'
    })
}

export function generarMensajeError(textoMensaje: string) {
    Swal.fire({
        title: textoMensaje,
        icon: "error",
    })
}