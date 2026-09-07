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

    // Estado inicial em sincronia com o HTML: todas as perguntas começam fechadas.
    answer.classList.toggle('is-open', button.getAttribute('aria-expanded') === 'true');

    button.addEventListener('click', () => {
      const opening = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(opening));
      // A classe permite animar a altura; 'hidden' cortaria a transição, e o
      // desenho do sinal +/− vem do próprio aria-expanded, pelo CSS.
      answer.classList.toggle('is-open', opening);
    });
  });
}

const CAROUSEL_DELAY = 6000;
const STORIES_DELAY = 4000;

function initCarousel() {
  const carousel = document.querySelector('.review-carousel');
  const slides = [...document.querySelectorAll('.review-slide')];
  const setas = [...document.querySelectorAll('.carousel-button[data-direction]')];
  const dots = [...document.querySelectorAll('.carousel-dot')];
  const toggle = document.querySelector('.carousel-toggle');
  if (!carousel || slides.length < 2) return;

  let atual = 0;
  let timer = null;
  let pausadoPeloUsuario = false;

  // A barra de progresso só existe quando há rotação automática: sob
  // prefers-reduced-motion ela não teria o que mostrar.
  let barra = null;
  if (!reducedMotion) {
    barra = document.createElement('div');
    barra.className = 'carousel-progress';
    barra.setAttribute('aria-hidden', 'true');
    barra.innerHTML = '<span></span>';
    carousel.style.setProperty('--carousel-delay', `${CAROUSEL_DELAY}ms`);
    carousel.appendChild(barra);
  }

  const reiniciarBarra = () => {
    if (!barra) return;
    barra.classList.remove('is-running');
    void barra.offsetWidth;            // força reflow: sem isso a animação não reinicia
    if (timer) barra.classList.add('is-running');
  };

  const mostrar = (indice) => {
    atual = (indice + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const ativo = i === atual;
      slide.classList.toggle('is-active', ativo);
      slide.setAttribute('aria-hidden', String(!ativo));
    });
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === atual));
    reiniciarBarra();
  };

  const parar = () => {
    clearInterval(timer);
    timer = null;
    if (barra) barra.classList.remove('is-running');
  };

  const rodar = () => {
    if (timer || reducedMotion || pausadoPeloUsuario) return;
    timer = setInterval(() => mostrar(atual + 1), CAROUSEL_DELAY);
    reiniciarBarra();
  };

  setas.forEach((botao) => {
    botao.addEventListener('click', () => {
      mostrar(atual + (botao.dataset.direction === 'next' ? 1 : -1));
      if (timer) { parar(); rodar(); }   // recomeça a contagem após ação manual
    });
  });

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      mostrar(Number(dot.dataset.goto));
      if (timer) { parar(); rodar(); }
    });
  });

  if (toggle) {
    // WCAG 2.2.2: conteúdo que se move sozinho precisa de um jeito de parar.
    if (reducedMotion) toggle.hidden = true;
    toggle.addEventListener('click', () => {
      pausadoPeloUsuario = !pausadoPeloUsuario;
      toggle.setAttribute('aria-pressed', String(pausadoPeloUsuario));
      toggle.setAttribute('aria-label', pausadoPeloUsuario ? 'Retomar troca automática' : 'Pausar troca automática');
      toggle.firstElementChild.textContent = pausadoPeloUsuario ? '▶' : '❙❙';
      if (pausadoPeloUsuario) parar();
      else rodar();
    });
  }

  // Pausa enquanto o visitante lê (ponteiro em cima) ou navega pelo teclado.
  carousel.addEventListener('mouseenter', parar);
  carousel.addEventListener('mouseleave', rodar);
  carousel.addEventListener('focusin', parar);
  carousel.addEventListener('focusout', (event) => {
    if (!carousel.contains(event.relatedTarget)) rodar();
  });

  // Não gasta timer com a aba em segundo plano nem com o carrossel fora da tela.
  document.addEventListener('visibilitychange', () => (document.hidden ? parar() : rodar()));

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => (entrada.isIntersecting ? rodar() : parar()));
    }, { threshold: .25 }).observe(carousel);
  } else {
    rodar();
  }

  mostrar(0);
}

