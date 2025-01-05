const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const CREDENTIALS_FILE = "credentials.json";
const BOOKINGS_FILE = "booking.json";
const ROOMS_FILE = "rooms.json";

// Récupère la liste des admins
app.get("/credentials", (req, res) => {
  fs.readFile(CREDENTIALS_FILE, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send({ error: "Error reading credentials file" });
    }
    res.send(JSON.parse(data));
  });
});

// Ajoute un nouvel admin
app.post("/credentials", (req, res) => {
  const credentials = req.body;
  fs.writeFile(CREDENTIALS_FILE, JSON.stringify(credentials, null, 2), (err) => {
    if (err) {
      return res.status(500).send({ error: "Error saving credentials file" });
    }
    res.send({ message: "Admin saved successfully!" });
  });
});

// Récupère la liste des bookings (réservations)
app.get("/bookings", (req, res) => {
  fs.readFile(BOOKINGS_FILE, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send({ error: "Error reading bookings file" });
    }
    res.send(JSON.parse(data));
  });
});

// Récupère une réservation par son ID
app.get("/bookings/:id", (req, res) => {
    const bookingId = parseInt(req.params.id, 10);
    if (isNaN(bookingId)) {
      return res.status(400).send({ error: "Invalid ID format" });
    }
  
    fs.readFile(BOOKINGS_FILE, "utf8", (err, data) => {
      if (err) {
        return res.status(500).send({ error: "Error reading bookings file" });
      }
  
      const bookings = JSON.parse(data);
      const booking = bookings.find((b) => b.id === bookingId);
  
      if (!booking) {
        return res.status(404).send({ error: "Booking not found" });
      }
  
      res.send(booking);
    });
  });

// Ajoute une nouvelle réservation
app.post("/bookings", (req, res) => {
  const newBooking = req.body;
  fs.readFile(BOOKINGS_FILE, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send({ error: "Error reading bookings file" });
    }

    const bookings = JSON.parse(data);
    bookings.push(newBooking);

    fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), (err) => {
      if (err) {
        return res.status(500).send({ error: "Error saving bookings file" });
      }
      res.status(201).send(newBooking);
    });
  });
});

// Met à jour une réservation
app.put("/bookings/:id", (req, res) => {
    const bookingId = parseInt(req.params.id, 10);
    if (isNaN(bookingId)) {
      return res.status(400).send({ error: "Invalid ID format" }); 
    }
  
    fs.readFile(BOOKINGS_FILE, "utf8", (err, data) => {
      if (err) {
        return res.status(500).send({ error: "Error reading file" });
      }
  
      const bookings = JSON.parse(data);
      const bookingIndex = bookings.findIndex((b) => b.id === bookingId);
  
      if (bookingIndex === -1) {
        return res.status(404).send({ error: "Booking not found" }); 
      }
  
      const updatedBooking = { ...bookings[bookingIndex], ...req.body };
      bookings[bookingIndex] = updatedBooking;
  
      fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), (err) => {
        if (err) {
          return res.status(500).send({ error: "Error saving file" });
        }
  
        res.json(updatedBooking);
      });
    });
});

  
  // Supprime une réservation
  app.delete("/bookings/:id", (req, res) => {
    const bookingId = parseInt(req.params.id, 10);
    if (isNaN(bookingId)) {
      return res.status(400).send({ error: "Invalid ID format" });
    }
  
    fs.readFile(BOOKINGS_FILE, "utf8", (err, data) => {
      if (err) {
        return res.status(500).send({ error: "Error reading file" });
      }
  
      const bookings = JSON.parse(data);
      const bookingIndex = bookings.findIndex((b) => b.id === bookingId);
  
      if (bookingIndex === -1) {
        return res.status(404).send({ error: "Booking not found" });
      }
  
      bookings.splice(bookingIndex, 1);
  
      fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), (err) => {
        if (err) {
          return res.status(500).send({ error: "Error saving file" });
        }
  
        res.status(204).send();
      });
    });
  });
  
app.get("/rooms", (req, res) => {
  fs.readFile(ROOMS_FILE, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send({ error: "Error reading rooms file" });
    }
    res.send(JSON.parse(data));
  });
});

app.get("/rooms/:number", (req, res) => {
  const roomNumber = parseInt(req.params.number, 10);
  if (isNaN(roomNumber)) {
    return res.status(400).send({ error: "Invalid number format" });
  }

  fs.readFile(ROOMS_FILE, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send({ error: "Error reading rooms file" });
    }

    const rooms = JSON.parse(data);
    const room = rooms.find((r) => r.number === roomNumber);

    if (!room) {
      return res.status(404).send({ error: "Room not found" });
    }

    res.send(room);
  });
});

app.put("/rooms/:number", (req, res) => {
  const roomNumber = parseInt(req.params.number, 10);
  if (isNaN(roomNumber)) {
    return res.status(400).send({ error: "Invalid number format" });
  }

  fs.readFile(ROOMS_FILE, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send({ error: "Error reading rooms file" });
    }

    const rooms = JSON.parse(data);

    const roomIndex = rooms.findIndex((r) => r.number === roomNumber);

    if (roomIndex === -1) {
      return res.status(404).send({ error: "Room not found" });
    }

    const updatedRoom = { ...rooms[roomIndex], ...req.body };
    rooms[roomIndex] = updatedRoom;

    fs.writeFile
    (ROOMS_FILE, JSON.stringify(rooms, null, 2), (err) => {
      if (err) {
        return res.status(500).send({ error: "Error saving file" });
      }

      res.json(updatedRoom);
      console.log(updatedRoom);
    });
  });
});







/* TODO : ajout des routes d'affichag des chammbres */



  
app.listen(PORT, () => {
 console.log(`Server running at http://localhost:${PORT}`);
});