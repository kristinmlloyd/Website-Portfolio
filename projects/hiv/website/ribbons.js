document.addEventListener('DOMContentLoaded', function() {
  // Set up a 8x8 grid (64) ribbons)
  const GRID_ROWS = 8;
  const GRID_COLS = 8;
  const RIBBON_COUNT = GRID_ROWS * GRID_COLS;
  
  // Create the container for the ribbons
  const ribbonField = document.getElementById('ribbon-field');
  
  // Stats overlay elements (for each scroll container)
  const yearDisplay = document.getElementById('current-year');
  const caseCounter = document.getElementById('case-counter');
  const deathCounter = document.getElementById('death-counter');
  
  // Get all scroll sections
  const sections = document.querySelectorAll('.scroll-section');
  
  // Create the ribbon grid using the ribbon image image
  function createRibbons() {
    ribbonField.innerHTML = '';
    
    // Create a grid container of the ribbons
    const gridContainer = document.createElement('div');
    gridContainer.classList.add('ribbon-grid');
    ribbonField.appendChild(gridContainer);
    
    // Calculate sizes for the grid 
    const containerWidth = gridContainer.clientWidth;
    const containerHeight = gridContainer.clientHeight;
    
    // Define spacing factors 
    const horizontalSpacingFactor = 1.5; 
    const verticalSpacingFactor = 0.8;   
    
    // Calculate cell dimensions with adjusted spacing
    const cellWidth = (containerWidth / GRID_COLS) * horizontalSpacingFactor;
    const cellHeight = (containerHeight / GRID_ROWS) * verticalSpacingFactor;
    
    // Calculate offsets to center the grid despite adjusted spacing (like basically center left)
    const horizontalOffset = (containerWidth - (cellWidth * (GRID_COLS))) / 2;
    const verticalOffset = (containerHeight - (cellHeight * (GRID_ROWS - 1))) / 2;
    
    // Create ribbons in a grid pattern by iteration
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        // Create container for ribbon
        const ribbonContainer = document.createElement('div');
        ribbonContainer.classList.add('ribbon');
        
        // Position the ribbon with adjusted spacing
        ribbonContainer.style.left = `${horizontalOffset + col * cellWidth}px`;
        ribbonContainer.style.top = `${verticalOffset + row * cellHeight}px`;
        
        // Center the ribbon in its position
        ribbonContainer.style.transform = `translate(-50%, -50%)`;
        
        // Append each ribbon
        const ribbonImg = document.createElement('img');
        ribbonImg.src = 'images/hiv_ribbon.png';
        ribbonImg.alt = 'AIDS awareness ribbon';
        ribbonImg.classList.add('ribbon-img');
        
        ribbonContainer.appendChild(ribbonImg);
        gridContainer.appendChild(ribbonContainer);
      }
    }
  }
  
  // Update the visualization based on the current year's data during each scroll
  function updateVisualization(year, cases, deaths) {
    // Update the stats display
    yearDisplay.textContent = year;
    caseCounter.textContent = `Cases: ${Number(cases).toLocaleString()}`;
    deathCounter.textContent = `Deaths: ${Number(deaths).toLocaleString()}`;
    
    // Calculate the percentage of ribbons to fade based on death rate
    const deathRate = cases ? deaths / 150000 : 0;
    const ribbonsToFade = Math.floor(RIBBON_COUNT * deathRate);
    
    // Get all ribbons
    const ribbons = document.querySelectorAll('.ribbon');
    
    // Update ribbon opacities
    ribbons.forEach((ribbon, index) => {
      if (index < ribbonsToFade) {
        ribbon.style.opacity = "0.1"; // Nearly invisible
        ribbon.classList.add('faded');
      } else {
        ribbon.style.opacity = "1";
        ribbon.classList.remove('faded');
      }
    });
  }
  
  // Set up intersection observer for scroll sections
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  };
  
  // Set up each scrolly-telling section to update itself
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const section = entry.target;
        
        // Special handling for intro and conclusion sections
        if (section.id === 'intro') {
          // For intro, show all ribbons
          document.querySelectorAll('.ribbon').forEach(ribbon => {
            ribbon.style.opacity = "1";
            ribbon.classList.remove('faded');
          });
          yearDisplay.textContent = '';
          caseCounter.textContent = '';
          deathCounter.textContent = '';
        } else if (section.id === 'conclusion') {
          // For conclusion, show all ribbons
          updateVisualization('Remember', '0', '0');
        } else {
          // Regular year section
          const year = section.dataset.year;
          const cases = section.dataset.cases;
          const deaths = section.dataset.deaths;
          
          updateVisualization(year, cases, deaths);
        }
        if (section.id === 'intro') {
          // Hide stats overlay
          document.querySelector('.stats-overlay').style.display = 'none';
        
          // Reset ribbons
          document.querySelectorAll('.ribbon').forEach(ribbon => {
            ribbon.style.opacity = "1";
            ribbon.classList.remove('faded');
          });
        
          yearDisplay.textContent = '';
          caseCounter.textContent = '';
          deathCounter.textContent = '';
        } else {
          // Show stats overlay
          document.querySelector('.stats-overlay').style.display = 'block';
        
          if (section.id === 'conclusion') {
            document.querySelector('.stats-overlay').style.display = 'none';
          } else {
            const year = section.dataset.year;
            const cases = section.dataset.cases;
            const deaths = section.dataset.deaths;
            updateVisualization(year, cases, deaths);
          }
        }        
      }
    });
  }, observerOptions);
  
  // Observe all sections
  sections.forEach(section => {
    observer.observe(section);
  });
  
  // Handle window resize (just in case mwah)
  window.addEventListener('resize', function() {
    // Recreate the ribbon field on window resize
    createRibbons();
  });
  
  // Initialize the ribbons
  createRibbons();
});
