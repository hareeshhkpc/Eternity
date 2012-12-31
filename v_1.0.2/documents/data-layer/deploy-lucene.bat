@echo off

set currentDir=%~dp0

set sourceDir=E:\hin-eternity\source\DevBuild\source\hin-web\target\hin-web\WEB-INF\lib

cd %sourceDir%

call update-lucene.bat 669eeb90-9250-411f-90e5-f9ca9a6e78f2 Role doctor
call update-lucene.bat d606de4e-abe6-44b7-b85c-7157b3193f31 Role doctor
call update-lucene.bat 3b72e087-b967-4989-82c2-2c3cbb57cc14 Role doctor
call update-lucene.bat 0d001cc1-5ad2-4270-923c-af349db4784c Role doctor

echo Update finished.

cd %currentDir%


