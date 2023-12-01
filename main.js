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
let weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
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
    const firstWeekday = new Date(year, month, 0).getDay() + 1; /* kuun ensimmäinen päivä */
    const lastWeekday = new Date(year, month + 1, 0).getDay(); /* kuun ensimmäinen päivä */
    const lastDate = new Date(year, month + 1, 0).getDate(); /* kuun viimeinen päivä */
    const prevLastDay = new Date(year, month, 0).getDate(); /* aikaisemman kuun viimeinen päivä */
    const prevLastDays = firstWeekday - 1; /* +1  jotta pysytään indexissä */
    const nextDays = 7 - lastWeekday;

    const currMonth = new Date(year, month + 1).getMonth();
    const currYear = new Date(year, month).getFullYear();;

    date.innerHTML = months[month] + " " + year; /* kuukausi kalenterin yläosaan */
    let currMoDates = [] /* kaikki päivämäärät pisteellä */
    let days = " " /* päivien lisäyksen pohja kalenteriin */

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
        allRides.find(ride => 
            ride.startDay === currMoDates[currMoDates.length - 1] 
            ? eventsToShow.push(ride) 
            : false 
        ) 
        ? days += `<div class="day">${i} <i class="fa-solid fa-car"></i></i></div>` 
        : days += `<div class="day">${i}</div>`;
    }
    /* NEXT */
    if ( nextDays > 0 && nextDays < 7 ) {
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
    showEvents(currMoDates)
}

function showEvents(currMoDates) {
    /* needed data
    console.log(currMoDates)
    console.log(allRides) */
    let events = ""
    /* needed elements */
    let eventDay = document.querySelector('.event-day');
    let eventDate = document.querySelector('.event-date');
    let allEvents = document.querySelector('.calendar-events');
    let days = document.querySelectorAll('.day')


    /* click event for all days */
    currMoDates.forEach((day, index) => {
        let indexDay = day.split('.').map((d) => Number(d))
        let indexWeekday = new Date(`${indexDay[2]}-${indexDay[1]}-${indexDay[0]}`).getDay();

        if (day === `${today.getDate()}.${today.getMonth()+1}.${today.getFullYear()}`){ 
            days[index].classList.add('today');
            eventDay.innerHTML = `${weekdays[today.getDay()]}`;
            eventDate.innerHTML = `${day} <small>today</small>`;

            allRides.forEach((ride, rideIndex) => {
                if (ride.startDay === day) {
                    events += `<div class="calendar-event">
                    <p>${ride.startLocation} -> ${ride.destination}</p>
                    <p>time: ${ride.startTime}</p>
                    <p>cost: ${ride.cost}</p>
                    <p><i class="fa-regular fa-user participantCount" dataRideIndex="${rideIndex}"> ${ride.participants} </i><button class="joinRideBtn" dataRideIndex="${rideIndex}">join</button></p>
                    </div>`
                }
            })
            allEvents.innerHTML = events
        }

        allRides.find( ride => ride.startDay === day )
        ? days[index].addEventListener('click', () => { /* jos valittu pv on kirjatuissa kyydeissä */
            days.forEach( d => d.classList.contains('active') ? d.classList.remove('active') : null )
            days[index].classList.add('active');
            console.log(day,'is event day', weekdays[indexWeekday]);
            eventDay.innerHTML = `${weekdays[indexWeekday]}`
            eventDate.innerHTML = `${day}`
            events = ""
            allEvents.innerHTML = ""
            allRides.forEach((r, rideIndex) => {
                r.startDay === day
                ? events += `<div class="calendar-event">
                <p>${r.startLocation} -> ${r.destination}</p>
                <p>time: ${r.startTime}</p>
                <p>cost: ${r.cost}</p>
                <p><i class="fa-regular fa-user participantCount" dataRideIndex="${rideIndex}"> ${r.participants} </i><button class="joinRideBtn" dataRideIndex="${rideIndex}">join</button></p>
                </div>`
                : null
            })
            allEvents.innerHTML = events

            /* Tapahtumakuuntelijat liity painikkeille. Kutsutaan joinRide funktiota kun klikataan eventin liity painiketta. Piilotetaan liity painike tämän jälkeen. */
            let joinButtons = document.querySelectorAll(".joinRideBtn");
            joinButtons.forEach((btn) => {
                btn.addEventListener("click", function()  {
                    let rideIndex = this.getAttribute("dataRideIndex");
                    let participantCount = document.querySelector(`.participantCount[dataRideIndex="${rideIndex}"]`);
                    joinRide(allRides[rideIndex], participantCount, rideIndex);
                    btn.style.display = "none";
                    showMyRides();
                })
            })
        })
            
        : days[index].addEventListener('click', () => { /* jos valittu pv ei ole kirjatuissa kyydeissä */
            days.forEach( d => d.classList.contains('active') ? d.classList.remove('active') : null )
            days[index].classList.add('active');
            console.log(day,'is not event day', weekdays[indexWeekday]); 
            eventDay.innerHTML = `${weekdays[indexWeekday]}`
            eventDate.innerHTML = `${day}`
            allEvents.innerHTML = ""
            allEvents.innerHTML = 'no events'
        })
    })
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
    { id: 1, startLocation: 'Helsinki', destination: 'Turku', cost: '10€', startDay: '20.11.2023', startTime: '08:00', location: [60.1699, 24.9384], participants: 0 },
    { id: 2, startLocation: 'Tampere', destination: 'Hämeenlinna', cost: '15€', startDay: '20.11.2023', startTime: '09:30', location: [61.4978, 23.7610], participants: 0 },
    { id: 3, startLocation: 'Kuopio', destination: 'Soisalo', cost: 'Gas', startDay: '1.11.2023', startTime: '10:45', location: [62.879, 27.678], participants: 0 },
    { id: 4, startLocation: 'Pihtipudas', destination: 'Pyhäjärvi', cost: '8€', startDay: '12.11.2023', startTime: '12:15', location: [63.445, 25.766], participants: 0 },
    { id: 5, startLocation: 'Ylivieska', destination: 'Kempele', cost: 'Free', startDay: '1.12.2023', startTime: '14:00', location: [64.128, 24.547], participants: 0 }
];

