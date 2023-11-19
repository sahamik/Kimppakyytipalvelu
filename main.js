const calendar = document.querySelector('.calendar'), /* kalenteri */
        date = document.querySelector('.date'), /* kalenterin otsikko (päiväys) */
        daysContainer = document.querySelector('.days'), /* päivät yht */
        prev = document.querySelector('.prev'), /* < icon navigointi taaksepäin */
        next = document.querySelector('.next'); /* > icon navigointi eteenpäin */

const carIconElement = document.createElement('i')
carIconElement.classList.add('fa-solid', 'fa-car')

const eventElement = document.createElement('div')

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();
let weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]

/* CALENDAR */
function initCalendar() {
    const eventsToShow = [] 
    const firstWeekday = new Date(year, month, 1).getDay(); /* kuun ensimmäinen päivä */
    const lastWeekday = new Date(year, month + 1, 0).getDay(); /* kuun ensimmäinen päivä */
    const lastDate = new Date(year, month + 1, 0).getDate(); /* kuun viimeinen päivä */
    const prevLastDay = new Date(year, month, 0).getDate(); /* aikaisemman kuun viimeinen päivä */
    const prevLastDays = firstWeekday - 1; /* +1  jotta pysytään indexissä */
    const nextDays = 7 - lastWeekday;

    const currMonth = new Date(year, month).getMonth() + 1;
    const currYear = new Date(year, month).getFullYear();;

    date.innerHTML = months[month] + " " + year; /* kuukausi kalenterin yläosaan */
    let currMoDates = [] /* kaikki päivämäärät pisteellä */
    let days = " " /* päivien lisäyksen pohja kalenteriin */
    
/*     console.log(`DEBUG\n
    prev last day [${prevLastDay}]\n
    prev last days curr m [${prevLastDays}]\n
    first weekday [${firstWeekday}] => [${weekdays[firstWeekday]}]\n
    last weekday [${lastWeekday}] => [${weekdays[lastWeekday-1]}]\n
    last Date curr m [${lastDate}]\n
    next days [${nextDays}]\n
    current month [${currMonth}] => [${months[currMonth]}]\n
    current year [${currYear}]
`); */

    /* TODO
    - ei ota vielä täysin oikeita päiviä kun navigoi seuraavaan kuukauteen
    - ei aseta tämän päivän näkymää
    */

    /* PREV */
    if ( firstWeekday > 0 ) {
        for ( let i = prevLastDay + 1 - prevLastDays; i <= prevLastDay; i++ )
            { 
                currMoDates.push(`${i}.${currMonth-1}.${currYear}`);
                allRides.find(ride => ride.startDay === currMoDates[currMoDates.length - 1]
                    ? eventsToShow.push(ride) : false ) 
                ? days += `<div class="day prev-date">${i} <i class="fa-solid fa-car"></i></div>` 
                : days += `<div class="day prev-date">${i}</div>`;
            }
    }
    /* CURR */
    for ( let i = 1; i <= lastDate; i++ ) { 
        currMoDates.push(`${i}.${currMonth}.${currYear}`) 
        allRides.find(ride => ride.startDay === currMoDates[currMoDates.length - 1] 
            ? eventsToShow.push(ride) : false ) 
        ? days += `<div class="day">${i} <i class="fa-solid fa-car"></i></i></div>` 
        : days += `<div class="day">${i}</div>`;
    }
    /* NEXT */
    if ( nextDays > 0 ) {
        for ( let i = 1; i <= nextDays; i++ ) { 
            currMoDates.push(`${i}.${currMonth+1}.${currYear}`) 
            allRides.find(ride => 
                ride.startDay === currMoDates[currMoDates.length - 1] 
                ? eventsToShow.push(ride) : false ) 
            ? days += `<div class="day next-date">${i} <i class="fa-solid fa-car"></i></i></div>`
            : days += `<div class="day next-date">${i}</div>`;
        }
    }
    daysContainer.innerHTML = days;
    setEvents({title:'dates', data:currMoDates, allEvents: eventsToShow})
}

