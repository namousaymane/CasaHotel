const apiUrl = "http://localhost:3000/credentials";

// Fonction pour récupérer les utilisateurs
async function fetchCredentials() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Échec de la récupération des utilisateurs");
    }
    const credentials = await response.json();

    // Vérification que la réponse est un tableau
    if (!Array.isArray(credentials)) {
      throw new Error("La réponse de l'API n'est pas un tableau d'utilisateurs.");
    }

    return credentials;
  } catch (error) {
    console.error("Erreur de récupération :", error);
    alert("Erreur de récupération des utilisateurs. Veuillez réessayer.");
    return [];
  }
}

// Fonction de connexion
document.getElementById("login-button").addEventListener("click", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Veuillez entrer un nom d'utilisateur et un mot de passe.");
    return;
  }

  try {
    const credentials = await fetchCredentials();

    // Recherche de l'utilisateur par username et password
    const user = credentials.find((user) => user.username === username && user.password === password);

    if (!user) {
      alert("Nom d'utilisateur ou mot de passe incorrect.");
      return;
    }

    // Connexion réussie
    alert("Connexion réussie!");
    window.location.href = "bookings.html";  // Redirige vers la page de réservations
  } catch (error) {
    console.error("Erreur de connexion :", error);
    alert("Erreur de connexion. Veuillez réessayer.");
  }
});
