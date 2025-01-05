const apiUrl2 = "http://localhost:3000/bookings/";

const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const fullname = document.querySelector("#name").value.trim();
  const phone = document.querySelector("#phone").value.trim();
  const arrival = document.querySelector("#arrival").value;
  const departure = document.querySelector("#departure").value;
  const guests = parseInt(document.querySelector("#guests").value.trim(), 10);

  if (!fullname || !phone || !arrival || !departure || isNaN(guests)) {
    alert("Veuillez remplir correctement tous les champs");
    return;
  }

  fetch(apiUrl2)
    .then((response) => response.json())
    .then((data) => {
      const maxId = data.reduce((max, booking) => (booking.id > max ? booking.id : max), 0);

      const newBooking = {
        id: maxId + 1, 
        fullname,
        phone,
        arrival,
        departure,
        guests,
        status: "En attente"
      };

      return fetch(`${apiUrl2}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBooking),
      });
    })
    .then((response) => {
      if (response.ok) {
        alert("Réservation validée avec succès!");
        form.reset();
      } else {
        throw new Error("Échec de la réservation");
      }
    })
    .catch((error) => {
      console.error("Erreur de réservation :", error);
      alert("Erreur de réservation. Veuillez réessayer.");
    });
});
