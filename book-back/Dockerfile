FROM openjdk:17.0.9-jdk-alpine

WORKDIR /app
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT [ "java", "-Dspring.profiles.active=prod", "-jar", "app.jar"]