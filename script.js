console.log("Script.js carregado e executando.");
(function() {
  "use strict"; // Início do "use strict"

  /**
   * Função para adicionar/remover a classe .scrolled ao body conforme a rolagem da página.
   * Isso permite que o CSS altere o estilo do header.
   */
  function toggleScrolled() {
    console.log("Função toggleScrolled chamada. ScrollY:", window.scrollY);
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');

    if (!selectHeader) return; // Se não houver header, não faz nada

    // Esta condição verifica se o header NÃO possui NENHUMA das classes de posicionamento fixo/sticky.
    // No seu caso, o header TEM 'fixed-top', então a condição `!selectHeader.classList.contains('fixed-top')`
    // será `false`. A condição geral do if (true && true && false) será `false`,
    // então o `return` NÃO será executado, e a lógica de scroll continuará, o que é o esperado.
    if (!selectHeader.classList.contains('scroll-up-sticky') &&
        !selectHeader.classList.contains('sticky-top') &&
        !selectHeader.classList.contains('fixed-top')) {
      // Se o header não for fixo/sticky de alguma forma, esta função não precisa rodar.
      // Contudo, se você SEMPRE quer a classe .scrolled no body baseado no scroll,
      // você pode remover este if. No seu caso, ele já funciona como esperado.
    }

    // Adiciona ou remove a classe 'scrolled' do body
    // A classe é adicionada ao BODY, e o CSS usa ".scrolled .header" para estilizar
    if (window.scrollY > 100) {
      selectBody.classList.add('scrolled');
    } else {
      selectBody.classList.remove('scrolled');
    }
  }

  // Adiciona os event listeners para a função toggleScrolled
  window.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);
  window.addEventListener('scroll', function() {
    console.log("--- EVENTO DE SCROLL NA WINDOW DETECTADO! --- ScrollY:", window.scrollY);
  });

  /**
   * Toggle para navegação mobile
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  if (mobileNavToggleBtn) {
    function mobileNavToggle() {
      document.querySelector('body').classList.toggle('mobile-nav-active');
      mobileNavToggleBtn.classList.toggle('bi-list'); // Ícone de lista (menu fechado)
      mobileNavToggleBtn.classList.toggle('bi-x');   // Ícone 'X' (menu aberto)
    }
    mobileNavToggleBtn.addEventListener('click', mobileNavToggle);
  }


  /**
   * Esconde o menu mobile ao clicar em um link da navegação (para links na mesma página/hash)
   */
  document.querySelectorAll('#navmenu a').forEach(navmenuLink => {
    navmenuLink.addEventListener('click', (event) => {
      // Verifica se o link é um link interno (hash) e se o menu mobile está ativo
      if (navmenuLink.hash && document.querySelector(navmenuLink.hash) && document.body.classList.contains('mobile-nav-active')) {
        // Fecha o menu mobile se estiver ativo
        if (document.body.classList.contains('mobile-nav-active')) {
            document.querySelector('body').classList.remove('mobile-nav-active');
            if (mobileNavToggleBtn) { // Garante que o botão exista
                mobileNavToggleBtn.classList.add('bi-list');
                mobileNavToggleBtn.classList.remove('bi-x');
            }
        }
      }
    });
  });

  /**
   * Toggle para dropdowns no menu mobile
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(toggleBtn => {
    toggleBtn.addEventListener('click', function(e) {
      e.preventDefault(); // Previne a navegação padrão do link pai, se for um <a>
      // Alterna a classe 'active' no elemento <li> pai do ícone de dropdown
      this.parentElement.classList.toggle('active');
      // Alterna a classe 'dropdown-active' no submenu <ul> que é o próximo irmão do <li> pai
      // Ou, se o <ul> for filho direto do <a> que tem .toggle-dropdown:
      // this.nextElementSibling.classList.toggle('dropdown-active');
      // No seu HTML, o <ul> do dropdown é irmão do <a> que contém o ícone, dentro de um <li>.
      // Ex: <li class="dropdown"><a href="#"><span>Dropdown</span> <i class="bi bi-chevron-down toggle-dropdown"></i></a>
      //        <ul>...</ul>
      //      </li>
      // Então, precisamos ir para o pai (<a>), depois para o pai dele (<li>), e então encontrar o <ul>.
      // Ou, mais simples, se o <li> é o 'dropdown' e o <ul> é o próximo elemento irmão do <a> que contém o ícone.
      // No seu HTML, o <li> que é ".dropdown" tem um filho <a> e um filho <ul>.
      // O ícone ".toggle-dropdown" está dentro do <a>.
      // Então `this` é o ícone <i>.
      // `this.closest('.dropdown')` pega o <li> com a classe 'dropdown'.
      // E `this.closest('.dropdown').querySelector('ul')` pega o submenu.
      const dropdownLi = this.closest('.dropdown');
      if (dropdownLi) {
        dropdownLi.classList.toggle('dropdown-active'); // Adiciona ao <li> para estilização geral
        const submenu = dropdownLi.querySelector('ul');
        if (submenu) {
          submenu.classList.toggle('dropdown-active'); // Mostra/esconde o submenu
        }
      }
      e.stopImmediatePropagation(); // Evita que múltiplos listeners no mesmo elemento sejam disparados
    });
  });


  /**
   * Botão "Voltar ao Topo" (Scroll Top)
   * Requer um elemento no HTML com a classe .scroll-top, por exemplo:
   * <a href="#" class="scroll-top d-flex align-items-center justify-content-center"><i class="bi bi-arrow-up-short"></i></a>
   */
  const scrollTopBtn = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTopBtn) {
      if (window.scrollY > 100) {
        scrollTopBtn.classList.add('active');
      } else {
        scrollTopBtn.classList.remove('active');
      }
    }
  }

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);


  /**
   * Ajusta a posição do scroll ao carregar a página para URLs com hash links.
   * Útil para que a navbar fixa não cubra o título da seção.
   */
  window.addEventListener('load', function() {
    if (window.location.hash) {
      const section = document.querySelector(window.location.hash);
      if (section) {
        setTimeout(() => {
          const header = document.querySelector('#header');
          const headerHeight = header ? header.offsetHeight : 0;
          const sectionScrollMarginTop = parseInt(window.getComputedStyle(section).scrollMarginTop, 10) || 0;

          window.scrollTo({
            top: section.offsetTop - headerHeight - sectionScrollMarginTop,
            behavior: 'smooth'
          });
        }, 100); // Pequeno delay para garantir que tudo foi renderizado
      }
    }
  });

  /**
   * Navmenu Scrollspy: Atualiza o link ativo na navbar conforme a seção visível.
   */
  const navmenuLinks = document.querySelectorAll('.navmenu a[href^="#"]'); // Seleciona apenas links internos

  function navmenuScrollspy() {
    const header = document.querySelector('#header');
    const headerHeight = header ? header.offsetHeight : 0;
    // O offset de 200px original pode ser muito. Usar a altura do header + um pequeno buffer.
    let position = window.scrollY + headerHeight + 50;

    navmenuLinks.forEach(navmenuLink => {
      if (!navmenuLink.hash) return;
      const section = document.querySelector(navmenuLink.hash);
      if (!section) return;

      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        // Remove 'active' de todos os links
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        // Adiciona 'active' ao link atual
        navmenuLink.classList.add('active');
      } else {
        navmenuLink.classList.remove('active');
      }
    });
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);


  /**
   * Preloader (Exemplo)
   * Requer um elemento no HTML com id="preloader", por exemplo:
   * <div id="preloader"></div>
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /*
   * As seguintes funcionalidades foram removidas por dependerem de bibliotecas externas
   * ou estruturas HTML mais específicas que não foram o foco do pedido "apenas o necessário":
   * - Animation on scroll (AOS.init)
   * - GLightbox
   * - Isotope layout and filters
   * - Frequently Asked Questions Toggle
   * - Init swiper sliders
   *
   * Se você precisar delas, pode readicioná-las do seu script original,
   * garantindo que as respectivas bibliotecas estejam incluídas no seu HTML.
   */

})(); // Fim do "use strict"