// Kyytien renderöinti kartalle ja taulukkoon
function renderRides(ride, rideIndex) {
    let marker = L.marker(ride.location);
    marker.addTo(markers);
    marker.bindPopup(`${ride.startLocation} -> ${ride.destination}, Cost: ${ride.cost}, Start Day: ${ride.startDay}, Start Time: ${ride.startTime}, Participants: ${ride.participants}`);

    let rideTable = document.getElementById('ride-table');
    let tbody = rideTable.getElementsByTagName('tbody')[0];

    let row = tbody.insertRow();
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);
    let cell6 = row.insertCell(5);
    let cell7 = row.insertCell(6);
    let cell8 = row.insertCell(7);

    cell1.textContent = ride.startLocation;
    cell2.textContent = ride.destination;
    cell3.textContent = ride.cost;
    cell4.textContent = ride.startDay;
    cell5.textContent = ride.startTime;
    cell6.textContent = ride.participants;

    // Kyytiin liittymisnapin luokan luominen ja päivitys
    cell7.classList.add('join-ride-cell');
    let joinButton = document.createElement('button');
    joinButton.className = 'join-button';
    cell7.appendChild(joinButton);
    updateJoinButtonState(joinButton, ride, rideIndex);   
    joinButton.addEventListener('click', function() {
        joinRideTable(allRides[rideIndex], cell6, rideIndex);
        updateJoinButtonState(joinButton, allRides[rideIndex], rideIndex);
    });

    // Kyydin poistonapin luokan luominen
    cell8.classList.add('remove-ride-cell');
    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-button';
    deleteButton.addEventListener('click', function() {
        deleteRide(rideIndex);
    });
    cell8.appendChild(deleteButton);
}

// Muuttaa Join napin Leave napiksi ja takaisin
function updateJoinButtonState(button, ride, rideIndex) {
    let myRides = JSON.parse(localStorage.getItem("myRides")) || [];
    let joinedRides = myRides.find((r) => r.rideIndex === rideIndex);

    if (joinedRides) {
        button.textContent = 'Leave';
    } else {
        button.textContent = 'Join';
    }
}

// Kyydin poisto allRides, myRides, kartalta ja kalenterista
function deleteRide(rideIndex) {
    const deletedRide = allRides[rideIndex];
    allRides.splice(rideIndex, 1);
    const myRides = JSON.parse(localStorage.getItem("myRides")) || [];
    const updatedMyRides = myRides.filter((r) => r.ride.id !== deletedRide.id);
    localStorage.setItem("myRides", JSON.stringify(updatedMyRides));

    updateMap();
    const dateCell = document.querySelector(`.day[data-date="${deletedRide.startDay}"]`);
    if (dateCell) {
        const carIcon = dateCell.querySelector('.fa-car');
        if (carIcon) {
            carIcon.remove();
        }
    }
    initCalendar();
    showMyRides();
}

// Alustava kyytien merkintä kartalle
allRides.forEach(renderRides);

// Päivittää listan jossa näkyy lähellä olevat kyydit (Nearby Rides)
function updateNearbyRideList(rides) {
    let rideListElement = document.getElementById('ride-list');
    rideListElement.innerHTML = '';
    if (!rides || rides.length === 0) {
        let noRidesMessage = document.createElement('li');
        noRidesMessage.textContent = 'No nearby rides';
        rideListElement.appendChild(noRidesMessage);
    } else {      
        rides.forEach(function(ride) {
            let listItem = document.createElement('li');
            listItem.textContent = ride.startLocation + ' (' + (ride.distance / 1000).toFixed(2) + ' km away)';
            rideListElement.appendChild(listItem);
        });
    }
}

