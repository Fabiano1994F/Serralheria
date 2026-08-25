document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. MENU HAMBÚRGUER RESPONSIVO (MOBILE)
     ========================================================================== */
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  /* ==========================================================================
     2. ALTERAÇÃO DINÂMICA DE REGIÃO (URL Parameter)
     ========================================================================== */
  const aplicarRegiaoDinamica = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const regiaoParam = urlParams.get('regiao');

    if (regiaoParam) {
      const regiaoFormatada = decodeURIComponent(regiaoParam)
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());

      const regiaoTextoHeader = document.querySelector('#regiao-texto strong');
      const regiaoTextoHero = document.querySelector('.highlight-regiao');
      const campoBairroForm = document.querySelector('#bairro');

      if (regiaoTextoHeader) regiaoTextoHeader.textContent = regiaoFormatada;
      if (regiaoTextoHero) regiaoTextoHero.textContent = regiaoFormatada;

      if (campoBairroForm && !campoBairroForm.value) {
        campoBairroForm.value = regiaoFormatada;
      }
    }
  };

  /* ==========================================================================
     3. MÁSCARA AUTOMÁTICA PARA O CAMPO DE WHATSAPP (Caso exista no HTML)
     ========================================================================== */
  const inputWhatsapp = document.querySelector('#whatsapp');

  if (inputWhatsapp) {
    inputWhatsapp.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');

      if (value.length > 11) value = value.slice(0, 11);

      if (value.length > 6) {
        value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
      } else if (value.length > 2) {
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
      } else if (value.length > 0) {
        value = `(${value}`;
      }

      e.target.value = value;
    });
  }

  /* ==========================================================================
     4. CAPTURA DO FORMULÁRIO E ENVIO PARA O WHATSAPP
     ========================================================================== */
  const formLead = document.querySelector('#form-lead');
  const SEU_NUMERO_WHATSAPP = '5511939352126'; // Formato correto: DDI + DDD + Número

  if (formLead) {
    formLead.addEventListener('submit', (e) => {
      e.preventDefault();

      // Captura os valores com verificação de segurança
      const nomeInput = document.querySelector('#nome');
      const bairroInput = document.querySelector('#bairro');
      const whatsappInput = document.querySelector('#whatsapp');
      const servicoSelect = document.querySelector('#servico');

      const nome = nomeInput ? nomeInput.value.trim() : '';
      const bairro = bairroInput ? bairroInput.value.trim() : '';
      const whatsapp = whatsappInput ? whatsappInput.value.trim() : '';
      const servicoNome = servicoSelect && servicoSelect.selectedIndex !== -1 
        ? servicoSelect.options[servicoSelect.selectedIndex].text 
        : '';

      // Monta a mensagem personalizada
      let mensagem = `Olá! Gostaria de solicitar um orçamento:%0A%0A` +
        `👤 *Nome:* ${encodeURIComponent(nome)}%0A` +
        `📍 *Bairro/Região:* ${encodeURIComponent(bairro)}%0A` +
        `🛠️ *Serviço:* ${encodeURIComponent(servicoNome)}`;

      // Adiciona o campo de WhatsApp na mensagem apenas se ele existir e for preenchido
      if (whatsapp) {
        mensagem += `%0A📱 *WhatsApp do Cliente:* ${encodeURIComponent(whatsapp)}`;
      }

      // Utiliza a constante com o número correto (DDI 55 incluído)
      const whatsappUrl = `https://wa.me/${SEU_NUMERO_WHATSAPP}?text=${mensagem}`;

      // Abre a conversa diretamente no WhatsApp
      window.open(whatsappUrl, '_blank');

      // Limpa o formulário
      formLead.reset();
    });
  }

  // Inicializa as funções
  aplicarRegiaoDinamica();
});

/* ==========================================================================
     5. CONTROLE DO CARROSSEL DE PROJETOS CONCLUÍDOS
     ========================================================================== */
  const track = document.getElementById('carousel-track');
  const slides = Array.from(track ? track.children : []);
  const nextBtn = document.getElementById('carousel-next');
  const prevBtn = document.getElementById('carousel-prev');
  const dotsNav = document.getElementById('carousel-dots');

  if (track && slides.length > 0) {
    let currentIndex = 0;
    let autoPlayInterval;

    // Cria os pontinhos (dots) dinamicamente com base no número de slides
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => moveToSlide(index));
      dotsNav.appendChild(dot);
    });

    const dots = Array.from(dotsNav.children);

    const updateDots = (index) => {
      dots.forEach(dot => dot.classList.remove('active'));
      if (dots[index]) dots[index].classList.add('active');
    };

    const moveToSlide = (index) => {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;

      track.style.transform = `translateX(-${index * 100}%)`;
      currentIndex = index;
      updateDots(currentIndex);
      resetAutoPlay();
    };

    nextBtn.addEventListener('click', () => moveToSlide(currentIndex + 1));
    prevBtn.addEventListener('click', () => moveToSlide(currentIndex - 1));

    // Transição Automática a cada 5 segundos
    const startAutoPlay = () => {
      autoPlayInterval = setInterval(() => {
        moveToSlide(currentIndex + 1);
      }, 5000);
    };

    const resetAutoPlay = () => {
      clearInterval(autoPlayInterval);
      startAutoPlay();
    };

    // Pausa no autoplay ao passar o mouse
    track.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    track.addEventListener('mouseleave', () => startAutoPlay());

    // Inicia a reprodução automática
    startAutoPlay();
  }

  document.addEventListener('DOMContentLoaded', () => {
  // Lógica do Filtro de Categorias
  const filterBtns = document.querySelectorAll('.filter-btn');
  const catalogItems = document.querySelectorAll('.catalog-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      catalogItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.classList.remove('hide');
        } else {
          item.classList.add('hide');
        }
      });
    });
  });

  // Lógica de Zoom na Foto (Lightbox)
  const catalogImgs = document.querySelectorAll('.catalog-img-box img');
  const lightbox = document.getElementById('catalog-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  catalogImgs.forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightbox.classList.add('active');
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
      }
    });
  }
});