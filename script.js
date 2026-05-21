const canvas = document.getElementById('firma');

const signaturePad = new SignaturePad(canvas, {
    penColor: "black"
});

function ajustarCanvas(){

    const ratio = Math.max(window.devicePixelRatio || 1, 1);

    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;

    canvas.getContext("2d").scale(ratio, ratio);

    signaturePad.clear();

}

window.addEventListener("resize", ajustarCanvas);

ajustarCanvas();

let contadorActa = localStorage.getItem("contadorActa") || 1;

function limpiarFirma(){

    signaturePad.clear();

}

function generarNumeroActa(){

    const year = new Date().getFullYear();

    const numero = String(contadorActa).padStart(4, '0');

    return `ACTA-${year}-${numero}`;

}

function obtenerAccesorios(){

    let accesorios = [];

    document.querySelectorAll('.checkboxes input:checked').forEach((checkbox)=>{

        accesorios.push(checkbox.value);

    });

    if(accesorios.length === 0){

        return "NINGUNO";

    }

    return accesorios.join(", ");

}

function validarFormulario(){

    let nombre = document.getElementById("nombre").value;
    let codigoEmpleado = document.getElementById("codigoEmpleado").value;
    let area = document.getElementById("area").value;
    let identificacion = document.getElementById("identificacion").value;
    let modelo = document.getElementById("modelo").value;
    let serie = document.getElementById("serie").value;
    let estado = document.getElementById("estado").value;
    let fecha = document.getElementById("fecha").value;
    let tecnico = document.getElementById("tecnico").value;

    if(
        nombre === "" ||
        codigoEmpleado === "" ||
        area === "" ||
        identificacion === "" ||
        modelo === "" ||
        serie === "" ||
        estado === "" ||
        fecha === "" ||
        tecnico === ""
    ){

        alert("Complete todos los campos.");

        return false;

    }

    if(signaturePad.isEmpty()){

        alert("La firma es obligatoria.");

        return false;

    }

    return true;

}

function generarCarta(){

    if(!validarFormulario()){

        return;

    }

    const nombre = document.getElementById("nombre").value;
    const codigoEmpleado = document.getElementById("codigoEmpleado").value;
    const area = document.getElementById("area").value;
    const identificacion = document.getElementById("identificacion").value;
    const modelo = document.getElementById("modelo").value;
    const serie = document.getElementById("serie").value;
    const estado = document.getElementById("estado").value;
    const fecha = document.getElementById("fecha").value;
    const tecnico = document.getElementById("tecnico").value;
    const observaciones = document.getElementById("observaciones").value;

    const accesorios = obtenerAccesorios();

    const numeroActa = generarNumeroActa();

    const firmaURL = signaturePad.toDataURL();

    document.getElementById("contenidoCarta").innerHTML = `

    <strong>${numeroActa}</strong>

    <br><br>

    Para: <strong>${nombre}</strong>

    <br>

    Código Empleado: <strong>${codigoEmpleado}</strong>

    <br>

    Área: <strong>${area}</strong>

    <br><br>

    Estado del equipo: <strong>${estado}</strong>

    <br>

    Fecha entrega: <strong>${fecha}</strong>

    <br><br>

    Por medio del presente se hace entrega de una PDA para uso laboral.

    <br><br>

    <strong>DATOS DEL EQUIPO</strong>

    <br><br>

    Número Identificación:
    <strong>CDF-A${identificacion}</strong>

    <br>

    Marca:
    <strong>ZEBRA</strong>

    <br>

    Modelo:
    <strong>${modelo}</strong>

    <br>

    Número de Serie:
    <strong>${serie}</strong>

    <br><br>

    <strong>ACCESORIOS ENTREGADOS</strong>

    <br>

    ${accesorios}

    <br><br>

    El empleado se compromete al buen uso del equipo entregado y será responsable por daños ocasionados por mal uso, instalación de software no autorizado o pérdida del dispositivo.

    <br><br>

    Soporte Técnico:
    <strong>${tecnico}</strong>

    <br><br>

    <strong>OBSERVACIONES</strong>

    <br>

    ${observaciones || "Sin observaciones."}

    `;

    document.getElementById("imagenFirma").src = firmaURL;

    document.getElementById("nombreFirma").innerHTML = nombre;

    guardarHistorial(
        numeroActa,
        nombre,
        codigoEmpleado,
        area,
        identificacion,
        modelo,
        serie,
        estado,
        fecha
    );

}

function guardarHistorial(
    acta,
    nombre,
    codigo,
    area,
    identificacion,
    modelo,
    serie,
    estado,
    fecha
){

    let historial = JSON.parse(localStorage.getItem("historialPDA")) || [];

    historial.push({

        acta,
        nombre,
        codigo,
        area,
        identificacion,
        modelo,
        serie,
        estado,
        fecha

    });

    localStorage.setItem("historialPDA", JSON.stringify(historial));

}

function exportarPDF(){

    if(signaturePad.isEmpty()){

        alert("Debe agregar firma.");

        return;

    }

    const elemento = document.getElementById("documento");

    const opciones = {

        margin: 0.5,

        filename: 'Acta_PDA.pdf',

        image: {
            type: 'jpeg',
            quality: 1
        },

        html2canvas: {
            scale: 2
        },

        jsPDF: {
            unit: 'in',
            format: 'letter',
            orientation: 'portrait'
        }

    };

    html2pdf().set(opciones).from(elemento).save();

    contadorActa++;

    localStorage.setItem("contadorActa", contadorActa);

}
