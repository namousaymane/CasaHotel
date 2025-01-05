const apiUrl = "http://localhost:3000/credentials";

// Récupère les utilisateurs
async function fetchCredentials() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Échec de la récupération des utilisateurs");
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur de récupération :", error);
    alert("Erreur de récupération des utilisateurs. Veuillez réessayer.");
    return [];
  }
}

// Listner pour ajouter un nouvel admin
document.getElementById("add-admin").addEventListener("click", async (event) => {
  event.preventDefault();

  const users = await fetchCredentials();

  const newUsername = document.getElementById("username").value.trim();
  const newPassword = document.getElementById("password").value.trim();

  if (!newUsername || !newPassword) {
    alert("Veuillez entrer un nom d'utilisateur et un mot de passe.");
    return;
  }

  const existingUser = users.find((user) => user.username === newUsername);
  if (existingUser) {
    alert("L'utilisateur existe déjà. Veuillez choisir un autre nom d'utilisateur.");
    return;
  }

  const newUser = { username: newUsername, password: newPassword };
  users.push(newUser);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(users),
    });
    if (!response.ok) {
      throw new Error("Erreur lors de l'ajout de l'utilisateur");
    }
    alert("Utilisateur ajouté avec succès!");
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'utilisateur :", error);
    alert("Erreur lors de l'ajout de l'utilisateur. Veuillez réessayer.");
  }
});
