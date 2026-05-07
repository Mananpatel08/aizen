pipeline {
    agent any

    stages {

        stage('Pull Latest Code') {
            steps {
                dir('/var/www/html/aizen') {
                    sh 'git pull origin main'
                }
            }
        }

        stage('Build Containers') {
            steps {
                dir('/var/www/html/aizen') {
                    sh 'docker compose build'
                }
            }
        }

        stage('Deploy Containers') {
            steps {
                dir('/var/www/html/aizen') {
                    sh 'docker compose up -d'
                }
            }
        }

    }
}