/* SET EVENT
- voi käyttää myös muuhun ajatuksena laajennus
- kutsuminen objectilla title vaadittuna
*/
function setEvents( data ) {
    if ( data.title === 'dates' ) {
        const days = document.querySelectorAll('.day')
        data.data.map(( date, index ) => {
            allRides.find( ride => ride.startDay === date )
            ? days[ index ].addEventListener('click', () => showCalendarEvent({ title: 'showEvent', date: date, allEvents: data.allEvents })) /* puuttuu monen eventit näyttäminen */
            : days[ index ].addEventListener('click', () => showCalendarEvent({ title: 'showEvent', date: date }))
        })
    }

}

/* SHOW CALENDAR EVENT
- voi käyttää myös muuhun ajatuksena laajennus
- kutsuminen objectilla title vaadittuna
*/
function showCalendarEvent(data) {
    if ( data.title === 'showEvent' ) {
        const calendarEvents = document.querySelector('.calendar-events')
        calendarEvents.innerHTML = ''

        /* TODO
         - ei ota esim 2 eventtii esille
         - ei aseta valittua päivää näkyville
         - ei näytä 'no events'
        */
       console.log(data.allEvents)
        
        ! data.allEvents
        ? eventElement.innerHTML = `<div class="calendar-event"> no events </div>`
        : data.allEvents.forEach((ride) => {
            if ( ride.startDay === data.date) {
                const eventElement = document.createElement('div')
                eventElement.classList.add('calendar-event')
                eventElement.innerHTML = `
                <div class="calendar-event">
                <p>${ride.startLocation} -> ${ride.destination}</p>
                <p>cost ${ride.cost}</p>
                <p>time ${ride.startTime}</p>
                 <i class="fa-regular fa-user"> ${'0'} </i></div>
                `
                calendarEvents.appendChild(eventElement)
                }
            }
        )
    }
}

/* aikaisemman kuukauden hakeminen */
function prevMonth() {
    month--; /* nykyinen kuukausi - 1 */
    if (month < 0) { /* jos kuukausi on alle 0 vaihtuu kuukausi joulukuuhun ja vuosi on - 1 */
        month = 11;
        year--;
    }
    initCalendar();
}

/* aikaisemman kuukauden hakeminen */
function nextMonth() {
    month++; /* nykyinen kuukausi + 1 */
    if (month > 11) { /* jos kuukausi on yli 11 vaihtuu kuukaus tammikuuksi ja vuosi on + 1 */
        month = 0;
        year++;
    }
    initCalendar();
}


/* navigointi edelliseen ja seuraavaan kuukauteen */
prev.addEventListener('click', prevMonth)
next.addEventListener('click', nextMonth)

// KARTTAOSIO

// Kartan luominen ja aloituspaikan asetus
let map = L.map('map').setView([65.0, 25.0], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

let markers = L.layerGroup();
markers.addTo(map);

// Esimerkki rekisteröidyistä kyydeistä. Uudet kyydit rekisteröidään tänne
let allRides = [
    { startLocation: 'Helsinki', destination: 'Turku', cost: '10€', startDay: '31.10.2023', startTime: '08:00', location: [60.1699, 24.9384] },
    { startLocation: 'Tampere', destination: 'Hämeenlinna', cost: '15€', startDay: '23.11.2023', startTime: '09:30', location: [61.4978, 23.7610] },
    { startLocation: 'Kuopio', destination: 'Soisalo', cost: 'Gas', startDay: '12.11.2023', startTime: '10:45', location: [62.879, 27.678] },
    { startLocation: 'Pihtipudas', destination: 'Pyhäjärvi', cost: '8€', startDay: '12.11.2023', startTime: '12:15', location: [63.445, 25.766] },
    { startLocation: 'Ylivieska', destination: 'Kempele', cost: 'Free', startDay: '1.12.2023', startTime: '14:00', location: [64.128, 24.547] }
];

// Kyytien renderöinti kartalle ja taulukkoon
function renderRides(ride) {
    let marker = L.marker(ride.location);
    marker.addTo(markers);
    marker.bindPopup(`${ride.startLocation} -> ${ride.destination}, Cost: ${ride.cost}, Start Day: ${ride.startDay}, Start Time: ${ride.startTime}`);

    let rideTable = document.getElementById('ride-table');
    let tbody = rideTable.getElementsByTagName('tbody')[0];

    let row = tbody.insertRow();
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);

    cell1.textContent = ride.startLocation;
    cell2.textContent = ride.destination;
    cell3.textContent = ride.cost;
    cell4.textContent = ride.startDay;
    cell5.textContent = ride.startTime;
}

 // Alustava kyytien merkintä kartalle
