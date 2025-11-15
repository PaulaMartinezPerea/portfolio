/* Espera a que el DOM esté listo */
document.addEventListener('DOMContentLoaded', () => {
  
  //MODO OSCURO
  /* Crea botón flotante, recupera preferencia y la guarda en localStorage */
  const darkModeToggle = document.createElement('button');
  darkModeToggle.className = 'dark-mode-toggle';
  darkModeToggle.innerHTML = '🌙';
  document.body.appendChild(darkModeToggle);
  
  /* Recupera la preferencia guardada (string 'true' o 'false') */
  const savedDarkMode = localStorage.getItem('darkMode');
  const isDarkMode = savedDarkMode === 'true';
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
    darkModeToggle.innerHTML = '☀️';
  }
  
  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    darkModeToggle.innerHTML = isDark ? '☀️' : '🌙';
    localStorage.setItem('darkMode', isDark);
  });
  
  //MOSTRAR/OCULTAR SECCIONES AL HACER CLIC
  /* Evita recargar la página; hace scroll suave y muestra solo la sección seleccionada */
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        /* Oculta todas las secciones */
        sections.forEach(section => {
          section.classList.remove('section-visible');
          section.classList.add('section-hidden');
        });
        
        /* Mostrar solo la sección seleccionada */
        targetSection.classList.remove('section-hidden');
        targetSection.classList.add('section-visible');
        
        /* Scroll suave a la sección */
        const headerOffset = 80;
        const elementPosition = targetSection.offsetTop;
        const offsetPosition = elementPosition - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        /* Actualiza el enlace activo */
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });
  
  //TRADUCCIÓN AL INGLÉS
  /* Crea botón para alternar idioma y guarda preferencia en localStorage.
     La función translatePage busca elementos con data-es y data-en */
  const languageToggle = document.createElement('button');
  languageToggle.className = 'language-toggle';
  languageToggle.innerHTML = 'EN';
  document.body.appendChild(languageToggle);
  
  let currentLanguage = localStorage.getItem('language') || 'es';
  
  /* Aplica el idioma guardado al cargar */
  if (currentLanguage === 'en') {
    translatePage('en');
    languageToggle.innerHTML = 'ES';
  }
  
  languageToggle.addEventListener('click', () => {
    currentLanguage = currentLanguage === 'es' ? 'en' : 'es';
    translatePage(currentLanguage);
    languageToggle.innerHTML = currentLanguage === 'es' ? 'EN' : 'ES';
    localStorage.setItem('language', currentLanguage);
  });
  
  function translatePage(lang) {
    const elements = document.querySelectorAll('[data-es][data-en]');
    
    elements.forEach(element => {
      const text = lang === 'es' ? element.getAttribute('data-es') : element.getAttribute('data-en');
      
      /* Mantiene las mayúsculas en elementos específicos */
      if (element.tagName === 'A' || element.tagName === 'H1' || element.tagName === 'H2' || 
          element.tagName === 'H3' || element.classList.contains('btn') || 
          element.classList.contains('skill-card')) {
        element.textContent = text.toUpperCase();
      } else {
        element.textContent = text;
      }
    });
    
    /* Actualiza el atributo lang del HTML */
    document.documentElement.lang = lang;
  }
  
  //NAVEGACIÓN Y HIGHLIGHT
  /* Marca el link activo según scroll (funciona con secciones mostradas) */
  function highlightActiveLink() {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (window.pageYOffset >= sectionTop - 100) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === current) {
        link.classList.add('active');
      }
    });
  }
  
  window.addEventListener('scroll', highlightActiveLink);
  
  //ANIMACIONES DE APARICIÓN (IntersectionObserver)
  /* Observa elementos con clase .fade-in y aplica animación cuando entran al viewport */
  const fadeElements = document.querySelectorAll('.fade-in');
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  fadeElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    fadeObserver.observe(element);
  });
  
  //EFECTO PARALLAX EN EL INICIO
  /* Mueve ligeramente el hero con el scroll para sensación de profundidad */
  const heroSection = document.querySelector('.hero');
  
  window.addEventListener('scroll', () => {
    if (heroSection) {
      const scrolled = window.pageYOffset;
      const parallaxSpeed = 0.5;
      heroSection.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }
  });

  //CAMBIO DE SOMBRA DEL HEADER AL SCROLL
  /* Añade una sombra más fuerte si haces scroll */
  const header = document.querySelector('header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.25)';
    } else {
      header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.2)';
    }
  });
  
  //BOTÓN "VOLVER ARRIBA"
  /* Aparece cuando scrolleas suficiente hacia abajo */
  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.innerHTML = '↑';
  scrollTopBtn.className = 'scroll-top-btn';
  document.body.appendChild(scrollTopBtn);
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      scrollTopBtn.style.opacity = '1';
      scrollTopBtn.style.transform = 'translateY(0)';
    } else {
      scrollTopBtn.style.opacity = '0';
      scrollTopBtn.style.transform = 'translateY(20px)';
    }
  });
  
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  //EFECTO RIPPLE EN BOTONES
  /* Al hacer clic, se crea un span con animación y se elimina después 
     (Este efecto es visual y se aplica a .btn y .btn-secondary) */
  const buttons = document.querySelectorAll('.btn, .btn-secondary');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
      `;
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });

  //MENÚ MÓVIL (HAMBURGUESA)
  /* Crea el botón hamburguesa y controla la apertura del menú en móvil */
  const hamburger = document.createElement('button');
  hamburger.className = 'hamburger-menu';
  hamburger.innerHTML = '☰';
  document.body.appendChild(hamburger);
  
  const mobileMenu = document.querySelector('.nav-links');
  
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    hamburger.innerHTML = mobileMenu.classList.contains('active') ? '✕' : '☰';
  });
  
  /* Cierra el menú al hacer clic en un enlace */
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        mobileMenu.classList.remove('active');
        hamburger.innerHTML = '☰';
      }
    });
  });
  
  /* Responsive: muestra hamburguesa en móvil */
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
      hamburger.style.display = 'block';
    } else {
      hamburger.style.display = 'none';
      mobileMenu.classList.remove('active');
    }
  });
  
  if (window.innerWidth <= 768) {
    hamburger.style.display = 'block';
  }

  //LAZY LOADING DE IMÁGENES 
  /* Observa imágenes con data-src y las carga cuando entran al viewport */
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.getAttribute('data-src');
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
});

//FUNCIONES GLOBALES AUXILIARES
/* Comprueba visibilidad completa */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/* Debounce para optimizar eventos */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/* Throttle para optimizar scroll */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}