@echo off

set classPath=

CALL :setClasspath
echo Classpath is set
goto :doneClasspath

:setClasspath
FOR %%c in ("*.jar") DO CALL :appendClasspath %%c

:appendClasspath
set classPath=%classPath%;%1
goto :eof

:doneClasspath

set classPath=%classPath%;..\classes

echo Classpath:
echo %classPath%
java -cp %classPath% com.hin.service.helper.CommandLineLuceneUpdator %1 %2 %3