allRides.forEach(renderRides);

function updateRideList(rides) {
    let rideListElement = document.getElementById('ride-list');   
    rideListElement.innerHTML = '';        
    if (rides) {
        rides.forEach(function(ride) {
            let listItem = document.createElement('li');
            listItem.textContent = ride.startLocation + ' (' + (ride.distance / 1000).toFixed(2) + ' km away)';
            rideListElement.appendChild(listItem);
        });
    }
}

const registerModal = document.getElementById('registerModal');
const registerBtn = document.getElementById('registerBtn');
const closeBtn = document.getElementsByClassName('close')[0];
const mapActionModal = document.getElementById('mapActionModal');
const registerActionBtn = document.getElementById('registerActionBtn');
const searchActionBtn = document.getElementById('searchActionBtn');
let clickEventCoordinates;

// Eri Vaihtoehdot karttaa klikatessa
map.on('click', function(e) {
    mapActionModal.style.display = 'block';
    clickEventCoordinates = e.latlng;
});

closeBtn.onclick = function() {
    registerModal.style.display = 'none';
};

// Modal sulkeminen klikkaamalla
window.onclick = function(event) {
    if (event.target == registerModal) {
        registerModal.style.display = 'none';
    }
};

// Modal valinta, uuden kyydin rekisteröinti
registerActionBtn.addEventListener('click', function() {
    mapActionModal.style.display = 'none';
    registerModal.style.display = 'block';
});

// Modal valinta, kyytien etsiminen
searchActionBtn.addEventListener('click', function() {
    mapActionModal.style.display = 'none';
    searchNearbyRides(clickEventCoordinates);
});

// Modal rekisteröinti nappi, lisää uuden kyydin allRides arrayhin
registerBtn.addEventListener('click', function() {
    const startLocationInput = document.getElementById('startLocation');
    const destinationInput = document.getElementById('destination');
    const costInput = document.getElementById('cost');
    const startDayInput = document.getElementById('startDay');
    const startTimeInput = document.getElementById('startTime');
    const startLocation = startLocationInput.value.trim();
    const destination = destinationInput.value.trim();
    const cost = costInput.value.trim();
    const startDay = startDayInput.value.trim();
    const startTime = startTimeInput.value.trim();

    // Tyhjien kenttien tarkistus
    if (startLocation === "" || destination === "" || cost === "" || startDay === "" || startTime === "") {
        alert('Please fill in all fields');
        return;
    }

    // Rekisteröidyn kyydin merkkaus karttaan
    const coordinates = clickEventCoordinates;
    const marker = L.marker(coordinates);
    marker.addTo(markers);
    marker.bindPopup(`${startLocation} -> ${destination}, Cost: ${cost}, Start Day: ${startDay}, Start Time: ${startTime}`);
    
    const newRide = {
        startLocation: startLocation,
        destination: destination,
        cost: cost,
        startDay: startDay,
        startTime: startTime,
        location: coordinates
    };

    markers.clearLayers();
    allRides.push(newRide);
    let tbody = document.getElementById('ride-table').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
    allRides.forEach(renderRides);
    startLocationInput.value = "";
    destinationInput.value = "";
    costInput.value = "";
    startDayInput.value = "";
    startTimeInput.value = "";
    registerModal.style.display = 'none';
});

// Kyytien haku
function searchNearbyRides(coordinates) {
    let rideList = [];      
    markers.eachLayer(function(marker) {
        let distance = Math.round(coordinates.distanceTo(marker.getLatLng()));
        if (distance <= 100000) { // Haku etäisyys (100km)
            rideList.push({
            startLocation: marker.getPopup().getContent(),
            distance: distance,
        });
    }
});

updateRideList(rideList);
}

initCalendar() /* kalenterin kutsu kaikkien arvojen kanssa niin saa kirjattua kyydit */