@echo off

CALL :processDir %1 %2
goto :doneCompress

:processDir
FOR %%c in (%1\*.js) DO CALL  :compressjs "%%c" %%~nc %2
goto :eof

:compressjs
java -jar js-compress\yuicompressor-2.4.7.jar --type js --line-break -1 --nomunge --disable-optimizations -o tmp-work-folder\%2.js%3 %1
echo Compressed %1 to tmp-work-folder\%2.js%3
goto :eof 

:doneCompress
echo Done.

@echo on