// Filtteröi kyyti taulukon startLocation mukaan
function filterRides() {
    let startLocationFilter = document.getElementById('startLocationFilter').value.toLowerCase();
    let filteredRides = allRides.filter(ride => ride.startLocation.toLowerCase().includes(startLocationFilter));
    clearTable();
    markers.clearLayers();
    filteredRides.forEach(renderRides);
}

// Filtterin resetointi, toimii myös pyyhkimällä filter input field tyhjäksi
function resetFilter() {
    document.getElementById('startLocationFilter').value = '';
    clearTable();
    updateMap();
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
    registerRide()
});

// Uuden kyydin rekisteröinti
function registerRide() {
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
        id: allRides.length + 1,
        startLocation: startLocation,
        destination: destination,
        cost: cost,
        startDay: startDay,
        startTime: startTime,
        location: coordinates,
        participants: 0
    };

    allRides.push(newRide);
    startLocationInput.value = "";
    destinationInput.value = "";
    costInput.value = "";
    startDayInput.value = "";
    startTimeInput.value = "";
    registerModal.style.display = 'none';
    updateMap();
    initCalendar();
};

// updateMap() voi käyttää aina kun tarvitsee päivittää kyytitaulukkoa
function updateMap() {
    markers.clearLayers();
    let tbody = document.getElementById('ride-table').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
    allRides.forEach(renderRides);
}

// Ylimääräinen kyytitaulukon tyhjennys joka ei renderöi kyytejä uudestaan
function clearTable() {
    let tbody = document.getElementById('ride-table').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
}

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

updateNearbyRideList(rideList);
}

initCalendar() /* kalenterin kutsu kaikkien arvojen kanssa niin saa kirjattua kyydit */

/* KYYTIIN LIITTYMINEN */

function joinRide(ride, participantCount, rideIndex) {
    rideIndex = parseInt(rideIndex, 10);   
    // Tutkitaan onko käyttäjä jo liittynyt kyytiin ja jos on, ei pysty liittymään uudestaan.
    let myRides = JSON.parse(localStorage.getItem("myRides")) || [];
    let joinedRides = myRides.find((r) => r.rideIndex === rideIndex);

    if (joinedRides) {
        participantCount.closest(".calendar-event").insertAdjacentHTML("beforeend", "<p>Olet jo liittynyt tähän kyytiin!</p>");
        console.log("Olet jo liittynyt tähän kyytiin!");
        return;
    } else {
        // Jos ei ole liittynyt, kasvatetaan osallistujamäärää yhdellä, annetaan ilmoitus kyytiin liittymisestä ja tallennetaan kyyti myRides taulukkoon.
        ride.participants++;

        participantCount.textContent = `${ride.participants}`;
        allRides[rideIndex] = ride;
        console.log("Liitytty kyytiin: ", ride);
        participantCount.closest(".calendar-event").insertAdjacentHTML("beforeend", "<p>Kyytiin liitytty onnistuneesti</p>");

        myRides.push( {ride: ride, rideIndex: rideIndex });
        localStorage.setItem("myRides", JSON.stringify(myRides));
        updateMap();
    }
}

// Kyyteihin liittymisen hallinta erikseen kyytilistassa
function joinRideTable(ride, participantCount, rideIndex) {
    let myRides = JSON.parse(localStorage.getItem("myRides")) || [];
    let joinedRides = myRides.find((r) => r.rideIndex === rideIndex);
    
    if (joinedRides) {
        myRides = myRides.filter((r) => r.rideIndex !== rideIndex);
        localStorage.setItem("myRides", JSON.stringify(myRides));
        let joinButton = document.querySelector(`.joinRideBtn[dataRideIndex="${rideIndex}"]`);
        
        if (joinButton) {
            joinButton.textContent = "Join";
        }
        ride.participants--;
        participantCount.textContent = `${ride.participants}`;
    } else {
        ride.participants++;
        participantCount.textContent = `${ride.participants}`;
        allRides[rideIndex] = ride;
        let joinButton = document.querySelector(`.joinRideBtn[dataRideIndex="${rideIndex}"]`);
        
        if (joinButton) {
            joinButton.textContent = "Leave";
        }
        myRides.push( {ride: ride, rideIndex: rideIndex });
        localStorage.setItem("myRides", JSON.stringify(myRides));
    }
    updateMap();
    showMyRides();
}

// Omien kyytien näyttäminen
function showMyRides() {
    let myRides = JSON.parse(localStorage.getItem("myRides")) || [];
    let myRidesElement = document.querySelector(".my-rides");
    let myRidesList = document.createElement("ul");

    myRidesElement.innerHTML = "";

    myRides.forEach(r => {
        let rideItem = document.createElement("li");
        rideItem.textContent = `${r.ride.startLocation} -> ${r.ride.destination} (${r.ride.startTime}), Cost: ${r.ride.cost}`;
        myRidesList.appendChild(rideItem);

        myRidesElement.appendChild(myRidesList);
    });
}

// Uloskirjautuminen sovelluksesta
document.getElementById("logOutBtn").addEventListener("click", logOut);

function logOut() {
    window.location.href = "index.html";
}