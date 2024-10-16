#!bin/sh

cd /app

if [ -n "$(find "/app/" -maxdepth 0 -type d -empty 2>/dev/null)" ]; then
    echo "Aucun projet setup"

    echo "Veuillez contactez Léo, vite !"
    exit
else
    echo "Projet Trouvé"

    npm install
fi

npm run dev

exec "/bin/sh"