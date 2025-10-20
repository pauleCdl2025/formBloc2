@echo off
echo ========================================
echo Installation du Masque Pre-Anesthesique
echo Centre Diagnostic de Libreville
echo ========================================
echo.

echo [1/3] Verification de Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Node.js n'est pas installe!
    echo Veuillez telecharger et installer Node.js depuis https://nodejs.org
    pause
    exit /b 1
)
echo Node.js detecte: 
node --version
echo.

echo [2/3] Installation des dependances...
echo Cela peut prendre quelques minutes...
call npm install
if errorlevel 1 (
    echo ERREUR lors de l'installation des dependances!
    pause
    exit /b 1
)
echo.

echo [3/3] Installation terminee avec succes!
echo.
echo ========================================
echo Pour lancer l'application:
echo   npm run dev
echo.
echo L'application sera accessible sur:
echo   http://localhost:5173
echo ========================================
echo.
pause





