document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Manejador del Navbar ---
    const navbar = document.getElementById("navbar");
    if (navbar) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        });
    }

    // --- 2. Animaciones de Scroll ---
    const revealElements = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));

    // --- 3. Manejador del Formulario CON MENSAJE DE REDES SOCIALES ---
    const form = document.getElementById("contact-form");
    const statusDiv = document.getElementById("form-status");
    const submitButton = document.getElementById("submit-button");
    const fileInput = document.getElementById("file");
    const quickResponseMessage = document.getElementById("quick-response-message");

    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            if (!file) {
                resolve(null);
                return;
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            statusDiv.innerText = "";
            
            // Ocultar mensaje de respuesta rápida si estaba visible
            if (quickResponseMessage) {
                quickResponseMessage.style.display = 'none';
            }

            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const message = document.getElementById("message").value;
            const file = fileInput.files[0];

            try {
                const fileData = await getBase64(file);
                const body = JSON.stringify({
                    name: name,
                    email: email,
                    message: message,
                    file: fileData,
                });

                const response = await fetch("/.netlify/functions/sendMessage", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: body,
                });

                if (response.ok) {
                    form.reset();
                    statusDiv.innerText = "";
                    
                    // Mostrar mensaje de respuesta rápida por redes sociales
                    if (quickResponseMessage) {
                        quickResponseMessage.style.display = 'block';
                        quickResponseMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                } else {
                    throw new Error("Error al enviar el mensaje. Intenta de nuevo.");
                }
            } catch (error) {
                statusDiv.innerText = error.message;
                statusDiv.style.color = "#ff8a8a";
            } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Mensaje';
            }
        });
    }

    // --- 4. Carrusel de Servicios (Homepage) ---
    const serviceCarousel = document.getElementById('service-carousel');
    const serviceTrack = document.getElementById('service-track');
    const servicePrev = document.getElementById('service-prev');
    const serviceNext = document.getElementById('service-next');
    
    if (serviceCarousel && serviceTrack && servicePrev && serviceNext) {
        let currentIndex = 0;
        let slides = Array.from(serviceTrack.children);
        let totalSlides = slides.length;
        let intervalId = null;
        let autoPlayTime = 2000;

        const cloneSlides = () => {
            for(let i = 0; i < getSlidesToShow(); i++) {
                let clone = slides[i].cloneNode(true);
                clone.classList.add('clone');
                serviceTrack.appendChild(clone);
            }
            for(let i = totalSlides - 1; i >= totalSlides - getSlidesToShow(); i--) {
                let clone = slides[i].cloneNode(true);
                clone.classList.add('clone');
                serviceTrack.prepend(clone);
            }
        }
        
        const getSlidesToShow = () => {
            if (window.innerWidth <= 600) return 1;
            if (window.innerWidth <= 900) return 2;
            return 3;
        }

        const getSlideWidth = () => {
            const slideWidth = slides[0].getBoundingClientRect().width;
            const style = window.getComputedStyle(serviceTrack);
            const gap = parseFloat(style.gap) || 0;
            return slideWidth + gap;
        }

        const updateCarousel = (animate = true) => {
            const slideWidth = getSlideWidth();
            const offset = getSlidesToShow() * slideWidth;
            
            if (animate) {
                serviceTrack.style.transition = 'transform 0.5s ease-in-out';
            } else {
                serviceTrack.style.transition = 'none';
            }
            
            serviceTrack.style.transform = `translateX(-${offset + (currentIndex * slideWidth)}px)`;
        }

        const handleSlideChange = (direction) => {
            if (direction === 'next') {
                currentIndex++;
                updateCarousel();

                if (currentIndex >= totalSlides) {
                    setTimeout(() => {
                        currentIndex = 0;
                        updateCarousel(false);
                    }, 500);
                }
            } else {
                currentIndex--;
                updateCarousel();

                if (currentIndex < 0) {
                    setTimeout(() => {
                        currentIndex = totalSlides - 1;
                        updateCarousel(false);
                    }, 500);
                }
            }
        }

        const startAutoplay = () => {
            if (intervalId) return;
            intervalId = setInterval(() => {
                handleSlideChange('next');
            }, autoPlayTime);
        }

        const stopAutoplay = () => {
            clearInterval(intervalId);
            intervalId = null;
        }

        const initServiceCarousel = () => {
            serviceTrack.innerHTML = '';
            slides.forEach(slide => serviceTrack.appendChild(slide));
            currentIndex = 0;
            
            cloneSlides();
            updateCarousel(false);
            stopAutoplay();
            startAutoplay();
        }

        serviceNext.addEventListener('click', () => handleSlideChange('next'));
        servicePrev.addEventListener('click', () => handleSlideChange('prev'));

        ['mouseenter', 'touchstart'].forEach(evt => 
            serviceCarousel.addEventListener(evt, stopAutoplay)
        );
        ['mouseleave', 'touchend'].forEach(evt => 
            serviceCarousel.addEventListener(evt, startAutoplay)
        );
        
        window.addEventListener('resize', initServiceCarousel);
        initServiceCarousel();
    }
    
    // --- 5. MODAL CON TODA LA INFORMACIÓN ---
    const modalOverlay = document.getElementById('service-modal-overlay');
    
    const serviceDetails = {
        "Amarre de Amor": {
            fullDescription: "Este trabajo espiritual es uno de los más poderosos de la Kimbanda. Se realiza con Pombagira, entidad femenina de la pasión y el amor. El ritual incluye limpieza energética previa para eliminar obstáculos, trabajo específico de 7 días con velas, ofrendas y amarres, y seguimiento por 3 meses para fortalecer la unión. Ideal para recuperar a tu pareja, asegurar un compromiso o fortalecer una relación debilitada.",
            includes: ["Consulta inicial detallada", "Limpieza energética previa", "Ritual de 7 días con Pombagira", "Ofrendas y materiales incluidos", "Seguimiento mensual por 3 meses", "Baños de amor personalizados"],
            duration: "7 días de ritual + 3 meses de seguimiento"
        },
        "Endulzamiento": {
            fullDescription: "Trabajo de armonización diseñado para suavizar el carácter de tu pareja, mejorar la comunicación y reavivar la pasión. Se trabaja con miel, pétalos de rosa y la energía de Oxum (Orixá del amor dulce). Perfecto para relaciones que han perdido la chispa, parejas que discuten constantemente o cuando sientes que tu pareja está distante.",
            includes: ["Consulta y diagnóstico de la relación", "Ritual con miel y hierbas sagradas", "Baño de endulzamiento para ti", "Velas preparadas durante 7 días", "Instrucciones de cuidado post-ritual"],
            duration: "3-5 días"
        },
        "Abre Caminos (Exu)": {
            fullDescription: "Exu es el señor de los caminos y las encrucijadas. Este ritual quita bloqueos en todas las áreas: dinero estancado, trabajos que no llegan, amores imposibles. Se realiza en una encrucijada con ofrendas específicas a Exu, quien abre las puertas que estaban cerradas. Muchas personas experimentan cambios inmediatos.",
            includes: ["Diagnóstico espiritual de bloqueos", "Ritual en encrucijada con Exu", "Ofrendas preparadas (bebidas, velas, tabaco)", "Limpieza de caminos por 3 días", "Protección post-apertura"],
            duration: "3 días de ritual"
        },
        "Limpieza Espiritual": {
            fullDescription: "Eliminación profunda de energías negativas, larvas astrales, mal de ojo y cargas espirituales acumuladas. Se realizan pases mediúmnicos donde los Guías de luz retiran las energías densas, acompañados de baños de descarga con hierbas específicas y defumación completa del cuerpo y aura.",
            includes: ["3 sesiones de pases mediúmnicos", "Diagnóstico espiritual completo", "Baños de descarga personalizados", "Defumación con hierbas sagradas", "Protección energética básica"],
            duration: "3 sesiones en días alternos"
        },
        "Limpieza de Casa": {
            fullDescription: "Limpieza profunda de propiedades con energías densas, trabajos de brujería enterrados o presencias espirituales no deseadas. Se realiza defumación en todas las habitaciones, esquinas y entradas. Se asientan protecciones en las 4 esquinas de la propiedad y se sella energéticamente el lugar.",
            includes: ["Visita al lugar", "Diagnóstico energético del inmueble", "Defumación completa de todas las áreas", "Protecciones en 4 esquinas", "Sello energético de puertas y ventanas", "Instrucciones de mantenimiento"],
            duration: "1 día completo + seguimiento"
        },
        "Protección Personal": {
            fullDescription: "Sello de protección personal con Exu guardián. Se crea un escudo energético impenetrable alrededor de tu aura que te protege de brujerías, envidias, mal de ojo y enemigos declarados. Incluye amuleto consagrado específicamente para ti que debes portar siempre.",
            includes: ["Ritual de asentamiento de Exu protector", "Amuleto consagrado personalizado", "Sello energético en tu aura", "Baño de protección", "Instrucciones de uso del amuleto", "Recargas mensuales por 6 meses"],
            duration: "1 día de ritual"
        },
        "Prosperidad Cigana": {
            fullDescription: "Ritual del Povo Cigano (Pueblo Gitano) para atraer abundancia material, abrir caminos de negocio y magnetizar clientes. Los gitanos son maestros de la prosperidad y el comercio. Este trabajo atrae dinero de formas inesperadas y abre oportunidades comerciales.",
            includes: ["Ritual de 7 días con el Povo Cigano", "Ofrendas de miel, monedas y flores", "Baño de atracción de prosperidad", "Talismán de la suerte", "Instrucciones para mantener la energía"],
            duration: "7 días de ritual"
        },
        "Pacto con Exu do Ouro": {
            fullDescription: "Trabajo de Alta Magia para pacto directo con Exu do Ouro, entidad de la riqueza y el éxito material. Este es un compromiso espiritual serio donde Exu abre los caminos de prosperidad a cambio de ofrendas y respeto. Solo para personas comprometidas con su crecimiento económico.",
            includes: ["Consulta obligatoria", "Evaluación de viabilidad del pacto", "Ritual de 7 días", "Asentamiento de Exu do Ouro", "Instrucciones de alimentación mensual", "Seguimiento por 1 año"],
            duration: "7 días + seguimiento de 1 año"
        },
        "Pacto con Lucifer": {
            fullDescription: "Solo para entendidos en Alta Magia. Este es un pacto de alto poder espiritual con Lucifer para obtener conocimiento oculto, poder personal y dominio material. Requiere preparación espiritual previa y consulta presencial obligatoria para evaluar si estás preparado.",
            includes: ["Consulta obligatoria", "Evaluación espiritual", "Preparación ritual de 3 días", "Pacto ceremonial", "Instrucciones de cumplimiento", "Seguimiento indefinido"],
            duration: "A determinar en consulta"
        },
        "Dominio de Voluntad": {
            fullDescription: "Trabajo sutil pero muy efectivo para influir en las decisiones de jefes, socios, parejas o personas específicas. Se trabaja directamente con el Ángel Guardián de la persona objetivo, sin dañar su libre albedrío pero orientando sus decisiones hacia lo que necesitas. Es ético y respetuoso.",
            includes: ["Consulta sobre el caso específico", "Trabajo con el Ángel Guardián", "Ritual de 5 días", "Velas y ofrendas incluidas", "Seguimiento de resultados", "Refuerzo si es necesario"],
            duration: "5 días de ritual"
        },
        "Atracción de Clientes": {
            fullDescription: "Trabajo específico con el Povo Cigano para imantar tu negocio o emprendimiento. Atrae clientes, aumenta ventas y genera movimiento constante de dinero. Ideal para comercios, consultorios, negocios online o cualquier actividad comercial.",
            includes: ["Diagnóstico energético del negocio", "Ritual de imantación de 7 días", "Talismán para el local o negocio", "Baño de atracción para el dueño", "Instrucciones de mantenimiento mensual"],
            duration: "7 días de ritual"
        },
        "Separación": {
            fullDescription: "Trabajo de corte de lazos y enfriamiento entre dos personas. Aleja terceras personas, amantes o malas influencias de tu pareja. Se trabaja con Exu y Pombagira para enfriar la relación no deseada y crear distancia emocional. Discreto y efectivo.",
            includes: ["Consulta detallada del caso", "Ritual de enfriamiento de 7 días", "Corte de lazos energéticos", "Alejamiento progresivo", "Seguimiento de resultados", "Protección para ti"],
            duration: "7 días de ritual"
        },
        "Corte de Brujería": {
            fullDescription: "Identificación y devolución de trabajos de magia negra a su punto de origen. Incluye diagnóstico espiritual completo para detectar el tipo de brujería, quién la hizo y cómo devolverla. El trabajo regresa a quien lo mandó sin dañar inocentes. Incluye protección fuerte posterior.",
            includes: ["Diagnóstico espiritual completo", "Identificación del trabajo", "Ritual de corte y devolución", "Limpieza profunda", "Protección permanente", "Amuleto de resguardo"],
            duration: "3-5 días según el caso"
        },
        "Compromiso de Pareja": {
            fullDescription: "Ritual para fortalecer el compromiso entre dos personas y preparar el camino hacia el matrimonio. Se trabaja con los Orixás del amor estable (Oxum y Xangó) para armonizar la relación y crear bases sólidas. Incluye consulta de compatibilidad espiritual de la pareja.",
            includes: ["Consulta de compatibilidad", "Lectura de la relación", "Ritual para ambos", "Baño de compromiso", "Talismán de unión", "Bendición de la relación"],
            duration: "5 días de ritual"
        },
        "Baños de Descarga": {
            fullDescription: "Tratamiento intensivo de 7 baños con hierbas específicas preparadas según tu caso particular. Limpia energías densas, corta lazos negativos, elimina mal de ojo y restablece tu vibración natural. Cada baño tiene hierbas diferentes según el día.",
            includes: ["7 preparados de hierbas personalizadas", "Instrucciones de uso detalladas", "Oraciones específicas", "Velas de acompañamiento", "Seguimiento diario", "Baño de cierre"],
            duration: "7 días consecutivos"
        },
        "Protección de Hogar": {
            fullDescription: "Asentamiento permanente de Exu guardián en tu hogar. Este Exu se queda en la entrada principal protegiendo de invasiones energéticas, robos, malas intenciones y personas negativas. Requiere alimentación mensual simple. Todos los elementos del ritual están incluidos.",
            includes: ["Exu guardián asentado", "Todos los elementos del asentamiento", "Ritual de consagración", "Instrucciones de alimentación", "Protección permanente", "Consulta en caso de dudas"],
            duration: "1 día + protección permanente"
        },
        // TAROT
        "Tarot Gitano (Lenormand)": {
            fullDescription: "La sabiduría del Povo Cigano trae lecturas directas y certeras sobre amor, dinero y trabajo. Este tarot es perfecto para pregunta extensas que necesitan respuestas claras y orientación. Las cartas son leídas por el espíritu de los gitanos, maestros de la adivinación y la prosperidad.",
            includes: ["Lectura de 60 minutos", "Respuestas directas", "Ideal para preguntas extensas"],
            duration: "60 minutos"
        },
        "Tarot de Exu (Kimbanda)": {
            fullDescription: "Una consulta más profunda y reveladora. Utilizamos el poder del Tarot de Exu para detectar brujería, trabajos de magia negra, enemigos ocultos, bloqueos espirituales y obtener consejos directos de la Kimbanda. Exu y Pombagira ven lo que otros oráculos no pueden, ofreciendo soluciones de acción y limpieza.",
            includes: ["Lectura de 25-30 minutos", "Detecta brujería y enemigos", "Mensajes de Exu y Pombagira"],
            duration: "25-30 minutos"
        },
        "Lectura Completa de Amor": {
            fullDescription: "Análisis profundo de una relación o situación amorosa (pasado, presente, futuro) usando el Tarot Gitano y la Baraja de Pombagira. Ideal para conocer el estado real de tu relación, si hay terceras personas influyendo, cuál es el sentimiento de tu pareja y qué camino debes tomar para lograr tus objetivos románticos.",
            includes: ["Lectura de 30-40 minutos", "Pasado, presente y futuro", "Detecta rivales y obstáculos"],
            duration: "30-40 minutos"
        },
        "Lectura de Negocios y Dinero": {
            fullDescription: "Orientación específica para decisiones comerciales, inversiones, oportunidades laborales y flujo de dinero. Guiada por el Povo Cigano, que son los maestros de la prosperidad, el comercio y la abundancia. Recibe consejos sobre el mejor momento para invertir o iniciar un negocio.",
            includes: ["Lectura de 20-25 minutos", "Decisiones comerciales", "Momento ideal para inversiones"],
            duration: "20-25 minutos"
        },
        "Lectura Anual (12 Meses)": {
            fullDescription: "Tirada completa y extendida para conocer las energías y eventos importantes de los próximos 12 meses. Incluye consejos de protección y recomendaciones espirituales para cada mes en las áreas de amor, dinero y salud, preparándote para el futuro con ventaja.",
            includes: ["Lectura de 40-50 minutos", "Previsión de 12 meses", "Consejos de protección"],
            duration: "40-50 minutos"
        },
        "Consulta Espiritual y Oracular": {
            fullDescription: "Más que una lectura, es una consulta directa con las entidades guías. Incluye una tirada de cartas más mensajes y consejos canalizados directamente de Caboclos, Pretos Velhos, Exus o Pombagiras, según tu necesidad. Es la sesión más completa para obtener orientación espiritual profunda y un plan de acción.",
            includes: ["Consulta de 45-60 minutos", "Mensajes de entidades", "Orientación espiritual profunda"],
            duration: "45-60 minutos"
        }
    };

    if (modalOverlay) {
        const openButtons = document.querySelectorAll('.open-modal-button');
        const closeButton = document.getElementById('modal-close-button');
        
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-description');
        const modalPrice = document.getElementById('modal-price');

        const openModal = (card) => {
            const title = card.querySelector('h3').innerText.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();
            const price = card.querySelector('.price').innerText;

            modalTitle.innerText = title;
            modalPrice.innerText = price;

            const details = serviceDetails[title];
            
            if (details) {
                modalDesc.innerHTML = `
                    <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 1.5rem;">${details.fullDescription}</p>
                    
                    <h4 style="color: var(--color-accent); margin-top: 1.5rem; margin-bottom: 1rem;">
                        <i class="fas fa-check-circle"></i> Incluye:
                    </h4>
                    <ul style="list-style: none; padding: 0;">
                        ${details.includes.map(item => `
                            <li style="padding: 0.5rem 0; padding-left: 1.5rem; position: relative;">
                                <i class="fas fa-check" style="position: absolute; left: 0; top: 0.7rem; color: var(--color-accent);"></i>
                                ${item}
                            </li>
                        `).join('')}
                    </ul>
                    
                    <div style="background: rgba(212, 175, 55, 0.1); padding: 1rem; border-radius: 10px; margin-top: 1.5rem; border-left: 3px solid var(--color-accent);">
                        <strong style="color: var(--color-primary);">
                            <i class="fas fa-clock"></i> Duración:
                        </strong> ${details.duration}
                    </div>
                `;
            } else {
                const description = card.querySelector('p').innerText;
                modalDesc.innerHTML = `<p style="font-size: 1.1rem; line-height: 1.8;">${description}</p>`;
            }

            modalOverlay.classList.add('visible');
        };

        const closeModal = () => {
            modalOverlay.classList.remove('visible');
        };

        openButtons.forEach(button => {
            button.addEventListener('click', () => {
                const card = button.closest('.service-list-card');
                openModal(card);
            });
        });

        if (closeButton) {
            closeButton.addEventListener('click', closeModal);
        }

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalOverlay.classList.contains('visible')) {
                closeModal();
            }
        });
    }
});