import * as Admin from './admin.js';

const WHATSAPP_NUMBER = "56929123229";

// Exponer funciones globales para los eventos onclick en HTML
window.openAdminModal = Admin.openAdminModal;
window.closeModal = Admin.closeModal;
window.loginAdmin = Admin.loginAdmin;
window.logoutAdmin = Admin.logoutAdmin;
window.updateStatus = Admin.updateStatus;
window.deleteReservation = Admin.deleteReservation;

// Catálogo de servicios con sub-opciones y descripciones detalladas
const servicesData = {
  lavarropas: {
    category: "Lavarropas y Secarropas",
    icon: "ph-washing-machine",
    color: "text-cyan-400",
    badgeBg: "bg-cyan-500/10 border-cyan-500/30 text-cyan-300",
    options: [
      {
        name: "Cambio de Rodamientos / Rulemanes y Eje",
        desc: "Solución definitiva para ruidos metálicos intensos o cuando el tambor está desalineado o pesado.",
        value: "Lavarropas: Rodamientos y Eje"
      },
      {
        name: "Bomba de Desagüe y Desobstrucción",
        desc: "Limpieza o sustitución si el agua se queda estancada en el equipo y no centrifuga.",
        value: "Lavarropas: Bomba de Desagüe"
      },
      {
        name: "Reparación o Cambio de Placa Electrónica",
        desc: "Diagnóstico de circuitos si se apaga solo, parpadean las luces o no inician los ciclos de lavado.",
        value: "Lavarropas: Placa Electrónica"
      },
      {
        name: "Mantenimiento General / Fuga de Agua",
        desc: "Cambio de fuelle/goma de puerta, válvulas de entrada de agua, mangueras y calibración general.",
        value: "Lavarropas: Mantenimiento General"
      }
    ]
  },
  hornos: {
    category: "Hornos y Microondas",
    icon: "ph-cooking-pot",
    color: "text-amber-400",
    badgeBg: "bg-amber-500/10 border-amber-500/30 text-amber-300",
    options: [
      {
        name: "Cambio de Magnetrón / Diodo de Alto Voltaje",
        desc: "Para microondas que prenden y giran con normalidad pero no calientan los alimentos.",
        value: "Microondas: Magnetrón / Alto Voltaje"
      },
      {
        name: "Reparación de Panel Táctil y Botonera",
        desc: "Solución para teclados que no marcan el tiempo o no responden al tacto.",
        value: "Microondas: Panel Táctil"
      },
      {
        name: "Resistencias Térmicas y Termostatos (Hornos)",
        desc: "Cambio de resistencias superior/inferior en hornos eléctricos que no alcanzan la temperatura adecuada.",
        value: "Horno Eléctrico: Resistencias / Termostato"
      },
      {
        name: "Eliminación de Chispas y Cambio de Placa Mica",
        desc: "Sustitución de guías de onda quemadas y aislamiento de chispas internas de seguridad.",
        value: "Microondas: Placa Mica / Antichispas"
      }
    ]
  },
  computadores: {
    category: "Computadores y Notebooks",
    icon: "ph-desktop",
    color: "text-indigo-400",
    badgeBg: "bg-indigo-500/10 border-indigo-500/30 text-indigo-300",
    options: [
      {
        name: "Limpieza Profunda + Pasta Térmica Premium",
        desc: "Desarme completo, soplado de turbinas y colocación de pasta térmica disipadora para evitar recalentamiento.",
        value: "PC/Notebook: Limpieza y Pasta Térmica"
      },
      {
        name: "Actualización a Disco Sólido (SSD)",
        desc: "Multiplica la velocidad hasta 10 veces instalando un SSD nuevo con migración de tus archivos.",
        value: "PC/Notebook: Instalación de Disco SSD"
      },
      {
        name: "Formateo y Optimización de Sistema",
        desc: "Instalación limpia de Windows, eliminación total de virus y configuración de programas esenciales.",
        value: "PC/Notebook: Formateo y Optimización"
      },
      {
        name: "Reparación de Bisagras y Pantallas",
        desc: "Reconstrucción estructural de carcasas rotas, cambio de display LED y cables flex dañados.",
        value: "Notebook: Bisagras y Pantalla"
      }
    ]
  }
};

