@echo off
cd /d C:\Users\MikePC\Desktop\mike-expences\starter-for-react\video
echo Starting Remotion render...
node_modules\.bin\remotion.cmd render AppDemo out/demo.mp4
echo === RENDER DONE, exit code: %ERRORLEVEL% ===
