// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize map with dark basemap
    const map = L.map('map', {
        zoomControl: true
    }).setView([44.5, -94.5], 7); // Center on Minnesota
    
    // Add dark basemap by default
    let currentTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '©OpenStreetMap, ©CartoDB',
        maxZoom: 18
    }).addTo(map);
    
    // Force refresh of map controls
    setTimeout(() => {
        map.invalidateSize();
    }, 100);
    
    // Initialize variables
    let markers = [];
    let polylines = [];
    let currentVacation = 'all';
    let isDiscoveriesOpen = false;
    
    // Vacation colors
    const vacationColors = {
        'japan': '#2ecc71',
        'bahamas': '#9b59b6',
        'mexico': '#f1c40f',
        'eastcoast': '#e74c3c',
        'state-parks': '#34495e',
        'national-parks': '#e67e22',
        'default': '#45b7d1'
    };
    
    // Individual point colors
    const pointColors = {
        'departure': '#ff6b6b',
        'layover': '#4ecdc4',
        'destination': '#ffd93d',
        'visit': '#6b5b95',
        'port': '#45b7d1',
        'cruise': '#96ceb4',
        'resort': '#feca57',
        'drive': '#ff9ff3',
        'park': '#27ae60'
    };
    
    // Vacation data
    const vacations = {
        'japan': {
            id: 'japan',
            name: 'Japan 2016',
            icon: 'fas fa-torii-gate',
            stops: [
                { name: 'Winona, MN', latlng: [44.05, -91.666], type: 'departure', description: 'Starting point of my journey to Japan' },
                { name: 'Chicago O\'Hare Airport', latlng: [41.978611, -87.904722], type: 'layover', description: 'Layover before the long flight to Tokyo' },
                { name: 'Tokyo, Japan', latlng: [35.6762, 139.6503], type: 'destination', description: 'Arrived in Tokyo! First time in Japan.' },
                { name: 'Misato, Miyagi Prefecture', latlng: [38.5419, 140.9125], type: 'visit', description: 'Visited family friends in Misato, Miyagi Prefecture' }
            ]
        },
        'bahamas': {
            id: 'bahamas',
            name: 'Bahamas Cruise 2023',
            icon: 'fas fa-ship',
            stops: [
                { name: 'Winona, MN', latlng: [44.05, -91.666], type: 'departure', description: 'Started the trip from home' },
                { name: 'Minneapolis, MN (MSP)', latlng: [44.8819, -93.2218], type: 'layover', description: 'Flight from MSP to Fort Lauderdale' },
                { name: 'Fort Lauderdale, FL', latlng: [26.1224, -80.1373], type: 'port', description: 'Arrived in Fort Lauderdale, drove to cruise port' },
                { name: 'Cruise Port - Fort Lauderdale', latlng: [26.0909, -80.1235], type: 'cruise', description: 'Boarded Liberty of the Seas - Dec 11, 2023' },
                { name: 'Perfect Day at CocoCay, Bahamas', latlng: [25.7890, -77.9205], type: 'destination', description: 'Royal Caribbean\'s private island - Dec 13, 2023' },
                { name: 'Nassau, Bahamas', latlng: [25.0443, -77.3504], type: 'visit', description: 'Capital city of the Bahamas - Dec 14, 2023' },
                { name: 'Fort Lauderdale, FL (Return)', latlng: [26.1224, -80.1373], type: 'port', description: 'Returned to Fort Lauderdale - Dec 15, 2023' }
            ]
        },
        'mexico': {
            id: 'mexico',
            name: 'Mexico 2025',
            icon: 'fas fa-umbrella-beach',
            stops: [
                { name: 'Minneapolis, MN (MSP)', latlng: [44.8819, -93.2218], type: 'departure', description: 'Started trip from Minneapolis International Airport' },
                { name: 'Cancun International Airport', latlng: [21.0367, -86.8740], type: 'destination', description: 'Arrived in beautiful Cancun, Mexico' },
                { name: 'Moon Palace Resort', latlng: [21.0958, -86.7625], type: 'resort', description: 'Stayed at the amazing Moon Palace all-inclusive resort' }
            ]
        },
        'eastcoast': {
            id: 'eastcoast',
            name: 'East Coast Road Trip 2015',
            icon: 'fas fa-car',
            stops: [
                { name: 'Winona, MN', latlng: [44.05, -91.666], type: 'departure', description: 'Started the road trip from Minnesota' },
                { name: 'Pasadena, Maryland', latlng: [39.1482, -76.5714], type: 'drive', description: 'First stop on our East Coast road trip' },
                { name: 'Washington DC', latlng: [38.9072, -77.0369], type: 'visit', description: 'Day trip to Washington DC to see the monuments and museums' },
                { name: 'Pasadena, Maryland (Return)', latlng: [39.1482, -76.5714], type: 'drive', description: 'Returned to Pasadena after visiting DC' },
                { name: 'New York City, NY', latlng: [40.7128, -74.0060], type: 'destination', description: 'Visited the Big Apple - saw Times Square, Central Park, and more!' }
            ]
        },
        'state-parks': {
            id: 'state-parks',
            name: 'Minnesota State Parks',
            icon: 'fas fa-tree',
            stops: [
                { name: 'Whitewater State Park', latlng: [44.0414, -92.0372], type: 'park', description: 'Beautiful state park near St. Charles, MN' },
                { name: 'Perrot State Park', latlng: [44.0239, -91.4975], type: 'park', description: 'Scenic state park at the confluence of the Trempealeau and Mississippi Rivers' },
                { name: 'Gooseberry Falls State Park', latlng: [47.1467, -91.4664], type: 'park', description: 'Stunning waterfalls on the North Shore of Lake Superior' },
                { name: 'Split Rock Lighthouse', latlng: [47.2000, -91.3667], type: 'park', description: 'Iconic lighthouse on the North Shore of Lake Superior' },
                { name: 'Tettegouche State Park', latlng: [47.3550, -91.2314], type: 'park', description: 'Beautiful park with waterfalls, lakes, and dramatic Lake Superior shoreline' },
                { name: 'Trempealeau National Wildlife Refuge', latlng: [44.0067, -91.5039], type: 'park', description: 'Wildlife refuge with excellent bird watching and hiking trails' }
            ]
        },
        'national-parks': {
            id: 'national-parks',
            name: 'National Parks',
            icon: 'fas fa-mountain',
            stops: []
        }
    };
    
    // DOM Elements
    const navbar = document.getElementById('navbar');
    const mainContent = document.getElementById('main-content');
    const navbarToggle = document.getElementById('navbar-toggle'); 
    const replacementToggle = document.getElementById('replacement-toggle');
    
    const vacationsToggle = document.getElementById('vacations-toggle');
    const discoveriesPanel = document.getElementById('discoveries-panel');
    const discoveriesCloseBtn = document.getElementById('discoveries-toggle-close');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const toggleIcon = document.getElementById('toggle-icon');
    const body = document.body;
    
    // Ensure vacations toggle is visible initially
    vacationsToggle.style.display = 'flex';
    
    // Show all vacations by default
    showAllVacations();
    
    // === NAVBAR EVENT LISTENERS ===
    function handleNavbarToggle() {
        navbar.classList.toggle('hidden');
        mainContent.classList.toggle('navbar-hidden');
        replacementToggle.classList.toggle('visible');
        
        setTimeout(() => {
            map.invalidateSize();
        }, 300);
    }

    navbarToggle.addEventListener('click', handleNavbarToggle);
    replacementToggle.addEventListener('click', handleNavbarToggle);
    
    // Vacation Panel Listeners
    vacationsToggle.addEventListener('click', toggleDiscoveries);
    discoveriesCloseBtn.addEventListener('click', closeDiscoveriesPanel);
    
    // Dark Mode Toggle
    if (localStorage.getItem("dark-mode") === "enabled") {
        enableDarkMode();
    }
    
    darkModeToggle.addEventListener('click', function() {
        if (body.classList.contains('dark-mode')) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });
    
    // Add click handlers to HTML vacation items
    document.querySelectorAll('.vacation-item[data-locations]').forEach(item => {
        item.addEventListener('click', function() {
            const year = this.dataset.year;
            const locations = this.dataset.locations;
            
            // Update active state
            document.querySelectorAll('.vacation-item').forEach(i => {
                i.classList.remove('active');
            });
            this.classList.add('active');
            
            // Routing Logic
            if (year === 'all' || !locations) {
                setActiveVacation('all');
                showAllVacations();
            } else if (locations === 'state-parks') {
                setActiveVacation('state-parks');
                showVacation('state-parks');
            } else if (locations === 'national-parks') {
                setActiveVacation('national-parks');
                showVacation('national-parks');
            } else if (locations) {
                setActiveVacation(locations);
                showVacation(locations);
            }
            
            // Close discoveries panel on mobile after selection
            if (window.innerWidth <= 768) {
                closeDiscoveriesPanel();
            }
        });
    });
    
    // Handle "All Vacations" click specifically
    document.querySelector('.vacation-item[data-year="all"]').addEventListener('click', function() {
         document.querySelectorAll('.vacation-item').forEach(i => i.classList.remove('active'));
         this.classList.add('active');
         setActiveVacation('all');
         showAllVacations();
         if (window.innerWidth <= 768) closeDiscoveriesPanel();
    });

    // Helper Functions
    
    function toggleDiscoveries() {
        if (isDiscoveriesOpen) {
            closeDiscoveriesPanel();
        } else {
            openDiscoveries();
        }
    }
    
    function openDiscoveries() {
        discoveriesPanel.classList.add('open');
        body.classList.add('discoveries-open');
        isDiscoveriesOpen = true;
        vacationsToggle.style.display = 'none';
        updateDarkModePosition();
        invalidateMap();
    }
    
    function closeDiscoveriesPanel() {
        discoveriesPanel.classList.remove('open');
        body.classList.remove('discoveries-open');
        isDiscoveriesOpen = false;
        vacationsToggle.style.display = 'flex';
        updateDarkModePosition();
        invalidateMap();
    }
    
    function updateDarkModePosition() {
        if (isDiscoveriesOpen) {
            darkModeToggle.style.right = '370px';
        } else {
            darkModeToggle.style.right = '20px';
        }
    }
    
    function enableDarkMode() {
        body.classList.add("dark-mode");
        toggleIcon.classList.remove("fa-moon");
        toggleIcon.classList.add("fa-sun");
        localStorage.setItem("dark-mode", "enabled");
        switchBasemap('dark');
        invalidateMap();
    }
    
    function disableDarkMode() {
        body.classList.remove('dark-mode');
        toggleIcon.classList.remove('fa-sun');
        toggleIcon.classList.add('fa-moon');
        localStorage.setItem("dark-mode", "disabled");
        switchBasemap('light');
        invalidateMap();
    }
    
    function invalidateMap() {
        setTimeout(() => {
            map.invalidateSize();
        }, 300);
    }
    
    function setActiveVacation(vacationId) {
        currentVacation = vacationId;
    }
    
    function showVacation(vacationId) {
        clearMap();
        
        const vacation = vacations[vacationId];
        if (!vacation) return;
        
        if (vacationId === 'national-parks' && vacation.stops.length === 0) {
            map.setView([39.8, -98.6], 4); 
            return;
        }
        
        vacation.stops.forEach((stop, index) => {
            const marker = L.marker(stop.latlng, {
                icon: createCustomIcon(stop.type, false)
            }).addTo(map);
            
            const popupContent = `
                <div class="popup-header">
                    <i class="fas fa-map-pin"></i> ${stop.name}
                    <span class="popup-type" style="background-color: ${pointColors[stop.type] || '#27ae60'}; color: #050b14;">
                        ${getStopTypeLabel(stop.type)}
                    </span>
                </div>
                <div class="popup-description">${stop.description}</div>
                <div class="popup-vacation">
                    <i class="fas fa-suitcase"></i> ${vacation.name}
                </div>
            `;
            
            marker.bindPopup(popupContent);
            markers.push(marker);
            
            if (vacationId !== 'state-parks' && vacationId !== 'national-parks' && index > 0) {
                const prevStop = vacation.stops[index - 1];
                const polyline = L.polyline([prevStop.latlng, stop.latlng], {
                    color: pointColors[prevStop.type] || '#27ae60',
                    weight: 3,
                    opacity: 0.7
                }).addTo(map);
                polylines.push(polyline);
            }
        });
        
        if (vacation.stops.length > 0) {
            const bounds = L.latLngBounds(vacation.stops.map(stop => stop.latlng));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }
    
    function showAllVacations() {
        clearMap();
        
        let allStops = [];
        Object.values(vacations).forEach(vacation => {
            if (vacation.stops.length === 0) return;
            
            vacation.stops.forEach(stop => {
                const allowedTypes = ['destination', 'visit', 'port', 'cruise', 'resort', 'park'];
                
                if (allowedTypes.includes(stop.type) || vacation.id === 'state-parks' || vacation.id === 'national-parks') {
                    allStops.push({
                        ...stop,
                        vacationId: vacation.id,
                        vacationName: vacation.name
                    });
                }
            });
        });
        
        allStops.forEach(stop => {
            const marker = L.marker(stop.latlng, {
                icon: createCustomIcon('default', true, stop.vacationId)
            }).addTo(map);
            
            const popupContent = `
                <div class="popup-header">
                    <i class="fas fa-map-pin"></i> ${stop.name}
                    <span class="popup-type" style="background-color: ${vacationColors[stop.vacationId] || vacationColors.default}; color: #050b14;">
                        ${stop.vacationName.split(' ')[0]}
                    </span>
                </div>
                <div class="popup-description">${stop.description}</div>
                <div class="popup-vacation">
                    <i class="fas fa-suitcase"></i> ${stop.vacationName}
                </div>
            `;
            
            marker.bindPopup(popupContent);
            markers.push(marker);
        });
        
        if (allStops.length > 0) {
            const bounds = L.latLngBounds(allStops.map(stop => stop.latlng));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }
    
    function getStopTypeLabel(type) {
        const labels = {
            'departure': 'Departure',
            'layover': 'Layover',
            'destination': 'Destination',
            'visit': 'Visit',
            'port': 'Port',
            'cruise': 'Cruise',
            'resort': 'Resort',
            'drive': 'Drive Stop',
            'park': 'Park'
        };
        return labels[type] || type;
    }
    
    function clearMap() {
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];
        
        polylines.forEach(line => map.removeLayer(line));
        polylines = [];
    }
    
    function createCustomIcon(type, isAllVacationsView = false, vacationId = null) {
        let color;
        let iconClass;
        
        if (isAllVacationsView) {
            color = vacationColors[vacationId] || vacationColors.default;
            iconClass = 'fas fa-map-pin';
        } else {
            color = pointColors[type] || pointColors.departure;
            
            switch(type) {
                case 'departure': iconClass = 'fas fa-home'; break;
                case 'layover': iconClass = 'fas fa-plane'; break;
                case 'destination': iconClass = 'fas fa-flag'; break;
                case 'visit': iconClass = 'fas fa-map-marker-alt'; break;
                case 'port': iconClass = 'fas fa-anchor'; break;
                case 'cruise': iconClass = 'fas fa-ship'; break;
                case 'resort': iconClass = 'fas fa-umbrella-beach'; break;
                case 'drive': iconClass = 'fas fa-car'; break;
                case 'park': iconClass = 'fas fa-tree'; break;
                default: iconClass = 'fas fa-map-pin';
            }
        }
        
        return L.divIcon({
            className: 'custom-marker',
            html: `
                <div style="
                    background-color: ${color};
                    width: ${isAllVacationsView ? '30px' : '24px'};
                    height: ${isAllVacationsView ? '30px' : '24px'};
                    border-radius: 50%;
                    border: 3px solid white;
                    box-shadow: 0 0 10px rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <i class="${iconClass}" style="font-size: ${isAllVacationsView ? '14px' : '10px'}; color: white;"></i>
                </div>
            `,
            iconSize: isAllVacationsView ? [36, 36] : [30, 30],
            iconAnchor: isAllVacationsView ? [18, 18] : [15, 15]
        });
    }
    
    function switchBasemap(mode) {
        map.removeLayer(currentTileLayer);
        
        if (mode === 'dark') {
            currentTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '©OpenStreetMap, ©CartoDB',
                maxZoom: 18
            });
        } else {
            currentTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18
            });
        }
        
        currentTileLayer.addTo(map);
    }
    
    window.addEventListener('resize', function() {
        setTimeout(() => {
            map.invalidateSize();
            updateDarkModePosition();
        }, 100);
    });
    
    updateDarkModePosition();
});