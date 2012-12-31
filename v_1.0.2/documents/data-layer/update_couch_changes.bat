@echo off

set dest=http://172.25.250.165:4895
rem set dest=http://172.25.250.98:5984

set sourceDir=E:\icthealth-projects\hin-eternity\documents\data-layer\couch_updates

echo Compressing JS ...

CALL compress-js.bat %sourceDir%\message-scripts 1
CALL compress-js.bat %sourceDir%\form-scripts 2
CALL compress-js.bat %sourceDir%\process-scripts 3

echo Done Compressing JS ...

FOR %%c in (tmp-work-folder\*.js1) DO curl -i -X POST -H "Content-Type: application/json" -d @%%c "%dest%/messagestore/_design/hl7store/_update/postDoc/JS_%%~nc?objecttype=meta&userid=common"
FOR %%c in (tmp-work-folder\*.js2) DO curl -i -X POST -H "Content-Type: application/json" -d @%%c "%dest%/messagestore/_design/hl7store/_update/postDoc/FS_%%~nc?objecttype=meta&userid=common"
FOR %%c in (tmp-work-folder\*.js3) DO curl -i -X POST -H "Content-Type: application/json" -d @%%c "%dest%/messagestore/_design/hl7store/_update/postDoc/PS_%%~nc?objecttype=meta&userid=common"

echo Done uploading JS ...

FOR %%c in (%sourceDir%\message-configuration\*.xml) DO curl -i -X POST -H "Content-Type: application/xml" -d @%%c "%dest%/messagestore/_design/hl7store/_update/postDoc/%%~nc?objecttype=meta&userid=common"

echo Done message configuration update ...

FOR %%c in (%sourceDir%\message-forms\*.html) DO curl -i -X POST -H "Content-Type: application/json" -d @%%c "%dest%/messagestore/_design/hl7store/_update/postDoc/FM_%%~nc?objecttype=meta&userid=common"

echo Done uploading Forms ...

echo Clearing tmp-work-folder
del tmp-work-folder\*.js1
del tmp-work-folder\*.js2
del tmp-work-folder\*.js3

del /y %sourceDir%\message-scripts\*.*
del /y %sourceDir%\form-scripts\*.*
del /y %sourceDir%\process-scripts\*.*

echo Finished.

@echo on

