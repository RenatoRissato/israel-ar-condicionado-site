/* Israel Ar-condicionado — comportamento do site.

   Contato: WHATSAPP_NUMBER abaixo é o ponto único de verdade. Os hrefs dos links
   .whatsapp-link no HTML existem apenas como fallback para quando o JS não carrega;
   com o JS ativo eles são reescritos a partir daqui. Para trocar o número, veja o README.

   Cada bloco init* checa os próprios elementos e desiste em silêncio se não achá-los,
   para que uma seção removida do HTML não derrube o resto da página. */

const WHATSAPP_NUMBER = '5519999453094';
const WHATSAPP_DEFAULT_MESSAGE = 'Olá! Vim pelo site da Israel Ar-condicionado e gostaria de solicitar um orçamento.';
const MOBILE_BREAKPOINT = 820;

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function whatsappUrl(message = WHATSAPP_DEFAULT_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function openWhatsApp(message) {
  const url = whatsappUrl(message);
  // Sem 'noopener' na feature string: com ela, window.open retorna null mesmo quando
  // a aba abre, e a detecção de bloqueio daria falso positivo.
  const tab = window.open(url, '_blank');
  if (tab) tab.opener = null;
  else window.location.href = url;
}

function initWhatsAppLinks() {
  document.querySelectorAll('a.whatsapp-link').forEach((link) => {
    link.href = whatsappUrl();
  });
}

function initMenu() {
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.nav');
  if (!header || !menuButton || !navigation) return;

  const setMenu = (open) => {
    navigation.classList.toggle('open', open);
    header.classList.toggle('menu-active', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.classList.toggle('menu-open', open);
  };

  menuButton.addEventListener('click', () => {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  });

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuButton.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > MOBILE_BREAKPOINT) setMenu(false);
  });
}

function initScrollBehaviour() {
  const header = document.querySelector('.site-header');
  const backToTop = document.querySelector('.back-to-top');
  if (!header && !backToTop) return;

  const handleScroll = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 24);
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 650);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  }
}

function initScrollSpy() {
  if (!('IntersectionObserver' in window)) return;

  // Só âncoras internas: um href externo no menu faria querySelector lançar SyntaxError.
  const links = [...document.querySelectorAll('.nav a')]
    .filter((link) => (link.getAttribute('href') || '').startsWith('#'));
  const sections = links.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        const selected = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('active', selected);
        if (selected) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-32% 0px -58% 0px', threshold: 0 });

  sections.forEach((section) => observer.observe(section));
}

function initFaq() {
  document.querySelectorAll('.faq-item button').forEach((button) => {
    const answer = document.getElementById(button.getAttribute('aria-controls'));
    if (!answer) return;
    const icon = button.querySelector('span');

    button.addEventListener('click', () => {
      const opening = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(opening));
      if (icon) icon.textContent = opening ? '−' : '+';
      answer.hidden = !opening;
    });
  });
}

function initCarousel() {
  const slides = [...document.querySelectorAll('.review-slide')];
  const buttons = [...document.querySelectorAll('.carousel-button')];
  const status = document.querySelector('.carousel-status');
  if (slides.length < 2 || !buttons.length) return;

  let current = 0;

  const showSlide = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === current;
      slide.hidden = !active;
      slide.classList.toggle('is-active', active);
    });
    if (status) status.textContent = `${current + 1} / ${slides.length}`;
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      showSlide(current + (button.dataset.direction === 'next' ? 1 : -1));
    });
  });
}

function initQuoteForm() {
  const form = document.getElementById('orcamento-form');
  if (!form) return;

  const typeError = document.getElementById('erro-tipo');

  // A validação nativa só é desligada quando o JS está ativo para assumir o controle.
  // Sem JS, o navegador continua exigindo os campos obrigatórios.
  form.noValidate = true;

  const setFieldError = (field, message) => {
    const wrapper = field.closest('.field');
    if (!wrapper) return;
    const error = wrapper.querySelector('.field-error');
    wrapper.classList.toggle('invalid', Boolean(message));
    if (error) error.textContent = message;
    field.setAttribute('aria-invalid', String(Boolean(message)));
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = form.elements.nome;
    const service = form.elements.servico;
    const type = form.querySelector('input[name="tipo"]:checked');
    let valid = true;

    setFieldError(name, name.value.trim() ? '' : 'Informe seu nome.');
    setFieldError(service, service.value ? '' : 'Selecione o serviço desejado.');

    if (!name.value.trim()) valid = false;
    if (!service.value) valid = false;

    if (!type) {
      if (typeError) typeError.textContent = 'Selecione residencial ou comercial.';
      valid = false;
    } else if (typeError) {
      typeError.textContent = '';
    }

    if (!valid) {
      const firstInvalid = form.querySelector('[aria-invalid="true"]') || form.querySelector('input[name="tipo"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const details = form.elements.mensagem.value.trim() || 'Não informado';
    openWhatsApp(
      `Olá! Vim pelo site da Israel Ar-condicionado.\n\n` +
      `Nome: ${name.value.trim()}\n` +
      `Atendimento: ${type.value}\n` +
      `Serviço: ${service.value}\n` +
      `Mensagem: ${details}\n\n` +
      `Gostaria de solicitar um orçamento.`
    );
  });

  form.querySelectorAll('input, select').forEach((field) => {
    field.addEventListener('change', () => {
      if (field.name === 'tipo') {
        if (typeError) typeError.textContent = '';
      } else if (field.value.trim()) {
        setFieldError(field, '');
      }
    });
  });
}

function initFooterYear() {
  const year = document.getElementById('ano');
  if (year) year.textContent = new Date().getFullYear();
}

function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  if (reducedMotion || !('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, self) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      self.unobserve(entry.target);
    });
  }, { threshold: .12 });

  elements.forEach((element) => observer.observe(element));
}

initWhatsAppLinks();
initMenu();
initScrollBehaviour();
initScrollSpy();
initFaq();
initCarousel();
initQuoteForm();
initFooterYear();
initReveal();
