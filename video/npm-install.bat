@echo off
cd /d C:\Users\MikePC\Desktop\mike-expences\starter-for-react\video
npm install
echo === INSTALL DONE, exit code: %ERRORLEVEL% ===
dir node_modules\@remotion /b
