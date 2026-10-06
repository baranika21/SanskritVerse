pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Build') {
            steps {
                bat '''
                    cd backend
                    npm ci
                    npm run build
                '''
            }
        }

        stage('Frontend Build') {
            steps {
                bat '''
                    cd frontend
                    npm ci
                    npm run build
                '''
            }
        }

        stage('Docker Build') {
            steps {
                bat '''
                    docker build -t sanskritverse-backend:latest ./backend
                    docker build -t sanskritverse-frontend:latest ./frontend
                '''
            }
        }

        stage('Result') {
            steps {
                echo 'SanskritVerse CI Pipeline completed successfully!'
            }
        }
    }

    post {
        success {
            echo 'BUILD SUCCESSFUL - Application validated and Docker images created.'
        }

        failure {
            echo 'BUILD FAILED - Check the failed stage in Jenkins.'
        }
    }
}