let allRides = [
    { id: 1, startLocation: 'Helsinki', destination: 'Turku', cost: '10€', startDay: '20.12.2023', startTime: '08:00', location: [60.1699, 24.9384], participants: 0, id: 0 },
    { id: 2, startLocation: 'Tampere', destination: 'Hämeenlinna', cost: '15€', startDay: '20.11.2023', startTime: '09:30', location: [61.4978, 23.7610], participants: 1, id: 1 },
    { id: 3, startLocation: 'Kuopio', destination: 'Soisalo', cost: 'Gas', startDay: '30.11.2023', startTime: '10:45', location: [62.879, 27.678], participants: 0, id: 2 },
    { id: 4, startLocation: 'Pihtipudas', destination: 'Pyhäjärvi', cost: '8€', startDay: '12.12.2023', startTime: '12:15', location: [63.445, 25.766], participants: 0, id: 3 },
    { id: 5, startLocation: 'Ylivieska', destination: 'Kempele', cost: 'Free', startDay: '12.12.2023', startTime: '14:00', location: [64.128, 24.547], participants: 1, id: 4 }
];

let joinedRides = [1,4]

/* necessary components for the calendar */
const  calendar = document.querySelector('.calendar'), /* kalenteri */
    date = document.querySelector('.date'), /* kalenterin otsikko (päiväys) */
    daysContainer = document.querySelector('.days'); /* days osio */

const selectedDay = '';

