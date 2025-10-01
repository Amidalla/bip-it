export class Tabs {
    constructor(container) {
        this.container = container;
        this.init();
    }

    init() {
        if (this.container.querySelector('.tab__item')) {
            this.initAccordion();
        } else {
            this.initDesktopTabs();
        }

        this.initSpecialButtons();
    }

    initDesktopTabs() {
        let headerSelector, btnSelector, contentSelector, paneSelector;

        if (this.container.classList.contains('personal-account__tabs')) {
            headerSelector = '.personal-account__tabs-header';
            btnSelector = '.personal-account__tab-btn';
            contentSelector = '.personal-account__tabs-content';
            paneSelector = '.personal-account__tab-pane';
        } else {
            headerSelector = '.tabs__header';
            btnSelector = '.tab__btn';
            contentSelector = '.tabs__content';
            paneSelector = '.tab__pane';
        }

        const buttons = this.container.querySelectorAll(`${headerSelector} ${btnSelector}`);
        const panes = this.container.querySelectorAll(`${contentSelector} ${paneSelector}`);

        console.log('Tabs found:', {
            container: this.container,
            buttons: buttons.length,
            panes: panes.length,
            headerSelector,
            btnSelector
        });

        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchToTab(btn.dataset.tab);
            });
        });

        const activeBtn = this.container.querySelector(`${headerSelector} ${btnSelector}.active`);
        if (activeBtn) {
            const tabId = activeBtn.dataset.tab;
            this.switchToTab(tabId);
        } else if (buttons.length > 0) {
            this.switchToTab(buttons[0].dataset.tab);
        }

        panes.forEach(pane => {
            if (!pane.classList.contains('active')) {
                pane.style.display = 'none';
            }
        });
    }

    initAccordion() {
        const tabItems = this.container.querySelectorAll('.tab__item');

        tabItems.forEach(item => {
            const btn = item.querySelector('.tab__btn');
            const pane = item.querySelector('.tab__pane');

            if (!btn || !pane) return;

            pane.style.display = 'none';

            btn.addEventListener('click', (e) => {
                e.preventDefault();

                const isActive = btn.classList.contains('active');

                if (isActive) {
                    btn.classList.remove('active');
                    pane.style.display = 'none';
                } else {
                    btn.classList.add('active');
                    pane.style.display = 'block';
                }
            });
        });
    }

    switchToTab(tabId) {
        let headerSelector, btnSelector, contentSelector, paneSelector;

        if (this.container.classList.contains('personal-account__tabs')) {
            headerSelector = '.personal-account__tabs-header';
            btnSelector = '.personal-account__tab-btn';
            contentSelector = '.personal-account__tabs-content';
            paneSelector = '.personal-account__tab-pane';
        } else {
            headerSelector = '.tabs__header';
            btnSelector = '.tab__btn';
            contentSelector = '.tabs__content';
            paneSelector = '.tab__pane';
        }

        const buttons = this.container.querySelectorAll(`${headerSelector} ${btnSelector}`);
        const panes = this.container.querySelectorAll(`${contentSelector} ${paneSelector}`);

        buttons.forEach(b => b.classList.remove('active'));
        panes.forEach(p => {
            p.classList.remove('active');
            p.style.display = 'none';
        });

        const targetBtn = this.container.querySelector(`${headerSelector} ${btnSelector}[data-tab="${tabId}"]`);
        const targetPane = this.container.querySelector(`#${tabId}`);

        if (targetBtn) {
            targetBtn.classList.add('active');
        }
        if (targetPane) {
            targetPane.classList.add('active');
            targetPane.style.display = 'block';
        }
    }

    initSpecialButtons() {
        const jumpButtons = this.container.querySelectorAll('.jump-button');

        jumpButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();

                if (this.container.classList.contains('tabs_mobile')) {

                    this.openSecuritySettingsAndScrollToGeneralInfo();
                } else {

                    this.switchToTab('security-settings');
                }
            });
        });
    }


    openSecuritySettingsAndScrollToGeneralInfo() {

        this.switchToAccordionTab('security-settings-mobile');


        setTimeout(() => {

            const generalInfo = this.container.querySelector('#security-settings-mobile .general-information');
            if (generalInfo) {

                generalInfo.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });


                const yOffset = -20;
                const y = generalInfo.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({
                    top: y,
                    behavior: 'smooth'
                });
            }
        }, 300);
    }


    switchToAccordionTab(tabId) {
        const tabItems = this.container.querySelectorAll('.tab__item');

        tabItems.forEach(item => {
            const btn = item.querySelector('.tab__btn');
            const pane = item.querySelector('.tab__pane');

            if (btn && pane) {
                if (btn.dataset.tab === tabId) {

                    btn.classList.add('active');
                    pane.style.display = 'block';
                }
            }
        });
    }
}

export function InitTabs() {
    const tabsContainers = document.querySelectorAll('.bestsellers__tabs, .product__tabs, .tabs-desktop, .placing-order__tabs, .personal-account__tabs, .tabs_mobile');

    console.log('Tabs containers found:', tabsContainers.length);

    tabsContainers.forEach(container => {
        console.log('Initializing tabs for:', container.className);
        if (container.offsetParent !== null) {
            new Tabs(container);
        }
    });

    initGlobalJumpButtons();
}

function initGlobalJumpButtons() {
    const jumpButtons = document.querySelectorAll('.jump-button');

    jumpButtons.forEach(button => {
        if (!button.hasAttribute('data-jump-handled')) {
            button.setAttribute('data-jump-handled', 'true');

            button.addEventListener('click', (e) => {
                e.preventDefault();

                switchAllTabsToSecuritySettings();
            });
        }
    });
}

function switchAllTabsToSecuritySettings() {

    const desktopTabs = document.querySelectorAll('.personal-account__tabs, .tabs-desktop');
    desktopTabs.forEach(container => {
        const headerSelector = '.personal-account__tabs-header';
        const btnSelector = '.personal-account__tab-btn';
        const contentSelector = '.personal-account__tabs-content';
        const paneSelector = '.personal-account__tab-pane';

        const buttons = container.querySelectorAll(`${headerSelector} ${btnSelector}`);
        const panes = container.querySelectorAll(`${contentSelector} ${paneSelector}`);

        buttons.forEach(b => b.classList.remove('active'));
        panes.forEach(p => {
            p.classList.remove('active');
            p.style.display = 'none';
        });

        const targetBtn = container.querySelector(`${headerSelector} ${btnSelector}[data-tab="security-settings"]`);
        const targetPane = container.querySelector('#security-settings');

        if (targetBtn) targetBtn.classList.add('active');
        if (targetPane) {
            targetPane.classList.add('active');
            targetPane.style.display = 'block';
        }
    });


    const mobileTabs = document.querySelectorAll('.tabs_mobile');
    mobileTabs.forEach(container => {
        const tabItems = container.querySelectorAll('.tab__item');

        tabItems.forEach(item => {
            const btn = item.querySelector('.tab__btn');
            const pane = item.querySelector('.tab__pane');

            if (btn && pane) {
                if (btn.dataset.tab === 'security-settings-mobile') {

                    btn.classList.add('active');
                    pane.style.display = 'block';


                    setTimeout(() => {
                        const generalInfo = pane.querySelector('.general-information');
                        if (generalInfo) {
                            generalInfo.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });


                            const yOffset = -20;
                            const y = generalInfo.getBoundingClientRect().top + window.pageYOffset + yOffset;
                            window.scrollTo({
                                top: y,
                                behavior: 'smooth'
                            });
                        }
                    }, 300);
                }
            }
        });
    });
}