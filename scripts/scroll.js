(function () {
  'use strict';

  document.documentElement.style.scrollBehavior = 'smooth';

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute('href').slice(1);
    if (!id) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    var target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  var backTop = document.querySelector('.back-top');
  if (backTop) {
    backTop.style.display = 'none';
    backTop.style.position = 'fixed';
    backTop.style.bottom = '2rem';
    backTop.style.right = '2rem';
    backTop.style.zIndex = '9999';
    backTop.style.cursor = 'pointer';
    backTop.style.opacity = '0';
    backTop.style.transition = 'opacity 0.3s ease';

    window.addEventListener('scroll', function () {
      if (window.scrollY > 300) {
        backTop.style.display = '';
        requestAnimationFrame(function () {
          backTop.style.opacity = '1';
        });
      } else {
        backTop.style.opacity = '0';
        setTimeout(function () {
          if (window.scrollY <= 300) {
            backTop.style.display = 'none';
          }
        }, 300);
      }
    });

    backTop.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  var revealElements = document.querySelectorAll('.scroll-reveal');
  if (revealElements.length > 0) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-reveal--visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    revealElements.forEach(function (el) {
      el.classList.add('scroll-reveal--hidden');
      observer.observe(el);
    });

    var style = document.createElement('style');
    style.textContent =
      '.scroll-reveal--hidden{opacity:0;transform:translateY(30px);transition:opacity 0.6s ease,transform 0.6s ease}' +
      '.scroll-reveal--visible{opacity:1;transform:translateY(0)}';
    document.head.appendChild(style);
  }
})();