/* necessary data for setting current month */
let today = new Date(),
    activeDay = `${today.getDate()}.${today.getMonth()}.${today.getFullYear()}`,
    month = today.getMonth(),
    year = today.getFullYear(),
    weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months = [
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

/* console.log(` DEBUG
    today: [${today.getDate()}]
    active day: [${activeDay}]
    month: [${month}] => [${months[month]}] index 11 is last month
    year: [${year}]
`) */

function initCalendar() {
    daysContainer.innerHTML = ''
    currentMonthDates = [];

    date.innerHTML = `${months[month]} ${year}` /* kalenterin otsikko osuus */

    /* current month length */
    let prevDays = new Date(year, month, 0).getDay();
    let prevMonthLength = new Date(year, month, 0).getDate();
    let currMonthLength = new Date(year, month + 1, 0).getDate();
    let currMoLastWeekday = new Date(year, month + 1, 0).getDay();
    let nextDays = 7 - currMoLastWeekday

/*     console.log(` DATES OF CURRENT MONTH
    currYear: [${year}]
    currMonth: [${month}]
    prevDays: [${prevDays}]
    prevMonthLength: [${prevMonthLength}]
    currMonthFirstWeekday: [${prevDays+1}] => [${weekdays[prevDays + 1]}]
    currMonthLength: [${currMonthLength}]
    currMoLastWeekday: [${currMoLastWeekday}] => [${weekdays[currMoLastWeekday]}]
    nextDays: [${nextDays}]
    `) */

    /* days in calendar */
    let days = ''
    
    /* setting data in currentMonthDates array */
    if ( prevDays > 0 ) {
        let monthCheck = month < 0 ? 11 : month /* jos aikaisempi kuukausi on viimevuodelta */
        let yearCheck = monthCheck === 0 ? year - 1 : year /* jos monthCheck aikaisemmalle vuodelle on vuosi - 1 */
        for ( let i = prevMonthLength - prevDays + 1; i <= prevMonthLength; i++) {
            currentMonthDates.push({
                class: ['day', 'prev-date'], 
                date:`${i}.${monthCheck}.${yearCheck}`
            })
        }
    }
    for ( let i = 1; i <= currMonthLength; i++) {
        today.getDate() === i && today.getMonth() === month && today.getFullYear() === year /* asettaa tämän päivät today classiin ja muuten day classit */
            ? currentMonthDates.push({class: ['day', 'today'], date:`${i}.${month+1}.${year}`})
            : currentMonthDates.push({class: ['day'], date:`${i}.${month+1}.${year}`})
    }
    if ( nextDays > 0 && nextDays < 7 ) {
        let monthCheck = month === 11 ? 1 : month + 1 /* jos seuraava kuukausi on seuraavalta vuodelta */
        let yearCheck = month === 11 ? year + 1 : year
        for ( let i = 1; i <= nextDays; i++ ) {
            currentMonthDates.push({
                class: ['day', 'next-date'], 
                date:`${i}.${monthCheck+1}.${yearCheck}`
            })
        }
    }

    /* setting day elements in days */
    currentMonthDates.forEach(date => {
        let day = date.date.split('.')[0];
        let divE = document.createElement('div')
        divE.innerHTML = day
        let carE = document.createElement('i') /* auto icon elementti */
        carE.classList.add('fa-solid', 'fa-car')

        /* setting classes */
        date.class.length > 1
            ? date.class.forEach(c => {divE.classList.add(c)}) /* jos luokkia enemmän kuin 1 tehdään forEach */
            : divE.classList.add(date.class[0])

        date.date === activeDay /* jos päivä on aktiivinen */
            ? divE.classList.add('active')
            : null

        /* setting rides */
        allRides.find(ride => ride.startDay === date.date) /* jos päivä on allRideissa */
            ? divE.appendChild(carE)
            : null

        /* setting eventListeners */
        if ( divE.classList.contains('prev-date') ) {
            divE.addEventListener('click', () => {navPrevMonth()})
        }
        if ( divE.classList.contains('next-date') ) {
            divE.addEventListener('click', () => {navNextMonth()})
        }
        if ( divE.classList.contains('day') ) {
            divE.addEventListener('click', () => {navActive(date)})
        }

        daysContainer.appendChild(divE) /* lisää valmiin elementin days osioon */
    });

    showCarpoolEvents();
}

function showCarpoolEvents () {
    let eventDay = document.querySelector('.event-day'); /* notes otsikko viikonpäivä */
    let eventDate = document.querySelector('.event-date');  /* notes otsikko päivämäärä */
    let allEvents = document.querySelector('.calendar-events'); /* kaikki näytettävät eventit */

    let indexDay = activeDay.split('.').map((d) => Number(d))
    let indexWeekday = activeDay === today /* viikonpäivä */
        ? new Date(`${indexDay[2]}-${indexDay[1]}-${indexDay[0]}`).getDay()
        : null
    eventDay.innerHTML = weekdays[indexWeekday]

    eventDate.innerHTML = activeDay

    allEvents.innerHTML = '' /* tyhjää eventtiosion */
    allRides.find(r => r.startDay === activeDay) /* jos valittuna päivänä on eventtejä */
        ? allRides.forEach((ride) => { /* käydään eventit läpi */
            if (ride.startDay === activeDay) {
                let divE = document.createElement('div')
                divE.classList.add('calendar-event')
                
                let eventData = `<p>${ride.startLocation} -> ${ride.destination}</p>
                <p>time: ${ride.startTime}</p>
                <p>cost: ${ride.cost}</p>
                <p><i class="fa-regular fa-user participantCount"> ${ride.participants} </i></p>`

                divE.innerHTML = eventData

                if (joinedRides.includes(ride.id)) { /* jos valittuna päivänä on joinattuja kyytejä on mahdollista leave */
                    let btnE = document.createElement('button');
                    btnE.innerHTML = 'leave'
                    btnE.addEventListener('click', () => allRidesUpdater(['leave', ride.id]))
                    divE.lastChild.appendChild(btnE)
                 } else {  /* jos valittuna päivänä ei ole joinattuja kyytejä on mahdollista join */
                    let btnE = document.createElement('button');
                    btnE.innerHTML = 'join'
                    btnE.addEventListener('click', () => allRidesUpdater(['join', ride.id]))
                    divE.lastChild.appendChild(btnE)
                 }

                allEvents.appendChild(divE)
            }
        })
        : allEvents.innerHTML = 'no events' /* jos ei löydy eventtejä */

}

function navPrevMonth () { /* navigoi aikaisempaan kuukauteen ja setuppaa kalenterin */
    month--;
    if (month < 0) {
        month = 11;
        year--;
    }
    initCalendar();
 }

function navNextMonth () {  /* navigoi seuraavaan kuukauteen ja setuppaa kalenterin */
    month++;
    if (month > 11) {
        month = 0;
        year++;
    }
    initCalendar();
 }

function navActive (date) { /* asettaa valitun päivän valituksi */
    let days = document.querySelectorAll('.day');
    days.forEach(d => d.classList.remove('active'));
    activeDay = date.date
    initCalendar();
 }

/* only updating rides data aka allRides */
function allRidesUpdater(data) { 
    if ( data[0] === 'add' ) { console.log('add'); }

    if ( data[0] === 'leave' ) { 
        let index = joinedRides.indexOf(joinedRides.find(i => i === data[1] ? i : null ));
        joinedRides.splice(index, 1)
        allRides[data[1]].participants -= 1;
    }

    if ( data[0] === 'join' ) { 
        joinedRides.push(data[1]) 
        allRides[data[1]].participants += 1;
    }
    initCalendar();
}

/* kalenterin nuolet < > */
document.querySelector('.prev').addEventListener('click', () => { navPrevMonth() })
document.querySelector('.next').addEventListener('click', () => { navNextMonth() })

// KARTTAOSIO

// Kartan luominen ja aloituspaikan asetus
let map = L.map('map').setView([65.0, 25.0], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

let markers = L.layerGroup();
markers.addTo(map);

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