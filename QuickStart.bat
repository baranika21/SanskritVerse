@echo off
title SanskritVerse - AI Sanskrit Learning & Computational Linguistics Lab
echo ======================================================================
echo    OM SANSKRITVERSE -- AI SANSKRIT & COMPUTATIONAL LINGUISTICS LAB
echo ======================================================================
echo.
echo Starting SanskritVerse Launcher...
if exist SanskritVerse.exe (
    start SanskritVerse.exe
) else (
    start http://localhost:3000
    cd backend && start cmd /c "npm run dev"
    cd ../frontend && start cmd /c "npm run dev"
)
