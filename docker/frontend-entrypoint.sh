#!bin/sh

cd /app

if [ -n "$(find "/app/" -maxdepth 0 -type d -empty 2>/dev/null)" ]; then
    echo "Aucun projet setup"

    npm create vite@latest -- --template vue-ts frontEnd

    npm install --force
else
    echo "Projet Trouvé"
    
    npm install --force
fi

npm run dev -- --host

exec "/bin/sh"