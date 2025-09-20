@echo off
echo Instalando dependencias do Python...
pip install --upgrade pip
pip install -r requirements.txt
echo.
echo Instalacao concluida!
echo.
echo Para executar o servidor:
echo python app.py
pause