function initStories() {
  const trilho = document.querySelector('.stories-track');
  const cards = [...document.querySelectorAll('.story')];
  const dots = [...document.querySelectorAll('.story-dot')];
  const toggle = document.querySelector('.stories-toggle');
  const anterior = document.querySelector('.story-nav-prev');
  const proximo = document.querySelector('.story-nav-next');
  if (!trilho || cards.length < 2) return;

  let atual = 0;
  let timer = null;
  let pausadoPeloUsuario = false;
  let rolandoSozinho = false;
  let destravar = null;

  const destacar = (indice) => {
    atual = (indice + cards.length) % cards.length;
    cards.forEach((card, i) => card.classList.toggle('is-current', i === atual));
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === atual);
      dot.setAttribute('aria-current', String(i === atual));
    });
    const fim = trilho.scrollWidth - trilho.clientWidth - 2;
    if (anterior) anterior.disabled = trilho.scrollLeft <= 2;
    if (proximo) proximo.disabled = trilho.scrollLeft >= fim;
  };

  // Rola só o necessário: em telas largas os cards já cabem todos, e aí o
  // destaque anda sozinho sem mexer no trilho.
  const mostrar = (indice, suave = true) => {
    destacar(indice);
    // A trava vale sempre, mesmo quando não há o que rolar: no desktop cabem
    // vários cards e o scrollLeft quase não muda, então qualquer evento de
    // scroll residual recalcularia o destaque e desfaria o avanço do rodízio.
    rolandoSozinho = true;
    clearTimeout(destravar);
    destravar = setTimeout(() => { rolandoSozinho = false; }, 700);

    const card = cards[atual];
    const inicio = card.offsetLeft - trilho.scrollLeft;
    const sobra = inicio + card.offsetWidth - trilho.clientWidth;
    if (inicio >= -2 && sobra <= 2) return;   // já está inteiro à vista
    const alvo = card.offsetLeft - (trilho.clientWidth - card.offsetWidth) / 2;
    trilho.scrollTo({ left: Math.max(0, alvo), behavior: (suave && !reducedMotion) ? 'smooth' : 'auto' });
  };

  const parar = () => { clearInterval(timer); timer = null; };

  const rodar = () => {
    if (timer || reducedMotion || pausadoPeloUsuario) return;
    timer = setInterval(() => mostrar(atual + 1), STORIES_DELAY);
  };

  const reiniciar = () => { if (timer) { parar(); rodar(); } };

  if (anterior) anterior.addEventListener('click', () => { mostrar(atual - 1); reiniciar(); });
  if (proximo) proximo.addEventListener('click', () => { mostrar(atual + 1); reiniciar(); });
  dots.forEach((dot) => dot.addEventListener('click', () => { mostrar(Number(dot.dataset.goto)); reiniciar(); }));

  trilho.addEventListener('keydown', (evento) => {
    if (evento.key === 'ArrowRight') { evento.preventDefault(); mostrar(atual + 1); reiniciar(); }
    if (evento.key === 'ArrowLeft') { evento.preventDefault(); mostrar(atual - 1); reiniciar(); }
  });

  if (toggle) {
    // WCAG 2.2.2: conteúdo que se move sozinho precisa de um jeito de parar.
    if (reducedMotion) toggle.hidden = true;
    toggle.addEventListener('click', () => {
      pausadoPeloUsuario = !pausadoPeloUsuario;
      toggle.setAttribute('aria-pressed', String(pausadoPeloUsuario));
      toggle.setAttribute('aria-label', pausadoPeloUsuario ? 'Retomar rotação automática' : 'Pausar rotação automática');
      toggle.firstElementChild.textContent = pausadoPeloUsuario ? '▶' : '❙❙';
      if (pausadoPeloUsuario) parar();
      else rodar();
    });
  }

  const stories = document.querySelector('.stories');
  if (stories) {
    stories.addEventListener('mouseenter', parar);
    stories.addEventListener('mouseleave', rodar);
    stories.addEventListener('focusin', parar);
    stories.addEventListener('focusout', (evento) => {
      if (!stories.contains(evento.relatedTarget)) rodar();
    });
  }
  trilho.addEventListener('touchstart', parar, { passive: true });
  document.addEventListener('visibilitychange', () => (document.hidden ? parar() : rodar()));

  // Arrastar com o dedo manda: o destaque segue o card que ficou centralizado.
  let agendado = false;
  trilho.addEventListener('scroll', () => {
    if (agendado || rolandoSozinho) return;
    agendado = true;
    requestAnimationFrame(() => {
      agendado = false;
      // Compara pela borda esquerda, não pelo centro do trilho: no desktop cabem
      // vários cards de uma vez e o centro cairia sobre o segundo, fazendo a
      // sequência começar no 2. Pela borda, o primeiro card é o primeiro.
      let melhor = 0, menor = Infinity;
      cards.forEach((card, i) => {
        const d = Math.abs(card.offsetLeft - trilho.scrollLeft);
        if (d < menor) { menor = d; melhor = i; }
      });
      destacar(melhor);
    });
  }, { passive: true });

  window.addEventListener('resize', () => destacar(atual));

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => (entrada.isIntersecting ? rodar() : parar()));
    }, { threshold: .3 }).observe(trilho);
  } else {
    rodar();
  }

  destacar(0);
}

function initFloatingCta() {
  const flutuante = document.querySelector('.floating-whatsapp');
  const hero = document.querySelector('.hero');
  if (!flutuante || !hero || !('IntersectionObserver' in window)) return;

  // Começa escondido só quando há como observar o hero. Se o IntersectionObserver
  // não existir, a função sai antes e o botão permanece visível.
  flutuante.classList.add('is-hidden');

  new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      // Some enquanto qualquer parte do hero estiver à vista: ali o CTA já existe.
      flutuante.classList.toggle('is-hidden', entrada.isIntersecting);
    });
  }, { threshold: 0 }).observe(hero);
}

function initContador() {
  const alvo = document.querySelector('[data-contar]');
  if (!alvo || !('IntersectionObserver' in window)) return;

  const total = Number(alvo.dataset.contar);
  if (!Number.isFinite(total)) return;

  // Sob prefers-reduced-motion o número aparece pronto: o valor é a informação,
  // a contagem é só ênfase.
  if (reducedMotion) { alvo.textContent = String(total); return; }

  const observador = new IntersectionObserver((entradas, self) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      self.unobserve(entrada.target);

      const duracao = 900;
      const inicio = performance.now();
      const passo = (agora) => {
        const t = Math.min(1, (agora - inicio) / duracao);
        // desacelera no fim, para o número "assentar" em vez de parar seco
        alvo.textContent = String(Math.round(total * (1 - Math.pow(1 - t, 3))));
        if (t < 1) requestAnimationFrame(passo);
      };
      alvo.textContent = '0';
      requestAnimationFrame(passo);
    });
  }, { threshold: .5 });

  observador.observe(alvo);
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
initStories();
initFloatingCta();
initContador();
initQuoteForm();
initFooterYear();
initReveal();
