
        // ===== TICKER DATA =====
        const promotions = [
            {
                id: "christmas2025",
                isActive: true,
                startDate: "2025-12-21",
                endDate: "2025-12-31",
                name: "Christmas Special 2025",
                messages: [
                    { 
                        type: "promo",
                        icon: "🎄", 
                        text: "CHRISTMAS SPECIAL:", 
                        highlight: "10% OFF Solar Installation", 
                        code: "SOLAR2025", 
                        note: "Valid until Dec 31"
                    },
                    { 
                       
                        type: "promo",
                        icon: "📞", 
                        text: "Expert Advice:", 
                        highlight: "Free 15-Min Solar Strategy Call", 
                        code: "READY4_SOLAR", 
                        note: "Book your slot"
                        
                    },
                    { 
                        type: "promo",
                        icon: "🚀", 
                        text: "Try It Now:", 
                        highlight: "Send us feedback & Get +10% OFF your next service", 
                        code: "GET_MY_SOLAR_DESIGN", 
                        note: "Rosanatech Release"
                    }
                ]
            }
        ];

        const constantMessages = [
            { 

                type: "constant",
                icon: "⚡", 
                text: "SERVICES:", 
                highlight: "24/7 Emergency Electrical Maintainance & Support", 
                badge: "24/7", 
                note: "Call now!"
            },
            { 
                type: "constant",
                icon: "☀️", 
                text: "SOLAR INSTALLATION:", 
                highlight: "Residential & Commercial", 
                badge: "NEW", 
                note: "Free consultation"
            },
            {
               type: "constant",
               icon: "✨", 
               text: "Early Access:", 
               highlight: "Claim 10% OFF by sharing your experience", 
               badge: "CREATE_SOLAR_DESIGN", 
               note: "Rosanatech Release"
             },
            { 
                type: "constant",
                icon: "💰", 
                text: "SAVE ENERGY:", 
                highlight: "Up to 60% on Electricity Bills", 
                badge: "SAVINGS", 
                note: "With solar"
            },
            { 
                type: "constant",
                icon: "📞", 
                text: "CALL US:", 
                highlight: "+254 705 059 964", 
                badge: "HOTLINE", 
                note: "Free consultation"
            }
        ];

        // ===== DOM ELEMENTS =====
        const topBar = document.getElementById('topBar');
        const tickerContainer = document.getElementById('tickerContainer');
        const tickerStatus = document.getElementById('tickerStatus');
        const menuToggle = document.getElementById('menuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileOverlay = document.getElementById('mobileOverlay');
        const mobileClose = document.getElementById('mobileClose');
        const mobileLogoBtn = document.getElementById('mobileLogoBtn');
        const mainHeader = document.querySelector('.main-header');

        // ===== TICKER VARIABLES =====
        let isTickerPaused = false;
        let tickerResumeTimeout = null;
        const TICKER_SPEED = 100;
        const CLICK_PAUSE_DURATION = 5000;

        // ===== TICKER FUNCTIONS =====
        function getActivePromotion() {
            const today = new Date().toISOString().split('T')[0];
            
            for (const promo of promotions) {
                if (promo.isActive && today >= promo.startDate && today <= promo.endDate) {
                    return promo;
                }
            }
            
            return null;
        }

        function createTickerItem(message) {
            const item = document.createElement('div');
            item.className = 'ticker-item';
            
            if (message.type === 'promo') {
                item.innerHTML = `
                    <span class="promo-icon">${message.icon}</span>
                    <span class="promo-text">${message.text} <span class="promo-highlight">${message.highlight}</span></span>
                    ${message.code ? `<span class="promo-code">${message.code}</span>` : ''}
                    ${message.note ? `<span class="promo-text">${message.note}</span>` : ''}
                `;
            } else {
                item.innerHTML = `
                    <span class="constant-icon">${message.icon}</span>
                    <span class="promo-text">${message.text} <span class="constant-highlight">${message.highlight}</span></span>
                    ${message.badge ? `<span class="news-badge">${message.badge}</span>` : ''}
                    ${message.note ? `<span class="promo-text">${message.note}</span>` : ''}
                `;
            }
            
            return item;
        }

        function buildTickerContent(messages, isPromotion = false) {
            // Clear existing content
            tickerContainer.innerHTML = '';
            
            // Build 5 copies for continuous scroll
            for (let copy = 0; copy < 5; copy++) {
                messages.forEach((msg, index) => {
                    const item = createTickerItem(msg);
                    tickerContainer.appendChild(item);
                    
                    // Add separator between messages
                    if (index < messages.length - 1) {
                        const separator = document.createElement('span');
                        separator.style.color = '#666';
                        separator.style.margin = '0 10px';
                        separator.textContent = '•';
                        tickerContainer.appendChild(separator);
                    }
                });
                
                // Add separator between copies
                if (copy < 4) {
                    const copySeparator = document.createElement('span');
                    copySeparator.style.color = '#444';
                    copySeparator.style.margin = '0 15px';
                    copySeparator.textContent = '|';
                    tickerContainer.appendChild(copySeparator);
                }
            }
            
            // Update status display
            if (tickerStatus) {
                if (isPromotion) {
                    const activePromo = getActivePromotion();
                    const daysLeft = Math.ceil((new Date(activePromo.endDate) - new Date()) / (1000 * 60 * 60 * 24));
                    tickerStatus.innerHTML = `
                        <span style="color: #ffd700">🎯 ACTIVE PROMOTION: ${activePromo.name}</span><br>
                        <small>Running until ${activePromo.endDate} (${daysLeft} days left)</small>
                    `;
                } else {
                    tickerStatus.innerHTML = `
                        <span style="color: #4CAF50">📢 SHOWING COMPANY UPDATES</span><br>
                        <small>${constantMessages.length} messages rotating</small>
                    `;
                }
            }
            
            // Start scrolling animation
            tickerContainer.style.animation = `ticker-scroll ${TICKER_SPEED}s linear infinite`;
        }

        function pauseTicker() {
            if (!isTickerPaused) {
                isTickerPaused = true;
                tickerContainer.classList.add('paused');
                tickerContainer.style.animationPlayState = 'paused';
            }
        }

        function resumeTicker() {
            if (isTickerPaused) {
                isTickerPaused = false;
                tickerContainer.classList.remove('paused');
                tickerContainer.style.animationPlayState = 'running';
            }
        }

        function handleTickerClick() {
            if (tickerResumeTimeout) {
                clearTimeout(tickerResumeTimeout);
            }
            
            pauseTicker();
            
            tickerContainer.style.opacity = '0.8';
            setTimeout(() => {
                tickerContainer.style.opacity = '1';
            }, 300);
            
            tickerResumeTimeout = setTimeout(() => {
                resumeTicker();
            }, CLICK_PAUSE_DURATION);
        }

        function initializeTicker() {
            const activePromo = getActivePromotion();
            
            if (activePromo) {
                buildTickerContent(activePromo.messages, true);
                console.log(`🎯 PROMOTION ACTIVE: ${activePromo.name}`);
            } else {
                buildTickerContent(constantMessages, false);
                console.log("📢 SHOWING COMPANY UPDATES");
            }
            
            // Add pause on hover
            tickerContainer.addEventListener('mouseenter', () => {
                pauseTicker();
            });
            
            tickerContainer.addEventListener('mouseleave', () => {
                resumeTicker();
            });
            
            // Add click to pause functionality
            tickerContainer.addEventListener('click', handleTickerClick);
            
            // Check every minute for date changes
            setInterval(() => {
                const currentPromo = getActivePromotion();
                const isCurrentlyPromo = tickerContainer.innerHTML.includes('promo-code');
                
                if (currentPromo && !isCurrentlyPromo) {
                    buildTickerContent(currentPromo.messages, true);
                } else if (!currentPromo && isCurrentlyPromo) {
                    buildTickerContent(constantMessages, false);
                }
            }, 60000);
        }

        // ===== SCROLL EFFECTS =====
        function handleScroll() {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 50) {
                document.body.classList.add('scrolled');
            } else {
                document.body.classList.remove('scrolled');
            }
        }

        // ===== MOBILE MENU =====
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.add('active');
            mobileOverlay.classList.add('active');
            document.body.classList.add('menu-no-scroll');
            
            topBar.style.transform = 'translateY(-100%)';
            topBar.style.opacity = '0';
            
            pauseTicker();
        });

        function closeMobileMenu() {
            mobileMenu.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            topBar.style.transform = 'translateY(0)';
            topBar.style.opacity = '1';
            
            resumeTicker();
        }

        mobileClose.addEventListener('click', closeMobileMenu);
        mobileOverlay.addEventListener('click', closeMobileMenu);

        // Mobile logo button click (scrolls to top)
        mobileLogoBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // ===== RESPONSIVE BEHAVIOR =====
        function handleResize() {
            const emailSection = document.querySelector('.top-bar-left');
            const socialSection = document.querySelector('.top-bar-right');
            
            if (window.innerWidth <= 768) {
                if (emailSection) emailSection.style.display = 'none';
                if (socialSection) socialSection.style.display = 'none';
                
                const promoTicker = document.querySelector('.promo-ticker');
                if (promoTicker) {
                    promoTicker.style.width = '100%';
                    promoTicker.style.margin = '0';
                    promoTicker.style.padding = '0 10px';
                }
            } else {
                if (emailSection) emailSection.style.display = 'flex';
                if (socialSection) socialSection.style.display = 'flex';
                
                const promoTicker = document.querySelector('.promo-ticker');
                if (promoTicker) {
                    promoTicker.style.width = 'auto';
                    promoTicker.style.margin = '0 20px';
                    promoTicker.style.padding = '0';
                }
                
                closeMobileMenu();
            }
        }

        // ===== INITIALIZE EVERYTHING =====
        document.addEventListener('DOMContentLoaded', function() {
            initializeTicker();
            
            // Set active nav link
            const currentPage = window.location.pathname.split('/').pop();
            const navLinks = document.querySelectorAll('.nav-links a, .mobile-links a');
            navLinks.forEach(link => {
                const linkPage = link.getAttribute('href');
                if (linkPage === currentPage || 
                    (currentPage === '' && linkPage === 'index.html')) {
                    link.parentElement.classList.add('active');
                } else {
                    link.parentElement.classList.remove('active');
                }
            });
            
            // Add click handlers for nav links
            document.querySelectorAll('.nav-links a, .mobile-links a').forEach(link => {
                link.addEventListener('click', function() {
                    document.querySelectorAll('.nav-links li, .mobile-links li').forEach(item => {
                        item.classList.remove('active');
                    });
                    this.parentElement.classList.add('active');
                    
                    closeMobileMenu();
                });
            });
            
            // Setup event listeners
            window.addEventListener('scroll', handleScroll);
            window.addEventListener('resize', handleResize);
            
            // Log status
            const activePromo = getActivePromotion();
            if (activePromo) {
                console.log(`✅ Promotion "${activePromo.name}" is running`);
            } else {
                console.log("ℹ️ No active promotion - showing company updates");
            }
            
            console.log("Scroll behavior: Desktop - hides only top bar. Mobile - hides top bar AND main header.");
        });

        // Initial responsive check
        handleResize();
    



        //footer script
    
        // JavaScript for animations and interactions
        document.addEventListener('DOMContentLoaded', function() {
            // Back to top button
            const backToTopButton = document.getElementById('rtechBackToTop');
            
            // Show/hide back to top button on scroll
            window.addEventListener('scroll', function() {
                if (window.pageYOffset > 300) {
                    backToTopButton.classList.add('visible');
                } else {
                    backToTopButton.classList.remove('visible');
                }
            });
            
            // Scroll to top when button is clicked
            backToTopButton.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            
            // Animate footer columns on scroll
            const footerColumns = document.querySelectorAll('.rtech-footer-column');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            footerColumns.forEach(column => {
                observer.observe(column);
            });
            
            // Newsletter form submission
            const newsletterInput = document.querySelector('.rtech-newsletter-input');
            const newsletterButton = document.querySelector('.rtech-newsletter-button');
            
            newsletterButton.addEventListener('click', function(e) {
                e.preventDefault();
                if (newsletterInput.value && newsletterInput.value.includes('@')) {
                    newsletterButton.textContent = 'Subscribed!';
                    newsletterButton.style.background = '#144702';
                    newsletterInput.value = '';
                    
                    setTimeout(() => {
                        newsletterButton.textContent = 'Subscribe';
                        newsletterButton.style.background = '';
                    }, 3000);
                } else {
                    newsletterInput.style.borderColor = '#dc3545';
                    newsletterInput.placeholder = 'Please enter a valid email';
                    setTimeout(() => {
                        newsletterInput.style.borderColor = '';
                        newsletterInput.placeholder = 'Your email address';
                    }, 3000);
                }
            });
        });
    

        // ===== END OF SCRIPT =====
       

    /// code to fix mobile navigation scroolling
    // PASTE THIS AT THE VERY END OF YOUR SCRIPT (after everything else)

// SIMPLE FIX FOR MOBILE SCROLLING
// SIMPLE FIX FOR MOBILE SCROLLING
window.addEventListener('load', function() {
    // Always reset scrolling when page loads
    document.body.style.overflow = 'auto';
    // REMOVE the position: 'static' line completely
});

// Also reset when clicking any link
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' || e.target.closest('a')) {
        // Small delay to ensure navigation happens
        setTimeout(function() {
            document.body.style.overflow = 'auto';
        }, 50);
    }
});

