const fs = require('fs');
const ExcelJS = require('exceljs');
const { log } = require('console');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

async function traitementDonnee(){
    const tableauDonneesTraitées = []
    const response = await fetch("https://random-data-api.com/api/v2/users?size=10")
    if (response.ok){
        const data = await response.json()
        data.forEach(element => {
            tableauDonneesTraitées.push({
                ville : element.address.city,
                nomRue : element.address.street_name,
                adresseRue : element.address.street_address,
                codePostale : element.address.zip_code,
                etat : element.address.state,
                pays : element.address.country,
                latitude : element.address.coordinates.lat,
                longitude : element.address.coordinates.lng,
                titre : element.employment.title,
                competence : element.employment.key_skill,
                numeroCarte : element.credit_card.cc_number
            })
        });
        return tableauDonneesTraitées
    }
    return tableauDonneesTraitées
}

async function exportJSON() {
    const donnees = await traitementDonnee();
    fs.writeFileSync('donnees.json', JSON.stringify(donnees, null, 2), 'utf8');
    console.log('Le fichier JSON a été créé avec succès!');
}

// Fonction d'exportation en CSV
async function exportCSV() {
    const donnees = await traitementDonnee();

    const csvWriter = createCsvWriter({
        path: 'donnees.csv',
        header: [
            { id: 'ville', title: 'Ville' },
            { id: 'nomRue', title: 'Nom Rue' },
            { id: 'adresseRue', title: 'Adresse Rue' },
            { id: 'codePostale', title: 'Code Postale' },
            { id: 'etat', title: 'État' },
            { id: 'pays', title: 'Pays' },
            { id: 'latitude', title: 'Latitude' },
            { id: 'longitude', title: 'Longitude' },
            { id: 'titre', title: 'Titre Emploi' },
            { id: 'competence', title: 'Compétence' },
            { id: 'numeroCarte', title: 'Numéro Carte Crédit' } // Correspondance correcte avec 'numeroCarte'
        ]
    });

    await csvWriter.writeRecords(donnees);
    console.log('Le fichier CSV a été créé avec succès!');
}

// Fonction d'exportation en Excel (en option, si vous voulez exporter aussi en Excel)
async function exportExcel() {
    const donnees = await traitementDonnee();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Données');

    // Correspondance exacte des clés avec celles de vos données
    worksheet.columns = [
        { header: 'Ville', key: 'ville' },
        { header: 'Nom Rue', key: 'nomRue' },
        { header: 'Adresse Rue', key: 'adresseRue' },
        { header: 'Code Postale', key: 'codePostale' },
        { header: 'Etat', key: 'etat' },
        { header: 'Pays', key: 'pays' },
        { header: 'Latitude', key: 'latitude' },
        { header: 'Longitude', key: 'longitude' },
        { header: 'Titre Emploi', key: 'titre' },
        { header: 'Compétence', key: 'competence' },
        { header: 'Numéro Carte Crédit', key: 'numeroCarte' }
    ];

    // Ajout des lignes de données dans le worksheet
    donnees.forEach(donnee => {
        worksheet.addRow(donnee);
    });

    // Écriture du fichier Excel
    await workbook.xlsx.writeFile('donnees.xlsx');
    console.log('Le fichier Excel a été créé avec succès!');
}




const format = process.argv[2]; // Récupère le troisième argument (ex: 'json' ou 'csv')

// En fonction de l'argument, exporter dans le format demandé
if (format === 'json') {
    exportJSON();
} else if (format === 'csv') {
    exportCSV();
} else if (format === 'excel') {
    exportExcel()
}else{
    console.log('Veuillez spécifier un format valide: "json" ou "csv" ou "excel".');
}

