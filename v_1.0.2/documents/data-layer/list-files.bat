@echo off
set sourceDir=E:\hin-eternity\source\24_08_2012\source\hin-web\src\main\webapp

FOR %%c in (%sourceDir%\message-configuration\*.xml) DO echo %%~nc
