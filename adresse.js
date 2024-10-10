const prompt = require('prompt-sync')();

(async () => {
    // Demande de l'adresse à l'utilisateur
    const adresse = prompt("Votre adresse : ");

    // Encodage de l'adresse pour qu'elle corresponde au format d'URL
    const adresseEncoded = encodeURIComponent(adresse);

    try {
        // Effectuer la requête vers l'API
        const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${adresseEncoded}`);

        // Vérification si la réponse est OK
        if (response.ok) {
            // Récupération des données au format JSON
            const data = await response.json();

            // Vérification si des résultats sont trouvés
            if (data.features && data.features.length > 0) {
                // Boucle sur les résultats et affichage des propriétés
                data.features.forEach(feature => {
                    console.log("Adresse complète : " + feature.properties.label);
                    console.log("Coordonnées : " + feature.geometry.coordinates);
                    console.log("Ville : " + feature.properties.city);
                    console.log("Code postal : " + feature.properties.postcode);
                    console.log("----------------------------------");
                });
            } else {
                console.log("Aucune adresse trouvée pour cette requête.");
            }
        } else {
            console.error("Erreur lors de la requête : " + response.status);
        }
    } catch (error) {
        console.error("Erreur réseau ou autre : ", error);
    }
})();
