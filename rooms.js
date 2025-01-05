const apiUrl3 = "http://localhost:3000/rooms/";

async function fetchRooms() {
    try {
        const response = await fetch(apiUrl3);
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des chambres");
        }
        const rooms = await response.json();
        displayRooms(rooms);
    } catch (error) {
        console.error("Erreur lors de la récupération des chambres:", error);
        alert("Une erreur est survenue. Veuillez réessayer.");
    }
}

function displayRooms(rooms) {
    const roomsTable = document.getElementById("rooms-table-body");
    roomsTable.innerHTML = "";
    if (rooms.length === 0) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 5;
        td.textContent = "Aucune chambre trouvée";
        tr.appendChild(td);
        roomsTable.appendChild(tr);
        return;
    }

    rooms.forEach((room) => {
        const tr = document.createElement("tr");
        tr.setAttribute("data-number", room.number);
        const number = document.createElement("td");
        number.textContent = room.number;
        const floor = document.createElement("td");
        floor.textContent = room.floor;
        const capacity = document.createElement("td");
        capacity.textContent = room.capacity;
        const status = document.createElement("td");
        status.textContent = room.status;
        const actions = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.classList.add("btn", "btn-primary");
        editButton.textContent = "Vide/Occupée";
        editButton.addEventListener("click", () => {
            editRoom(room.number);
        });

        actions.appendChild(editButton);

        tr.appendChild(number);
        tr.appendChild(floor);
        tr.appendChild(capacity);
        tr.appendChild(status);
        tr.appendChild(actions);

        roomsTable.appendChild(tr);
    });
}

async function editRoom(roomNumber) {
    try {
        const room = await fetch(`${apiUrl3}${roomNumber}`).then(res => res.json());
        const newStatus = room.status == "Vide" ? "Occupée" : "Vide";
        const response = await fetch(`${apiUrl3}${roomNumber}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: newStatus }),
        });
        console.log(response);
        if (!response.ok) {
            throw new Error("Erreur lors de la modification de la chambre");
        }
    
        const row = document.querySelector(`#rooms-table-body tr[data-number="${roomNumber}"]`);
        
        if (row) {
            row.querySelector("td:nth-child(4)").textContent = newStatus;
        } else {
            console.error(`L'ID de la ligne ${roomNumber} introuvable`);
        }

    } catch (error) {
        console.error("Erreur lors de la modification de la chambre:", error);
        alert("Une erreur s'est produite. Veuillez réessayer.");
    }
}

fetchRooms();