document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupReveal();
  setupCalculator();
});

function setupNavigation() {
  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");

  const syncHeader = () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 18);
  };

  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });

  if (!toggle || !nav) return;

  const closeNav = () => {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menú");
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Abrir menú" : "Cerrar menú");
    nav.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("nav-open", !isOpen);
  });

  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNav));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });
}

function setupReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (!elements.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px" });

  elements.forEach((element) => observer.observe(element));
}

function setupCalculator() {
  const form = document.querySelector("#dose-form");
  if (!form) return;

  const fields = {
    name: document.querySelector("#plant-name"),
    water: document.querySelector("#water-ml"),
    days: document.querySelector("#interval-days"),
    type: document.querySelector("#plant-type"),
    drainage: document.querySelector("#drainage"),
    error: document.querySelector("#form-error")
  };

  const output = {
    plant: document.querySelector("#result-plant"),
    range: document.querySelector("#dose-range"),
    theoretical: document.querySelector("#theoretical-dose"),
    retained: document.querySelector("#retained-water"),
    check: document.querySelector("#next-check"),
    summary: document.querySelector("#result-summary"),
    status: document.querySelector("#result-status"),
    plan: document.querySelector("#result-plan-list"),
    alert: document.querySelector("#safety-alert"),
    meter: document.querySelector("#meter-fill")
  };

  const roundDose = (value) => Math.round(value * 10) / 10;
  const grams = (value) => `${value.toFixed(1)} g`;
  const waterLabel = (value) => `${Math.round(value)} ml`;

  const factors = {
    standard: [0.5, 0.75],
    flowering: [0.6, 0.8],
    succulent: [0.25, 0.4],
    unknown: [0.4, 0.6]
  };

  function calculate() {
    const water = Number(fields.water.value);
    const days = Number(fields.days.value);
    const name = fields.name.value.trim();
    const type = fields.type.value;
    const drainage = fields.drainage.value;
    const hasProduct = form.elements.hasProduct.value === "yes";

    const valid = Number.isFinite(water) && Number.isFinite(days) && water >= 10 && days >= 1;
    fields.error.hidden = valid;
    if (!valid) return;

    const theoretical = water / 150;
    const drainageFactor = drainage === "good" ? 1 : drainage === "limited" ? 0.75 : 0;
    const [lowFactor, highFactor] = factors[type] || factors.unknown;
    const low = roundDose(theoretical * lowFactor * drainageFactor);
    const high = roundDose(theoretical * highFactor * drainageFactor);
    const checkDay = Math.max(1, Math.floor(days * 0.8));

    output.plant.textContent = name ? `Para ${name}` : "Para tu planta";
    output.theoretical.textContent = grams(roundDose(theoretical));
    output.theoretical.nextElementSibling.textContent = `${Math.round(water)} ml ÷ 150 ml/g`;
    output.check.textContent = `Día ${checkDay}`;

    output.status.classList.remove("is-warning");
    output.alert.classList.remove("is-warning");

    if (drainage === "none") {
      output.status.textContent = "Corrige el drenaje";
      output.status.classList.add("is-warning");
      output.range.textContent = "0 g";
      output.retained.textContent = "No aplicar";
      output.summary.textContent = `La capacidad equivalente sería de ${grams(roundDose(theoretical))}, pero una maceta sin salida de agua eleva el riesgo de saturación.`;
      output.plan.innerHTML = [
        "<li><span>1</span><p>Trasplanta a una maceta con uno o más orificios de drenaje.</p></li>",
        "<li><span>2</span><p>No incorpores POLI-ALGAS mientras el agua no pueda salir del recipiente.</p></li>",
        "<li><span>3</span><p>Cuando soluciones el drenaje, vuelve a calcular con los mismos datos.</p></li>"
      ].join("");
      output.alert.innerHTML = "<strong>Aplicación detenida.</strong> Antes de retener más humedad, la maceta debe permitir que salga el exceso de agua.";
      output.alert.classList.add("is-warning");
      output.meter.style.width = "0%";
      return;
    }

    if (hasProduct) {
      output.status.textContent = "Sin dosis adicional";
      output.range.textContent = "0 g adicionales";
      output.retained.textContent = "Reutiliza la reserva";
      output.summary.textContent = "POLI-ALGAS ya está en el sustrato. Rehidrata la aplicación existente y observa la humedad antes de añadir más producto.";
      output.plan.innerHTML = [
        `<li><span>1</span><p>Conserva la dosis que ya está mezclada en la zona de raíces.</p></li>`,
        `<li><span>2</span><p>Revisa la humedad cerca del día ${checkDay}; si sigue húmedo, espera 24–48 horas.</p></li>`,
        `<li><span>3</span><p>Riega gradualmente, sin superar de inicio tus ${Math.round(water)} ml habituales.</p></li>`
      ].join("");
      output.alert.innerHTML = `<strong>No añadas producto cada ${Math.round(days)} días.</strong> La siguiente fecha corresponde a revisar o regar, no a repetir la dosis.`;
      output.meter.style.width = "0%";
      return;
    }

    output.status.textContent = drainage === "limited" ? "Inicio reducido" : "Rango inicial";
    if (drainage === "limited") output.status.classList.add("is-warning");
    output.range.textContent = `${low.toFixed(1)}–${high.toFixed(1)} g`;
    output.retained.textContent = `${waterLabel(low * 150)}–${waterLabel(high * 150)}`;
    output.summary.textContent = `Tu consumo equivale a un máximo teórico de ${grams(roundDose(theoretical))}. Empieza con una parte del máximo y observa el comportamiento del sustrato.`;
    output.plan.innerHTML = [
      `<li><span>1</span><p>Mezcla <strong>${low.toFixed(1)} a ${high.toFixed(1)} g</strong> en la zona de raíces; no lo concentres en un solo punto.</p></li>`,
      `<li><span>2</span><p>Riega poco a poco, en dos pasadas, y deja salir el excedente por el drenaje.</p></li>`,
      `<li><span>3</span><p>Revisa la humedad cerca del día ${checkDay}. Si continúa húmedo, espera 24–48 horas.</p></li>`
    ].join("");

    if (drainage === "limited") {
      output.alert.innerHTML = `<strong>Usa el extremo bajo del rango.</strong> Tu maceta drena lentamente; mejora la aireación y no riegues por calendario si el sustrato sigue húmedo.`;
      output.alert.classList.add("is-warning");
    } else {
      output.alert.innerHTML = `<strong>No repitas la dosis cada ${Math.round(days)} días.</strong> El producto permanece en el sustrato y vuelve a hidratarse con los riegos posteriores.`;
    }

    output.meter.style.width = `${Math.min(100, Math.round((high / theoretical) * 100))}%`;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    calculate();
    document.querySelector(".calculator-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  form.querySelectorAll("select, input[type='radio']").forEach((control) => {
    control.addEventListener("change", calculate);
  });

  calculate();
}
