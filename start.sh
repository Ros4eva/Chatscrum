#!/bin/bash
# Set environment using EXPORT ENVIRONMENT == "int" or "stage"
/bin/pip3.6 install -r requirements.txt
#echo "Running test for $ENVIRONMENT"
#sed -i "s/environment/$ENVIRONMENT/g" settings.ini
echo "Modified url to http://54.185.254.239:5100/"
pytest -n 4 --html=report-$ENVIRONMENT.html --self-contained-html -q --disable-warnings --tb=line -s || true
echo "Sending mail after test"
/bin/python3.6 send_mail.py $ENVIRONMENT
echo "Mail Sent"


