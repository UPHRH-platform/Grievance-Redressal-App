pipeline {
    agent any
    
    environment {
        GCR_REGISTRY = "asia.gcr.io/upsmf-368011" 
        IMAGE_NAME = "grievance-fe-uat"
        BRANCH_NAME = "uat-release-1.0" 
		IMAGE_TAG = "1.0"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'uat-release-1.0', url: 'https://github.com/UPHRH-platform/Grievance-Redressal-App.git'
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
		            def dockerTag = "${IMAGE_TAG}-${env.BUILD_NUMBER}"	
		            def dockerImage = docker.build("${GCR_REGISTRY}/${IMAGE_NAME}:${dockerTag}")	
                }
            }
        }		
		
	}
}
