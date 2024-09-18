#!bin/sh

cd /app

if [ -n "$(find "/app/" -maxdepth 0 -type d -empty 2>/dev/null)" ]; then
    echo "Aucun projet setup"

    npm create vite@latest -- --template vue-ts frontEnd

    cd frontEnd

    npm install
else
    echo "Projet Trouvé"
    
    cd frontEnd

    npm install
fi

npm run dev -- --host

exec "/bin/sh"