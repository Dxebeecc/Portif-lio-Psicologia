// Aguarda o carregamento completo do DOM para garantir que todos os elementos existam
document.addEventListener('DOMContentLoaded', function() {

    // Script do Menu Hamburguer e Navegação Suave (Lógica Unificada)
    const menuBtn = document.getElementById('menu-hamburguer');
    const menuNav = document.getElementById('menu-principal');
    const mainHeader = document.getElementById('mainHeader');

    if (menuBtn && menuNav) {
        // Lógica para abrir/fechar o menu com o botão
        menuBtn.addEventListener('click', () => {
            menuNav.classList.toggle('menu-aberto');
            const icon = menuBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-times', menuNav.classList.contains('menu-aberto'));
                icon.classList.toggle('fa-bars', !menuNav.classList.contains('menu-aberto'));
            }
        });
    }

    // Lógica para todos os links de âncora (incluindo os do menu)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            // Fecha o menu hamburguer se estiver aberto ao clicar em um link
            if (menuNav && menuNav.classList.contains('menu-aberto')) {
                menuNav.classList.remove('menu-aberto');
                const icon = menuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
            
            // Lógica da rolagem suave
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                let headerOffset = mainHeader ? mainHeader.offsetHeight : 0;
                window.scrollTo({
                    top: targetElement.offsetTop - headerOffset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Script do Header com Fundo no Scroll
    if (mainHeader) {
        window.addEventListener('scroll', () => {
            mainHeader.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // Script do Ano no Rodapé
    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }
    
    // Script de Navegação Ativa (marcar link da seção visível)
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('nav.menu-navegacao ul li a');
    if (sections.length > 0 && navLinks.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href').substring(1) === entry.target.id) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, { rootMargin: '-40% 0px -60% 0px' });
        sections.forEach(section => { if(section.id) observer.observe(section); });
    }

    // Script da Faixa de Demandas Interativa
    const faixaViewport = document.getElementById('faixaDemandasViewport');
    const faixaContainer = document.getElementById('faixaDemandasContainer');
    if (faixaViewport && faixaContainer) {
        let isDragging = false, startX, currentTranslateX = 0, rafId = null, interactionTimeoutId = null;
        const autoScrollSpeed = 0.5;
        const resumeDelay = 400; 
        
        const applyTransform = () => { if(faixaContainer) faixaContainer.style.transform = `translateX(${currentTranslateX}px)`; };
        const stopAutoScroll = () => { if(rafId) cancelAnimationFrame(rafId); };
        const scrollStep = () => {
            if (isDragging) return;
            currentTranslateX -= autoScrollSpeed;
            const singleContentWidth = faixaContainer.scrollWidth / 2;
            if (Math.abs(currentTranslateX) >= singleContentWidth) {
                currentTranslateX += singleContentWidth;
            }
            applyTransform();
            rafId = requestAnimationFrame(scrollStep);
        };
        const startAutoScroll = () => {
            stopAutoScroll();
            rafId = requestAnimationFrame(scrollStep);
        };
        
        const onDragStart = (clientX) => {
            isDragging = true;
            stopAutoScroll();
            clearTimeout(interactionTimeoutId);
            startX = clientX - currentTranslateX;
            if(faixaContainer) faixaContainer.style.transition = 'none';
            if(faixaViewport) faixaViewport.style.cursor = 'grabbing';
        };
        const onDragMove = (clientX) => {
            if (!isDragging) return;
            currentTranslateX = clientX - startX;
            applyTransform();
        };
        
        const onDragEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            if(faixaViewport) faixaViewport.style.cursor = 'grab';
            interactionTimeoutId = setTimeout(startAutoScroll, resumeDelay);
        };

        faixaViewport.addEventListener('mousedown', (e) => onDragStart(e.pageX));
        document.addEventListener('mousemove', (e) => onDragMove(e.pageX));
        document.addEventListener('mouseup', onDragEnd);
        document.addEventListener('mouseleave', onDragEnd);

        faixaViewport.addEventListener('touchstart', (e) => onDragStart(e.touches[0].pageX), { passive: true });
        faixaViewport.addEventListener('touchmove', (e) => onDragMove(e.touches[0].pageX), { passive: true });
        faixaViewport.addEventListener('touchend', onDragEnd);
        faixaViewport.addEventListener('touchcancel', onDragEnd);
        
        startAutoScroll();
    }

    // NOVO SCRIPT PARA O FAQ (ACCORDION)
    const faqQuestions = document.querySelectorAll('.faq-question');
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            // Adiciona o ícone de menos, mas o esconde inicialmente
            const minusIcon = document.createElement('i');
            minusIcon.className = 'fas fa-minus';
            question.appendChild(minusIcon);

            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const isActive = question.classList.contains('active');

                // Opcional: Fechar outras perguntas abertas ao abrir uma nova
                // faqQuestions.forEach(q => {
                //     q.classList.remove('active');
                //     q.nextElementSibling.style.maxHeight = null;
                // });

                if (!isActive) {
                    question.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 40 + "px"; // +40 para o padding
                    answer.classList.add('open');
                } else {
                    question.classList.remove('active');
                    answer.style.maxHeight = null;
                    answer.classList.remove('open');
                }
            });
        });
    }

});