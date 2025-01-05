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

// Affichage des réservations dans le tableau 
function displayBookings(bookings) {
    const bookingsTable = document.getElementById("bookings-table-body");
    bookingsTable.innerHTML = "";
    if (bookings.length === 0) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 7;
        td.textContent = "Aucune réservation trouvee";
        tr.appendChild(td);
        bookingsTable.appendChild(tr);
        return;
    }
  
    bookings.forEach((booking) => {
        const tr = document.createElement("tr");
        tr.setAttribute("data-id", booking.id);
        const fullname = document.createElement("td");
        fullname.textContent = booking.fullname;
        const phone = document.createElement("td");
        phone.textContent = booking.phone;
        const arrival = document.createElement("td");
        arrival.textContent = booking.arrival;
        const departure = document.createElement("td");
        departure.textContent = booking.departure;
        const guests = document.createElement("td");
        guests.textContent = booking.guests;
        const status = document.createElement("td");
        status.textContent = booking.status;
        const actions = document.createElement("td");
        
        const acceptButton = document.createElement("button");
        acceptButton.classList.add("btn", "btn-success");
        acceptButton.textContent = "Accepter";
        acceptButton.addEventListener("click", () => {
            acceptBooking(booking.id);
        });
        
        const rejectButton = document.createElement("button");
        rejectButton.classList.add("btn", "btn-danger");
        rejectButton.textContent = "Rejeter";
        rejectButton.addEventListener("click", () => {
            rejectBooking(booking.id);
        });
        
        const assignButton = document.createElement("button");
        assignButton.classList.add("btn", "btn-primary");
        assignButton.textContent = "Assigner";
        assignButton.addEventListener("click", () => {
            assignBooking(booking.id);
        });


        if (booking.status === "En attente") {
            actions.appendChild(acceptButton);
        }
        actions.appendChild(rejectButton); 
        actions.appendChild(assignButton);
      
        tr.appendChild(fullname);
        tr.appendChild(phone);
        tr.appendChild(arrival);
        tr.appendChild(departure);
        tr.appendChild(guests);
        tr.appendChild(status);
        tr.appendChild(actions);
        
        bookingsTable.appendChild(tr);
    });
}

// Gestion des actions : accepter, rejeter et assigner 
async function acceptBooking(bookingId) {
    try {
        const response = await fetch(`${apiUrl2}${bookingId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: "Accepté" }),
        });

        if (!response.ok) {
            throw new Error("Erreur lors de l'acceptation");
        }

        const row = document.querySelector(`#bookings-table tr[data-id="${bookingId}"]`);
        
        if (row) {
            row.children[5].textContent = "Accepté"; 
            row.children[6].children[0].remove();  
        } else {
            console.error(`L'ID de la ligne ${bookingId} introuvable`);
        }
    } catch (error) {
        console.error("Erreur lors de l'acceptation", error);
        alert("Une erreur s'est produite. Veuillez réessayer.");
    }
}
async function rejectBooking(bookingId) {
    try {
        const response = await fetch(`${apiUrl2}${bookingId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Erreur lors du rejet");
        }

        const row = document.querySelector(`#bookings-table tr[data-id="${bookingId}"]`);
        
        if (row) {
            row.remove();  
        } else {
            console.error(`L'ID de la ligne ${bookingId} introuvable`);
        }
    } catch (error) {
        console.error("Erreur lors du rejet :", error);
        alert("Une erreur s'est produite. Veuillez réesayer.");
    }
}

async function assignBooking(bookingId) {
    const roomNumber = prompt("Entrez le numero de la chambre (seulement si elle est vide):");
    if (!roomNumber) {
        alert("Vous devez entrer un numero de chambre");
        return;
    }
    try {
        const room = await fetch(`${apiUrl3}${roomNumber}`).then(res => res.json());
        if (room.status !== "Vide") {
            alert(`La chambre ${roomNumber} n'est pas vide`);
            return;
        }

        const response1 = await fetch(`${apiUrl2}${bookingId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: `Chambre ${roomNumber}` }),
        });

        if (!response1.ok) {
            throw new Error("Erreur lors de l'assignation");
        }

        const response2 = await fetch(`${apiUrl3}${roomNumber}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: "Occupé" }),
        });

        if (!response2.ok) {
            throw new Error("Erreur lors de la mise a jour de la chambre");
        }

        const row = document.querySelector(`#bookings-table tr[data-id="${bookingId}"]`);
        
        if (row) {
            row.children[5].textContent = `Chambre ${roomNumber}`; 
        } else {
            console.error(`L'ID de la ligne ${bookingId} introuvable`);
        }
        alert(`La chambre ${roomNumber} a ete assignee avec succes`);
    } catch (error) {
        console.error("Erreur lors de l'assignation", error);
        alert("Une erreur s'est produite. Veuillez réessayer.");
    }
}


fetchBookings();
