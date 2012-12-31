@echo off

set cassandraDir=D:\icthealth_projects\hin-eternity-08-09-2012\test-deploy\softwares\apache-cassandra-1.1.3
set cassanraIP=localhost
set cassandraPort=9160
set dbScriptDir=D:\icthealth_projects\hin-eternity-08-09-2012\documents\Scripts

set cassandraDir="%cassandraDir%\bin"

set currentDir=%~dp0

cd %cassandraDir%

cassandra-cli.bat --host %cassanraIP% --port %cassandraPort% -f "%dbScriptDir%\CassandraInitialDeploymentScript.txt"

cd %currentDir%

echo Cassandra DB is deployed.

