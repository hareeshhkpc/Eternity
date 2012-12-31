@echo off

set dest=http://172.25.250.96:5984111

set sourceDir=E:\ict-projects\hin-eternity\source\hin-web\src\main\webapp

echo Compressing JS ...

CALL compress-js.bat %sourceDir%\message-scripts 1
CALL compress-js.bat %sourceDir%\form-scripts 2

echo Done Compressing JS ...




echo Finished.

@echo on

