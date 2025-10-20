@echo off
color 0A
title Masque Pre-Anesthesique - Serveur de Developpement
cls
echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║   MASQUE DE CONSULTATION PRE-ANESTHESIQUE            ║
echo ║   Centre Diagnostic de Libreville                    ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo [INFO] Demarrage du serveur de developpement...
echo.
echo ┌────────────────────────────────────────────────────────┐
echo │ L'application sera accessible dans votre navigateur   │
echo │ des que le serveur sera pret.                         │
echo │                                                        │
echo │ L'URL sera affichee ci-dessous...                     │
echo └────────────────────────────────────────────────────────┘
echo.
echo ════════════════════════════════════════════════════════
echo.

npm run dev

echo.
echo ════════════════════════════════════════════════════════
echo.
echo [INFO] Le serveur a ete arrete.
echo.
pause





