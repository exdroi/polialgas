document.addEventListener('DOMContentLoaded', () => {
    // Contact Modal Logic
    const floatingBtn = document.getElementById('floating-contact-btn');
    const contactModal = document.getElementById('contact-modal');
    const closeContactBtn = document.getElementById('close-modal');

    function openContactModal() {
        contactModal.classList.add('show');
    }

    function closeContactModal() {
        contactModal.classList.remove('show');
    }

    floatingBtn.addEventListener('click', openContactModal);
    closeContactBtn.addEventListener('click', closeContactModal);

    // Info Modal Logic
    const infoModal = document.getElementById('info-modal');
    const closeInfoBtn = document.getElementById('close-info-modal');
    const infoModalTitle = document.getElementById('info-modal-title');
    const infoModalBody = document.getElementById('info-modal-body');

    function closeInfoModal() {
        infoModal.classList.remove('show');
    }

    closeInfoBtn.addEventListener('click', closeInfoModal);

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === contactModal) closeContactModal();
        if (e.target === infoModal) closeInfoModal();
    });

    // Content for Info Modal
    const modalContent = {
        impact: {
            title: "Impacto Real y Demostrado",
            body: `
                <h3>Reducción del Consumo de Agua</h3>
                <p>Un productor reduce la frecuencia de riego de 4 a 2 veces por semana, lo que puede disminuir aproximadamente entre 40% y 50% el consumo de agua destinado al riego del cultivo.</p>
                <ul>
                    <li>Un productor que utilice 100,000 litros semanales podría ahorrar entre 40,000 y 50,000 litros de agua por semana.</li>
                    <li>En un ciclo agrícola de 4 meses, el ahorro potencial es de 640,000 a 800,000 litros.</li>
                    <li>Si 100 productores implementaran POLI-ALGAS, el ahorro representaría entre 64 y 80 millones de litros por ciclo.</li>
                </ul>
                <h3>Sostenibilidad y Medio Ambiente</h3>
                <p>Utilizamos biomateriales que no generan residuos tóxicos, contribuyendo a la disminución del impacto ambiental.</p>
            `
        },
        about: {
            title: "Sobre POLI-ALGAS",
            body: `
                <h3>El Problema</h3>
                <p>La escasez hídrica y la degradación del suelo representan problemáticas crecientes para el sector agrícola y ambiental, particularmente en zonas áridas y semiáridas de México como el Altiplano de San Luis Potosí. La agricultura consume aproximadamente el 70% del agua dulce.</p>
                
                <h3>Nuestra Solución</h3>
                <p>POLI-ALGAS es un hidrogel biodegradable a base de algas. Nuestro modelo de negocios se enfoca en pequeños y medianos productores agrícolas. Buscamos ofrecer una alternativa que permita conservar humedad, reducir costos relacionados con el riego y mantener la productividad en condiciones de estrés climático.</p>
            `
        }
    };

    window.openInfoModal = function (type) {
        if (modalContent[type]) {
            infoModalTitle.innerHTML = modalContent[type].title;
            infoModalBody.innerHTML = modalContent[type].body;
            infoModal.classList.add('show');
        }
    };
});
