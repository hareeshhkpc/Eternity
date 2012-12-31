set adaptorDir=E:\icthealth-projects\hin-eternity\documents\data-layer\hl7adapter\couchdb\hl7store
set dest=http://172.25.250.165:4895

curl -i -X DELETE %dest%/messagestore/

couchapp push %adaptorDir% %dest%/messagestore
