const backdrop = document.querySelector('.backdrop');
const sideDrawer = document.querySelector('.mobile-nav');
const menuToggle = document.querySelector('#side-menu-toggle');

function backdropClickHandler() {
  backdrop.style.display = 'none';
  sideDrawer.classList.remove('open');
}

function menuToggleClickHandler() {
  backdrop.style.display = 'block';
  sideDrawer.classList.add('open');
}

backdrop.addEventListener('click', backdropClickHandler);
menuToggle.addEventListener('click', menuToggleClickHandler);

function openTab(tabName) {  
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.classList.remove('active');
  });

  tabContents.forEach(content => {
    content.classList.remove('active');
  });

  const activeTab = document.querySelector(`.btn[data-tab="${tabName}"]`);
  const activeTabContent = document.querySelector(`.tab-content[data-tab="${tabName}"]`);

  if (activeTab && activeTabContent) {
    activeTab.classList.add('active');
    activeTabContent.classList.add('active');
  } else {
    console.error(`Tab or content not found: ${tabName}`);
  }
}
