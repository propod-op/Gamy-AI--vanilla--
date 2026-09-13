#!/bin/bash
# Synchronisation du projet avec xampp
# https://doc.ubuntu-fr.org/tutoriel/script_shell

xampp_htmlfolder="/opt/lampp/htdocs/gamy"
echo "$xampp_htmlfolder"

# Option recommandée (avec rsync)
rsync -av ./ "$xampp_htmlfolder/"