#!/bin/bash

# Fonction pour dessiner le menu et gérer la navigation avec les flèches
draw_menu() {
    clear
    echo "Sélectionnez le type de fichier .env à générer :"
    echo ""
    for i in "${!OPTIONS[@]}"; do
        if [ "$i" -eq "$CURRENT_SELECTION" ]; then
            # Mettre en surbrillance l'option sélectionnée
            echo -e "> \e[32m${OPTIONS[$i]}\e[0m"
        else
            echo "  ${OPTIONS[$i]}"
        fi
    done
}

# Fonction pour lire les touches fléchées et la touche Entrée
read_input() {
    local key

    IFS= read -rsn1 key  # Lire un caractère sans l'afficher

    if [[ $key == $'\x1b' ]]; then
        read -rsn2 key  # Lire les deux caractères suivants (pour les flèches)
        key="$key"
    fi

    case "$key" in
        '[A')  # Flèche haut
            if [ "$CURRENT_SELECTION" -gt 0 ]; then
                CURRENT_SELECTION=$((CURRENT_SELECTION - 1))
            fi
            ;;
        '[B')  # Flèche bas
            if [ "$CURRENT_SELECTION" -lt $((${#OPTIONS[@]} - 1)) ]; then
                CURRENT_SELECTION=$((CURRENT_SELECTION + 1))
            fi
            ;;
        '')     # Touche Entrée
            SELECTED=${OPTIONS[$CURRENT_SELECTION]}
            return 0  # Indiquer qu'une sélection a été faite
            ;;
    esac

    return 1  # Indiquer qu'aucune sélection n'a été faite
}

# Variables du menu
OPTIONS=("Créer .env de developpement" "Créer .env exemple")
CURRENT_SELECTION=0

# Boucle principale du menu
while true; do
    draw_menu
    read_input
    if [ $? -eq 0 ]; then
        break  # Sortir de la boucle lorsque l'utilisateur appuie sur Entrée
    fi
done

# Définir le nom du fichier en fonction de la sélection
if [ "$SELECTED" == "Créer .env de developpement" ]; then
    ENV_FILE=".env"
elif [ "$SELECTED" == "Créer .env exemple" ]; then
    ENV_FILE=".env"
else
    echo "Option invalide."
    exit 1
fi

# Vérifier si le fichier existe déjà
if [ -f ./docker/"$ENV_FILE" ]; then
    echo "Le fichier $ENV_FILE existe déjà. Voulez-vous le remplacer ? (y/n)"
    read -r REPLY
    if [[ ! "$REPLY" =~ ^[Yy]$ ]]; then
        echo "Opération annulée."
        exit 1
    fi
fi

# Définir les variables d'environnement par défaut
if [ "$SELECTED" == "Créer .env de developpement" ]; then
    VARIABLES=$(cat <<EOL
# Variables d'environnement pour le développement

# Front End
FRONT_APP_ENV=development
FRONT_APP_DEBUG=true
FRONT_APP_URL=http://localhost:3000

# Back End
BACK_APP_ENV=development
BACK_APP_DEBUG=true
BACK_APP_URL=http://localhost:8080

# Base de Données
DB_HOST=database
DB_PORT=27017
DB_DATABASE=ma_base_de_donnees
DB_USERNAME=esgi
DB_PASSWORD=esgi

# DB WebViewer
WVDB_USERNAME=esgi
WVDB_PASSWORD=esgi

# API
API_KEY=VotreCléAPI
SECRET_KEY=VotreCléSecrète

EOL
)
elif [ "$SELECTED" == "Créer .env exemple" ]; then
    VARIABLES=$(cat <<EOL
# Variables d'environnement pour le développement

# Front End
FRONT_APP_ENV=exemple
FRONT_APP_DEBUG=true
FRONT_APP_URL=http://localhost:3000

# Back End
BACK_APP_ENV=exemple
BACK_APP_DEBUG=true
BACK_APP_URL=http://localhost:8080

# Base de Données
DB_HOST=database
DB_PORT=27017
DB_DATABASE=db_name
DB_USERNAME=change_me
DB_PASSWORD=change_me

# DB WebViewer
WVDB_USERNAME=change_me
WVDB_PASSWORD=change_me

# API
API_KEY=VotreCléAPI
SECRET_KEY=VotreCléSecrète
EOL
)
fi

# Écrire les variables d'environnement dans le fichier
echo "$VARIABLES" > ./docker/"$ENV_FILE"

echo "Le fichier $ENV_FILE a été généré avec succès."
