const calendar = document.querySelector('.calendar'),
        date = document.querySelector('.date'),
        daysContainer = document.querySelector('.days'),
        prev = document.querySelector('.prev'),
        next = document.querySelector('.next'),
        nextDate = document.querySelector('.next-date');

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();
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

/* näytettävä kalenterikuukausi */
function initCalendar() {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    const prevDaysForCurrentMonth = prevLastDay.getDay();
        const day = firstDay.getDay();
        const lastDate = lastDay.getDate();
        const prevDays = prevLastDay.getDate();
        const nextDays = 7 - lastDay.getDay();

        /* debugging */
        console.log(
            'eka pv this kk: '+firstDay+
            '\nvika pv this kk: '+lastDay+
            '\nprev kk vika '+prevLastDay+
            '\nprev päivät '+prevDays+
            '\neka vkpv this kk '+day+
            '\nprev päivät curr kk '+prevDaysForCurrentMonth)

        /* kuukausi kalenterin yläosaan */
        date.innerHTML = months[month] + " " + year;

        /* päivien lisäyksen pohja */
        let days = " "

        /* aikaisemma kuukauden päivät (näytössä olevan kuukauden alkuun)*/
        /* x on aikaisempienpäivien määrä miinus se määrä joka kuuluu nykyiseen kk ja + 1 että ottaa huomioon ekan pvn */
        for (let x = prevDays - prevDaysForCurrentMonth + 1; x <= prevDays; x++){
            console.log(prevDays - x + 1)
            days += `<div class="day prev-date">${x}</div>`;
        }

    /*  nykyisen kuukauden päivät  */
        for (let i = 1; i <= lastDate; i++){
            if ( /* jos päivä on tämä päivä tulee class 'today' */
                i === new Date().getDate() && 
                year === new Date().getFullYear() && 
                month === new Date().getMonth()
                ) {
                days += `<div class="day today">${i}</div>`;
            } else {
                days += `<div class="day">${i}</div>`;
            }
        }

        /* seuraavan kuukauden päivät (näytössä olevan kuukauden loppuun) */
        if (nextDays < 8){
        for (let j = 1; j <= nextDays; j++){
            days += `<div class="day next-date">${j}</div>`;
        }
    }

        daysContainer.innerHTML = days;
        addListener()
}

initCalendar()

/* aikaisemman kuukauden hakeminen */
function prevMonth() { /* jos kuukausi on alle 0 asetetaan kuukaus viimeiseksi ja vuosi edelliseksi */
    month--;
    if (month < 0) {
        month = 11;
        year--;
    }
    initCalendar();
}

/* aikaisemman kuukauden hakeminen */
function nextMonth() {
    month++;
    if (month > 11) { /* jos kuukausi on yli 11 asetetaan kuukaus ensimmäiseksi ja vuosi seuravaksi*/
        month = 0;
        year++;
    }
    initCalendar();
}

/* navigointi edelliseen ja seuraavaan kuukauteen */
prev.addEventListener('click', prevMonth)
next.addEventListener('click', nextMonth)

/* avaa valitun päivän tiedot */
function addListener() {
    const days = document.querySelectorAll('.day');
    days.forEach((day) => {
        day.addEventListener('click', (e) => {
            /* asetta valitun päivän aktiiviseksi event.targetilla */
            activeDay = Number(e.target.innerHTML);

            /* aktiivisen päivän eventtien näyttäminen */
            getActiveDay(e.target.innerHTML)


            /* poistaa active luokan valmiiksi aktiivisesta päivästä */
            days.forEach((day) => {
                day.classList.remove('active');
            });
            console.log(activeDay, e.target.classList)

            /* jos aikaisemman kuukauden päivää painettu siirtyy kalenteri aikaisemmalle kuulle 
                ja asettaa kuun päivät 'day' classiin */
            if (e.target.classList.contains('prev-date')) {
                prevMonth();

                setTimeout(() => {
                    const days = document.querySelectorAll('.day');
                   /* ennen aikaisempaan kuuhun menoa asetetan aikaisemman kuun valitun päivä aktiiviseksi */
                    days.forEach((day) => {
                        if (
                            !day.classList.contains('prev-date') &&
                            day.innerHTML === e.target.innerHTML
                        )   {
                            day.classList.add('active')
                        }
                    });
                }, 100);
            } else if (e.target.classList.contains('next-date')) {
                nextMonth();

                setTimeout(() => {
                    const days = document.querySelectorAll('.day');
                   /* ennen seuraavaan kuuhun menoa asetetan aikaisemman kuun valitun päivä aktiiviseksi */
                    days.forEach((day) => {
                        if (
                            !day.classList.contains('next-date') &&
                            day.innerHTML === e.target.innerHTML
                        )   {
                            day.classList.add('active')
                        }
                    });
                }, 100);
            } else {
                e.target.classList.add('active');
            }
        })
    });
}

/* valitun päivän infotaulu */
const eventDay = document.querySelector('.event-day'),
        eventDate = document.querySelector('.event-date');
function getActiveDay(date) {
    const day = new Date(year, month, date);
    const dayName = day.toString().split(' ')[0];
    eventDay.innerHTML = dayName;
    eventDate.innerHTML = date + ' ' + months[month] + ' ' + year;
}

// KARTTAOSIO

// Kartan luominen ja aloituspaikan asetus
var map = L.map('map').setView([65.0, 25.0], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

var markers = L.layerGroup();
markers.addTo(map);

// Esimerkki rekisteröidyistä kyydeistä
var exampleRides = [
    { name: 'Helsinki', location: [60.1699, 24.9384] },
    { name: 'Tampere', location: [61.4978, 23.7610] },
    { name: 'Kuopio', location: [62.879, 27.678] },
    { name: 'Pihtipudas', location: [63.445, 25.766] },
    { name: 'Ylivieska', location: [64.128, 24.547] }
];

exampleRides.forEach(function(ride) {
    var marker = L.marker(ride.location);
    marker.addTo(markers);
    marker.bindPopup(ride.name);
});

function updateRideList(rides) {
    var rideListElement = document.getElementById('ride-list');
    rideListElement.innerHTML = '';        
    if (rides) {
        rides.forEach(function(ride) {
        var listItem = document.createElement('li');
        listItem.textContent = ride.name + ' (' + (ride.distance / 1000).toFixed(2) + ' km away)';
        rideListElement.appendChild(listItem);
        });
    }
}

// Eri Vaihtoehdot karttaa klikatessa
map.on('click', function(e) {
    var userChoice = prompt('Do you want to register a new ride or search nearby rides?\nEnter "register" or "search".');        
    if (userChoice) {
        if (userChoice.toLowerCase() === 'register') {
        registerNewRide(e.latlng);
        } else if (userChoice.toLowerCase() === 'search') {
        searchNearbyRides(e.latlng);
        } else {
        alert('Invalid choice. Please enter "register" or "search".');
        }
    }
});

// Kyytien rekisteröinti
function registerNewRide(coordinates) {
    var rideName = prompt('Enter the name of the ride:');        
    if (rideName) {
        var marker = L.marker(coordinates);
        marker.addTo(markers);
        marker.bindPopup(rideName);        
        updateRideList();
    }
}

// Kyytien haku
function searchNearbyRides(coordinates) {
    var rideList = [];      
    markers.eachLayer(function(marker) {
        var distance = Math.round(coordinates.distanceTo(marker.getLatLng()));
        if (distance <= 100000) { // Haku etäisyys (100km)
            rideList.push({
            name: marker.getPopup().getContent(),
            distance: distance,
        });
    }
});

updateRideList(rideList);
}