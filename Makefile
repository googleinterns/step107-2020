
deploy:
	mvn clean
	mvn package appengine:deploy
		
run:
	mvn clean
	mvn package appengine:run


