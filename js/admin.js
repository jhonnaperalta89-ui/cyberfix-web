const AUTH_USER = "Jhonatan15";
const AUTH_PASS = "Catalina248";

// Asegurar enlace de eventos cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  // Verificar si ya había iniciado sesión previamente
  if (sessionStorage.getItem('cyberfix_admin_logged') === 'true') {
    showAdminDashboard();
  }

  // Interceptar el envío del formulario directamente por ID
  const authForm = document.getElementById('adminLoginForm');
  if (authForm) {
    authForm.addEventListener('submit', handleLogin);
  }
});

function handleLogin(e) {
  if (e) e.preventDefault();
  
  const user = document.getElementById('adminUserInput').value.trim();
  const pass = document.getElementById('adminPassInput').value.trim();
  const errorEl = document.getElementById('authError');

  if (user === AUTH_USER && pass === AUTH_PASS) {
    sessionStorage.setItem('cyberfix_admin_logged', 'true');
    if (errorEl) errorEl.classList.add('hidden');
    showAdminDashboard();
  } else {
    if (errorEl) errorEl.classList.remove('hidden');
  }
}

// Exponer funciones necesarias en el objeto window
window.loginAdmin = handleLogin;

window.logoutAdmin = function() {
  sessionStorage.removeItem('cyberfix_admin_logged');
  document.getElementById('adminAuthSection').classList.remove('hidden');
  document.getElementById('adminDashboardSection').classList.add('hidden');
  document.getElementById('adminUserInput').value = '';
  document.getElementById('adminPassInput').value = '';
  const errorEl = document.getElementById('authError');
  if (errorEl) errorEl.classList.add('hidden');
};

function showAdminDashboard() {
  document.getElementById('adminAuthSection').classList.add('hidden');
  document.getElementById('adminDashboardSection').classList.remove('hidden');
  renderReservations();
}

export function renderReservations() {
  const reservations = JSON.parse(localStorage.getItem('cyberfix_reservations')) || [];
  const tbody = document.getElementById('reservationsTableBody');
  const count = document.getElementById('totalCount');
  
  if (tbody) tbody.innerHTML = '';
  if (count) count.innerText = reservations.length;

  if (!tbody) return;

  if (reservations.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="p-8 text-center text-slate-500 font-medium">No hay reservas registradas en el sistema.</td></tr>`;
    return;
  }

  reservations.forEach(item => {
    const badgeColor = item.status === 'Aceptada' 
      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
      : item.status === 'Cancelada' 
      ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' 
      : 'bg-amber-500/20 text-amber-400 border-amber-500/30';

    const row = document.createElement('tr');
    row.className = "border-b border-slate-800/60 hover:bg-slate-900/40 transition";
    row.innerHTML = `
      <td class="p-4 font-mono font-bold text-cyan-400 text-sm">${item.code}</td>
      <td class="p-4">
        <div class="font-bold text-white">${item.name}</div>
        <div class="text-xs text-slate-400">${item.phone}</div>
      </td>
      <td class="p-4 text-xs text-slate-300">${item.address}</td>
      <td class="p-4 text-xs text-cyan-300 font-semibold">${item.device}</td>
      <td class="p-4">
        <span class="text-xs font-semibold px-2.5 py-1 rounded-full border ${badgeColor}">${item.status}</span>
      </td>
      <td class="p-4 text-center space-x-1.5 whitespace-nowrap">
        <button onclick="updateStatus('${item.id}', 'Aceptada')" title="Aceptar" class="p-2 rounded-lg bg-emerald-900/40 hover:bg-emerald-800 text-emerald-300 transition">
          <i class="ph-bold ph-check"></i>
        </button>
        <button onclick="updateStatus('${item.id}', 'Cancelada')" title="Cancelar" class="p-2 rounded-lg bg-amber-900/40 hover:bg-amber-800 text-amber-300 transition">
          <i class="ph-bold ph-prohibit"></i>
        </button>
        <button onclick="deleteReservation('${item.id}')" title="Eliminar" class="p-2 rounded-lg bg-rose-900/40 hover:bg-rose-800 text-rose-300 transition">
          <i class="ph-bold ph-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

window.updateStatus = function(id, newStatus) {
  let reservations = JSON.parse(localStorage.getItem('cyberfix_reservations')) || [];
  reservations = reservations.map(r => r.id === id ? { ...r, status: newStatus } : r);
  localStorage.setItem('cyberfix_reservations', JSON.stringify(reservations));
  renderReservations();
};

window.deleteReservation = function(id) {
  if (confirm('¿Confirmas la eliminación definitiva de esta reserva?')) {
    let reservations = JSON.parse(localStorage.getItem('cyberfix_reservations')) || [];
    reservations = reservations.filter(r => r.id !== id);
    localStorage.setItem('cyberfix_reservations', JSON.stringify(reservations));
    renderReservations();
  }
};