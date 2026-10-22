const ADMIN_KEY = "admin123";

export function openAdminModal() {
  document.getElementById('adminModal').classList.remove('hidden');
  if (sessionStorage.getItem('cyberfix_admin_logged') === 'true') {
    showAdminTable();
  }
}

export function closeModal(modalId) {
  document.getElementById(modalId).classList.add('hidden');
}

export function loginAdmin() {
  const pass = document.getElementById('adminPassInput').value;
  if (pass === ADMIN_KEY) {
    sessionStorage.setItem('cyberfix_admin_logged', 'true');
    showAdminTable();
  } else {
    alert("Clave de administrador incorrecta");
  }
}

export function logoutAdmin() {
  sessionStorage.removeItem('cyberfix_admin_logged');
  document.getElementById('adminAuthSection').classList.remove('hidden');
  document.getElementById('adminTableSection').classList.add('hidden');
  document.getElementById('adminPassInput').value = '';
}

export function showAdminTable() {
  document.getElementById('adminAuthSection').classList.add('hidden');
  document.getElementById('adminTableSection').classList.remove('hidden');
  renderAdminTable();
}

export function renderAdminTable() {
  const reservations = JSON.parse(localStorage.getItem('cyberfix_reservations')) || [];
  const tbody = document.getElementById('reservationsTableBody');
  const count = document.getElementById('totalReservationsCount');
  tbody.innerHTML = '';
  count.innerText = reservations.length;

  if (reservations.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-slate-500">No hay reservas registradas aún.</td></tr>`;
    return;
  }

  reservations.forEach(item => {
    const badgeColor = item.status === 'Aceptada' 
      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
      : item.status === 'Cancelada' 
      ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' 
      : 'bg-amber-500/20 text-amber-400 border-amber-500/30';

    const row = document.createElement('tr');
    row.className = "border-b border-slate-800/60 hover:bg-slate-900/40";
    row.innerHTML = `
      <td class="p-3 font-mono font-bold text-cyan-400">${item.code}</td>
      <td class="p-3">
        <div class="font-bold text-white">${item.name}</div>
        <div class="text-xs text-slate-400">${item.phone} • ${item.address}</div>
      </td>
      <td class="p-3 text-xs text-cyan-300 font-semibold">${item.device}</td>
      <td class="p-3">
        <span class="text-xs font-semibold px-2 py-0.5 rounded border ${badgeColor}">${item.status}</span>
      </td>
      <td class="p-3 text-center space-x-1">
        <button onclick="window.updateStatus('${item.id}', 'Aceptada')" title="Aceptar" class="p-1.5 rounded bg-emerald-900/50 hover:bg-emerald-800 text-emerald-300 transition">
          <i class="ph-bold ph-check"></i>
        </button>
        <button onclick="window.updateStatus('${item.id}', 'Cancelada')" title="Cancelar" class="p-1.5 rounded bg-amber-900/50 hover:bg-amber-800 text-amber-300 transition">
          <i class="ph-bold ph-prohibit"></i>
        </button>
        <button onclick="window.deleteReservation('${item.id}')" title="Eliminar" class="p-1.5 rounded bg-rose-900/50 hover:bg-rose-800 text-rose-300 transition">
          <i class="ph-bold ph-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

export function updateStatus(id, newStatus) {
  let reservations = JSON.parse(localStorage.getItem('cyberfix_reservations')) || [];
  reservations = reservations.map(r => r.id === id ? { ...r, status: newStatus } : r);
  localStorage.setItem('cyberfix_reservations', JSON.stringify(reservations));
  renderAdminTable();
}

export function deleteReservation(id) {
  if (confirm('¿Eliminar esta reserva definitivamente?')) {
    let reservations = JSON.parse(localStorage.getItem('cyberfix_reservations')) || [];
    reservations = reservations.filter(r => r.id !== id);
    localStorage.setItem('cyberfix_reservations', JSON.stringify(reservations));
    renderAdminTable();
  }
}