// Abrir pop-up con las sub-opciones del catálogo
window.openCategoryPopup = function(categoryKey) {
  const data = servicesData[categoryKey];
  if (!data) return;

  const modal = document.getElementById('catalogPopupModal');
  const title = document.getElementById('popupCategoryTitle');
  const icon = document.getElementById('popupCategoryIcon');
  const container = document.getElementById('popupOptionsContainer');

  title.innerText = data.category;
  icon.className = `ph-bold ${data.icon} text-3xl ${data.color}`;
  container.innerHTML = '';

  data.options.forEach(opt => {
    const card = document.createElement('div');
    card.className = "bg-slate-900/90 border border-slate-700/80 hover:border-cyan-400 p-4 rounded-2xl transition duration-200 flex flex-col justify-between gap-3 text-left";
    card.innerHTML = `
      <div>
        <h4 class="font-bold text-white text-base flex items-center gap-2">
          <i class="ph-bold ph-check text-cyan-400"></i>
          ${opt.name}
        </h4>
        <p class="text-xs md:text-sm text-slate-300 mt-1 leading-relaxed">${opt.desc}</p>
      </div>
      <button onclick="selectOptionFromPopup('${opt.value}')"
              class="w-full py-2 px-3 bg-cyan-500/10 hover:bg-cyan-500 border border-cyan-500/40 text-cyan-300 hover:text-black font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 mt-2">
        <span>Seleccionar este servicio</span>
        <i class="ph-bold ph-arrow-right"></i>
      </button>
    `;
    container.appendChild(card);
  });

  modal.classList.remove('hidden');
};

// Selección directa desde el modal
window.selectOptionFromPopup = function(serviceValue) {
  const select = document.getElementById('selectedDeviceInput');
  
  // Asegurar que exista la opción en el select
  let exists = false;
  for (let i = 0; i < select.options.length; i++) {
    if (select.options[i].value === serviceValue) {
      exists = true;
      break;
    }
  }

  if (!exists) {
    const newOpt = new Option(serviceValue, serviceValue, true, true);
    select.add(newOpt);
  }

  select.value = serviceValue;
  closeModal('catalogPopupModal');

  // Feedback y scroll suave
  const formSection = document.getElementById('form-section');
  formSection.scrollIntoView({ behavior: 'smooth' });
  formSection.classList.add('ring-2', 'ring-cyan-400');
  setTimeout(() => formSection.classList.remove('ring-2', 'ring-cyan-400'), 1500);
};

// Generador de código único SRV-XXXX
function generateBookingCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SRV-${code}`;
}

// Crear reserva
window.createReservation = function(e) {
  e.preventDefault();
  const code = generateBookingCode();
  const newReservation = {
    id: Date.now().toString(),
    code: code,
    device: document.getElementById('selectedDeviceInput').value,
    name: document.getElementById('clientName').value.trim(),
    phone: document.getElementById('clientPhone').value.trim(),
    address: document.getElementById('clientAddress').value.trim(),
    details: document.getElementById('issueDetails').value.trim(),
    status: 'Pendiente',
    createdAt: new Date().toLocaleDateString('es-CL')
  };

  const reservations = JSON.parse(localStorage.getItem('cyberfix_reservations')) || [];
  reservations.unshift(newReservation);
  localStorage.setItem('cyberfix_reservations', JSON.stringify(reservations));

  // Actualizar Modal de Ticket Digital
  document.getElementById('ticketCode').innerText = newReservation.code;
  const msg = `Hola! Quiero coordinar mi reserva de servicio técnico.%0A*Código:* ${newReservation.code}%0A*Cliente:* ${encodeURIComponent(newReservation.name)}%0A*Servicio:* ${encodeURIComponent(newReservation.device)}%0A*Dirección:* ${encodeURIComponent(newReservation.address)}%0A*Detalles:* ${encodeURIComponent(newReservation.details)}`;
  document.getElementById('ticketWhatsAppBtn').href = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;

  document.getElementById('ticketModal').classList.remove('hidden');
  document.getElementById('reservationForm').reset();
};
