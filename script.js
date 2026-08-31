(() => {

  const year = document.getElementById('year');

  if (year) {
    year.textContent = new Date().getFullYear();
  }


  const toggle =
    document.getElementById('navToggle');

  const menu =
    document.getElementById('navMenu');


  if (toggle && menu) {

    toggle.addEventListener('click', () => {

      const expanded =
        toggle.getAttribute('aria-expanded') === 'true';

      toggle.setAttribute(
        'aria-expanded',
        String(!expanded)
      );

      menu.classList.toggle(
        'is-open',
        !expanded
      );

    });


    menu.querySelectorAll('a').forEach(link => {

      link.addEventListener('click', () => {

        toggle.setAttribute(
          'aria-expanded',
          'false'
        );

        menu.classList.remove(
          'is-open'
        );

      });

    });

  }


  document
    .querySelectorAll('a[href^="#"]')
    .forEach(link => {

      link.addEventListener('click', event => {

        const id =
          link.getAttribute('href');

        if (!id || id === '#') return;

        const target =
          document.querySelector(id);

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

      });

    });


  const elements =
    document.querySelectorAll('[data-reveal]');


  if ('IntersectionObserver' in window) {

    const observer =
      new IntersectionObserver(entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.classList.add(
              'is-revealed'
            );

            observer.unobserve(
              entry.target
            );

          }

        });

      }, {
        threshold: .12
      });


    elements.forEach(element => {

      observer.observe(element);

    });

  }

  else {

    elements.forEach(element => {

      element.classList.add(
        'is-revealed'
      );

    });

  }

})();