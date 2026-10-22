const WHATSAPP_NUMBER = "56929123229";

// Control de modales del cliente
window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('hidden');
};

// Catálogo de servicios y opciones
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

// Abrir pop-up con sub-opciones
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

// Seleccionar opción y mostrar formulario
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

  const formSection = document.getElementById('form-section');
  formSection.classList.remove('hidden');
  formSection.classList.add('modal-enter');
  
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

  document.getElementById('ticketCode').innerText = newReservation.code;
  const msg = `Hola! Vengo de la web y acabo de generar mi reserva.%0A*Ticket:* ${newReservation.code}%0A*Cliente:* ${encodeURIComponent(newReservation.name)}%0A*Servicio:* ${encodeURIComponent(newReservation.device)}%0A*Dirección:* ${encodeURIComponent(newReservation.address)}%0A*Detalle:* ${encodeURIComponent(newReservation.details)}`;
  document.getElementById('ticketWhatsAppBtn').href = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;

  document.getElementById('ticketModal').classList.remove('hidden');
  document.getElementById('reservationForm').reset();
};

// CONSULTAR ESTADO DE RESERVA POR CÓDIGO
window.checkReservationStatus = function(e) {
  e.preventDefault();
  const searchInput = document.getElementById('statusSearchInput');
  const codeQuery = searchInput.value.trim().toUpperCase();
  const resultContainer = document.getElementById('statusResultContainer');

  const reservations = JSON.parse(localStorage.getItem('cyberfix_reservations')) || [];
  const found = reservations.find(r => r.code.toUpperCase() === codeQuery);

  resultContainer.classList.remove('hidden');
  resultContainer.classList.add('modal-enter');

  if (!found) {
    resultContainer.innerHTML = `
      <div class="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center space-y-2">
        <i class="ph-bold ph-warning-circle text-rose-400 text-3xl"></i>
        <h4 class="font-bold text-white text-base">Código no encontrado</h4>
        <p class="text-xs text-slate-300">No encontramos ningún ticket activo con el código <span class="font-mono font-bold text-rose-400">${codeQuery}</span>. Verifica que esté bien escrito o comunícate directamente por WhatsApp.</p>
      </div>
    `;
    return;
  }

  // Estilos según estado
  const statusConfig = {
    'Pendiente': {
      bg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
      icon: 'ph-clock',
      title: 'Reserva Pendiente de Revisión',
      desc: 'Tu solicitud fue recibida. Nuestro técnico revisará la disponibilidad para coordinar la hora de visita.'
    },
    'Aceptada': {
      bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
      icon: 'ph-check-circle',
      title: 'Reserva Aprobada / En Agenda',
      desc: 'Tu ticket ha sido confirmado por el técnico. La visita a domicilio está programada.'
    },
    'Cancelada': {
      bg: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
      icon: 'ph-x-circle',
      title: 'Reserva Cancelada',
      desc: 'Esta orden fue cancelada o reprogramada. Para mayor información, contáctanos a soporte.'
    }
  };

  const currentConfig = statusConfig[found.status] || statusConfig['Pendiente'];

  resultContainer.innerHTML = `
    <div class="p-6 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-4 text-left">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <span class="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Código de Ticket</span>
          <span class="font-cyber font-black text-2xl text-cyan-400">${found.code}</span>
        </div>
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${currentConfig.bg}">
          <i class="ph-bold ${currentConfig.icon}"></i>
          <span>${found.status}</span>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <span class="text-slate-400 block">Titular:</span>
          <span class="font-bold text-white text-sm">${found.name}</span>
        </div>
        <div>
          <span class="text-slate-400 block">Servicio solicitado:</span>
          <span class="font-bold text-cyan-300 text-sm">${found.device}</span>
        </div>
        <div class="sm:col-span-2">
          <span class="text-slate-400 block">Detalle registrado:</span>
          <p class="text-slate-300 italic mt-0.5">${found.details}</p>
        </div>
      </div>

      <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
        <strong class="text-white block mb-0.5">${currentConfig.title}</strong>
        ${currentConfig.desc}
      </div>

      <a href="https://wa.me/${WHATSAPP_NUMBER}?text=Hola,%20quisiera%20consultar%20por%20mi%20ticket%20${found.code}" target="_blank"
         class="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2">
        <i class="ph-bold ph-whatsapp-logo text-base"></i>
        <span>Consultar avances de este ticket por WhatsApp</span>
      </a>
    </div>
  `;
};