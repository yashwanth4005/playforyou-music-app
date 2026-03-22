# Play for You Music Application

Play for You is a music application designed to provide a personalized listening experience tailored to your preferences.

## Table of Contents

- [Play for You Music Application](#play-for-you-music-application)
  - [About](#about)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Admin Module](#admin-module)

## About

Play for you is music application made from React and Springboot

#Fullstack Java Project

##Installation

#FRONTEND
To install and run the Play for You frontend with Vite, follow these steps:

1. Clone the repository: `https://github.com/Shriharsh07/PlayForYou-Music-Application.git`
2. Navigate to the project directory: `cd playforyou-frontend`
3. Install dependencies using npm or yarn:
   - If using npm: `npm install`
   - If using yarn: `yarn`
4. Start the development server:
   - If using npm: `npm run dev`
   - If using yarn: `yarn dev`
5. Open your browser and visit `http://localhost:3000` to view the Play for You application.

#BACKEND
To set up and run the Play for You backend with Spring Boot in Spring Tool Suite or Eclipse, follow these steps:

1. Clone the repository: `https://github.com/Shriharsh07/PlayForYou-Music-Application.git`
2. Open Spring Tool Suite or Eclipse IDE.
3. Navigate to `File -> Import -> Existing Maven Projects`.
4. Browse and select the backend folder of the cloned repository(`PlayForYouApp`).
5. Click "Finish" to import the backend project into your IDE.
6. Wait for the dependencies to be resolved and the project to be built.

## Configuration

Before running the backend, make sure to configure the database connection. 
You will need to have MySQL installed on your system. 
If you haven't installed MySQL yet, you can download it from the [official MySQL website](https://www.mysql.com/) 
and follow the installation instructions for your operating system.

Once MySQL is installed, you can proceed with configuring the database connection. 
You can usually find these configurations in the `application.properties` or `application.yml` file within the backend project.

**application.properties:**
```properties
spring.datasource.url=jdbc:mysql://localhost/your_db_name
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.profiles.active=dev
```

**application.yml:**
```properties
spring:
  datasource:
    url: jdbc:mysql://localhost/your_db_name
    username: your_username
    password: your_password
  jpa:
    hibernate:
      ddl-auto: update
  profiles:
    active: dev
```

## Running the Backend

To run the Spring Boot backend as a Java application, follow these steps:

1. Open your Spring Tool Suite (STS) or Eclipse IDE.
2. Navigate to the `PlayForYouApplication` class. This class typically contains the `main` method and is annotated with `@SpringBootApplication`.
3. Right-click on the `PlayForYouApplication` class.
4. Choose the "Run As" option from the context menu.
5. Select "Java Application" from the sub-menu.
This will start the Spring Boot application, and you should see logs in the console indicating that the application is starting.
By default, the application will run on `http://localhost:8080`.

## Testing the Backend

To verify that the backend is running correctly, you can test the RESTful endpoints using tools like Postman or curl. 
The base URL for the backend API will typically be `http://localhost:8080` unless configured otherwise.

### Admin Module

The admin module of Play for You allows administrators to manage the music library by adding new songs. Here's how to use the admin module:

1. Log in to the Play for You application with admin credentials.
2. Navigate to the admin dashboard.
3. Access the "Add Songs" feature.
4. Fill in the required information for the new song, including title, artist, album, genre, and upload the audio file.
5. After uploading the MP3 song file to GitHub, copy the link to the raw file.
6. Paste the raw file link in the designated field in the form.
7. Submit the form to add the song to the music library.
