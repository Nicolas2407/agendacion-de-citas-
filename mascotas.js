    let citas = [];
let editando = null;

/* Inputs */
const mascotaInput = v => v !== undefined ? mascota.value = v : mascota.value;
const propietarioInput = v => v !== undefined ? propietario.value = v : propietario.value;
const telefonoInput = v => v !== undefined ? telefono.value = v : telefono.value;
const fechaInput = v => v !== undefined ? fecha.value = v : fecha.value;
const horaInput = v => v !== undefined ? hora.value = v : hora.value;
const tipoMascotaInput = v => v !== undefined ? tipoMascota.value = v : tipoMascota.value;
const sintomasInput = v => v !== undefined ? sintomas.value = v : sintomas.value;

/* Helpers */
const alerta = (t, i) => Swal.fire({ title: t, icon: i, timer: 1800, showConfirmButton: false });
const abrirModal = () => new bootstrap.Modal(document.getElementById('modalCita')).show();
const cerrarModal = () => bootstrap.Modal.getInstance(document.getElementById('modalCita')).hide();

function limpiarFormulario() {
  mascotaInput('');
  propietarioInput('');
  telefonoInput('');
  fechaInput('');
  horaInput('');
  tipoMascotaInput('');
  sintomasInput('');
}

function guardarCita() {
  const mascota = mascotaInput();
  const propietario = propietarioInput();
  const telefono = telefonoInput();
  const fecha = fechaInput();
  const hora = horaInput();
  const tipo = tipoMascotaInput();
  const sintomas = sintomasInput();

  if (!mascota || !propietario || !telefono || !fecha || !hora || !tipo || !sintomas) {
    return alerta('Todos los campos son obligatorios', 'warning');
  }

  const hoy = new Date().toISOString().split('T')[0];
  if (fecha < hoy) return alerta('No puedes agendar fechas pasadas', 'error');

  if (hora < '08:00' || hora > '20:00') {
    return alerta('Solo se atiende de 8am a 8pm', 'error');
  }

  const cita = {
    id: editando ?? Date.now(),
    mascota, propietario, telefono, fecha, hora, tipo, sintomas,
    estado: 'Abierta'
  };

  if (editando) {
    citas = citas.map(c => (c.id === editando) ? cita : c);
    editando = null;
  } else {
    citas.push(cita);
  }

  cerrarModal();
  limpiarFormulario();
  renderizarCitas();
  alerta('Cita guardada con éxito', 'success');
}

function renderizarCitas() {
  const contenedor = document.getElementById('listaCitas');
  const filtro = document.getElementById('filtroEstadoPrincipal').value;

  contenedor.innerHTML = '';

  citas
    .filter(c => filtro === 'Todas' || c.estado === filtro)
    .forEach(c => {

      // 🔥 Ruta corregida según tu carpeta "img"
      const imagen = `img/${c.tipo.toLowerCase()}.jpg`;

      contenedor.innerHTML += `
      <div class="col-md-4">
        <div class="card card-cita p-3"
             style="background-image: url('${imagen}')">
             
          <h5>${c.mascota}</h5>
          <p><b>Tipo:</b> ${c.tipo}</p>
          <p><b>Propietario:</b> ${c.propietario}</p>
          <p><b>Teléfono:</b> ${c.telefono}</p>
          <p><b>Fecha:</b> ${c.fecha} ⏰ ${c.hora}</p>
          <p><b>Síntomas:</b> ${c.sintomas}</p>

          <span class="estado-badge estado-${c.estado}">${c.estado}</span>

          <select class="form-select mt-2" onchange="cambiarEstado(${c.id}, this.value)">
            <option ${c.estado === 'Abierta' ? 'selected' : ''}>Abierta</option>
            <option ${c.estado === 'Terminada' ? 'selected' : ''}>Terminada</option>
            <option ${c.estado === 'Anulada' ? 'selected' : ''}>Anulada</option>
          </select>

          <div class="mt-2 text-end">
            <button class="btn btn-warning btn-sm" onclick="editar(${c.id})">✏️</button>
            <button class="btn btn-danger btn-sm" onclick="eliminar(${c.id})">❌</button>
          </div>
        </div>
      </div>`;
    });
}

function cambiarEstado(id, estado) {
  citas = citas.map(c => c.id === id ? {...c, estado} : c);
  renderizarCitas();
}

function editar(id) {
  const c = citas.find(c => c.id === id);
  editando = id;
  mascotaInput(c.mascota);
  propietarioInput(c.propietario);
  telefonoInput(c.telefono);
  fechaInput(c.fecha);
  horaInput(c.hora);
  tipoMascotaInput(c.tipo);
  sintomasInput(c.sintomas);
  abrirModal();
}

function eliminar(id) {
  Swal.fire({
    title: '¿Eliminar cita?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Eliminar'
  }).then(r => {
    if (r.isConfirmed) {
      citas = citas.filter(c => c.id !== id);
      renderizarCitas();
    }
  });
}











