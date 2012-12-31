#dest="http://localhost:5984"
dest="http://skullkey:house4hackp4s5@openpowerwatch.iriscouch.com"
curl -i -X DELETE $dest/messagestore/
cd hl7store
couchapp push . $dest/messagestore
cd ..
curl -i -X POST -H 'Content-Type: application/xml' -d @PRPA_IN203000HT04.xml "$dest/messagestore/_design/hl7store/_update/postDoc/PRPA_IN203000HT04?objecttype=meta&userid=common"
curl -i -X POST -H 'Content-Type: application/xml' -d @SMOTest_load1.xml "$dest/messagestore/_design/hl7store/_update/postDoc/SMOTest_load1?objecttype=smo&userid=test"
curl -i -X POST -H 'Content-Type: application/xml' -d @SMOTest_load_invalid.xml "$dest/messagestore/_design/hl7store/_update/postDoc/SMOTest_load_invalid?objecttype=smo&userid=test"
curl -i -X POST -H 'Content-Type: application/xml' -d @POCD_MT000040HT01.xml "$dest/messagestore/_design/hl7store/_update/postDoc/POCD_MT000040HT01?objecttype=meta&userid=common"
curl -i -X POST -H 'Content-Type: application/xml' -d @PRPA_MT410001HT02.xml "$dest/messagestore/_design/hl7store/_update/postDoc/PRPA_MT410001HT02?objecttype=meta&userid=common"
curl -i -X POST -H 'Content-Type: application/xml' -d @PRPA_MT201000HT03.xml "$dest/messagestore/_design/hl7store/_update/postDoc/PRPA_MT201000HT03?objecttype=meta&userid=common"

curl -i -X POST -H 'Content-Type: application/json' -d @jsoncontent.json "$dest/messagestore/_design/hl7store/_update/postDoc/json_test?objecttype=meta&userid=common"
curl -i -X POST -H 'Content-Type: application/xml' -d @xmlcontent.xml "$dest/messagestore/_design/hl7store/_update/postDoc/xml_test?objecttype=meta&userid=common"
curl -i -X POST -H 'Content-Type: application/json' -d @jsoncontent.json "$dest/messagestore/_design/hl7store/_update/postDoc/json_test?objecttype=smo&userid=test"
