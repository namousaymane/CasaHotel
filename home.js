const apiUrl2 = "http://localhost:3000/bookings/";
const apiUrl3 = "http://localhost:3000/rooms/";

async function fetchBookings() {
    try {
        const response = await fetch(apiUrl2);
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des réservations");
        }
        const bookings = await response.json();
        displayBookings(bookings);
    } catch (error) {
        console.error("Erreur de la récupération des réservations:", error);
        alert("Une erreur s'est produite. Veuillez réessayer.");
    }
}

function displayBookings(bookings) {
    const waitingBadge = document.getElementById("waiting");
    const acceptedBadge = document.getElementById("accepted");
    const assignedBadge = document.getElementById("assigned");
    
    let waitingCount = 0;
    let acceptedCount = 0;
    let assignedCount = 0;



        bookings.forEach((booking) => {
        if (booking.status == "En attente") {
            waitingCount++;
        } else if (booking.status == "Accepté") {
            acceptedCount++;
        } else if (booking.status.startsWith("Chambre")) {
            assignedCount++;
        }
    });

    waitingBadge.textContent = waitingCount;
    acceptedBadge.textContent = acceptedCount;
    assignedBadge.textContent = assignedCount;
}

async function fetchRooms() {
    try {
        const response = await fetch(apiUrl3);
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des chambres");
        }
        const rooms = await response.json();
        displayRooms(rooms);
    } catch (error) {
        console.error("Erreur de la récupération des chambres:", error);
        alert("Une erreur s'est produite. Veuillez réessayer.");
    }
}

function displayRooms(rooms) {
    const occupiedBadge = document.getElementById("occupied");
    const availableBadge = document.getElementById("available");
    
    let occupiedCount = 0;
    let availableCount = 0;

    rooms.forEach((room) => {
        if (room.status == "Occupée") {
            occupiedCount++;
        } else if (room.status == "Vide") {
            availableCount++;
        }
    });

    // Mise à jour des badges sur le panneau des chambres
    occupiedBadge.textContent = occupiedCount;
    availableBadge.textContent = availableCount;
}

// Appel initial pour récupérer les données de réservation et de chambre
fetchBookings();
fetchRooms();
