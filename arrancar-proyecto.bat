@echo off
REM Iniciar MongoDB
start cmd.exe /k "cd /d C:\Program Files\MongoDB\Server\7.0\bin && mongod.exe --dbpath C:\data\db"

REM Iniciar la aplicación Node.js
start cmd.exe /k "cd /d C:\Users\usuario\Desktop\CURSOS\NODEJS\api-res-red-social && npm start"
