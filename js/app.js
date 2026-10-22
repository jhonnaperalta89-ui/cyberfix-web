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
    options: [
      {
        name: "Cambio de Rodamientos / Rulemanes y Eje",
        desc: "Solución para ruidos intensos al centrifugar o tambor suelto/descentrado.",
        value: "Lavarropas: Rodamientos y Eje"
      },
      {
        name: "Bomba de Desagüe y Desobstrucción",
        desc: "Limpieza o cambio si el agua se queda retenida dentro y no vacía.",
        value: "Lavarropas: Bomba de Desagüe"
      },
      {
        name: "Reparación de Placa Electrónica",
        desc: "Diagnóstico si no prende, parpadean luces o se tilda durante el ciclo.",
        value: "Lavarropas: Placa Electrónica"
      },
      {
        name: "Mantenimiento General / Fugas",
        desc: "Cambio de fuelle/goma de escotilla, electroválvula de llenado y mangueras.",
        value: "Lavarropas: Mantenimiento General"
      }
    ]
  },
  hornos: {
    category: "Hornos y Microondas",
    icon: "ph-cooking-pot",
    color: "text-amber-400",
    options: [
      {
        name: "Magnetrón y Alto Voltaje",
        desc: "Microondas que gira y prende normal pero no calienta nada la comida.",
        value: "Microondas: Magnetrón / Alto Voltaje"
      },
      {
        name: "Panel Táctil y Teclado Membrana",
        desc: "Reparación cuando los botones de tiempo o inicio no responden.",
        value: "Microondas: Panel Táctil"
      },
      {
        name: "Resistencias Térmicas y Termostato",
        desc: "Hornos eléctricos que no alcanzan temperatura o queman por un solo lado.",
        value: "Horno Eléctrico: Resistencias / Termostato"
      },
      {
        name: "Placa Mica y Aislamiento de Chispas",
        desc: "Solución para chispazos internos que amenazan con quemar el artefacto.",
        value: "Microondas: Placa Mica / Antichispas"
      }
    ]
  },
  computadores: {
    category: "Computadores y Notebooks",
    icon: "ph-desktop",
    color: "text-indigo-400",
    options: [
      {
        name: "Limpieza Profunda + Pasta Térmica",
        desc: "Desarme, soplado de turbinas y pasta térmica para quitar el recalentamiento.",
        value: "PC/Notebook: Limpieza y Pasta Térmica"
      },
      {
        name: "Instalación de Disco Sólido (SSD)",
        desc: "Aumenta la velocidad hasta 10 veces manteniendo tus fotos y archivos.",
        value: "PC/Notebook: Instalación de Disco SSD"
      },
      {
        name: "Formateo e Instalación Limpia",
        desc: "Sistema Windows optimizado, sin virus y con programas esenciales listos.",
        value: "PC/Notebook: Formateo y Optimización"
      },
      {
        name: "Reparación de Bisagras y Pantallas",
        desc: "Arreglo de carcasas rotas al abrir la laptop y cambio de displays dañados.",
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
    card.className = "bg-slate-950/90 border border-slate-800 hover:border-cyan-400 p-4 rounded-2xl transition duration-200 flex flex-col justify-between gap-3 text-left";
    card.innerHTML = `
      <div>
        <h4 class="font-bold text-white text-sm md:text-base flex items-center gap-2">
          <i class="ph-bold ph-check text-cyan-400"></i>
          ${opt.name}
        </h4>
        <p class="text-xs text-slate-300 mt-1 leading-relaxed">${opt.desc}</p>
      </div>
      <button onclick="selectOptionFromPopup('${opt.value}')"
              class="w-full py-2.5 px-3 bg-cyan-500/10 hover:bg-cyan-400 border border-cyan-500/30 text-cyan-300 hover:text-black font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 mt-2">
        <span>Elegir este servicio y reservar</span>
        <i class="ph-bold ph-arrow-right"></i>
      </button>
    `;
    container.appendChild(card);
  });

  modal.classList.remove('hidden');
};

// Selección directa desde el modal: REVELA EL FORMULARIO DE RESERVA
window.selectOptionFromPopup = function(serviceValue) {
  const select = document.getElementById('selectedDeviceInput');
  
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

  // Mostrar el formulario que estaba oculto
  const formSection = document.getElementById('form-section');
  formSection.classList.remove('hidden');
  formSection.classList.add('modal-enter');
  
  // Desplazamiento suave directo al formulario
  formSection.scrollIntoView({ behavior: 'smooth' });
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

// Crear reserva y enviar a WhatsApp
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

  // Modal de Ticket Digital
  document.getElementById('ticketCode').innerText = newReservation.code;
  const msg = `Hola! Vengo de la web y acabo de generar mi reserva.%0A*Ticket:* ${newReservation.code}%0A*Cliente:* ${encodeURIComponent(newReservation.name)}%0A*Servicio:* ${encodeURIComponent(newReservation.device)}%0A*Dirección:* ${encodeURIComponent(newReservation.address)}%0A*Detalle:* ${encodeURIComponent(newReservation.details)}`;
  document.getElementById('ticketWhatsAppBtn').href = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;

  document.getElementById('ticketModal').classList.remove('hidden');
  document.getElementById('reservationForm').reset();
};