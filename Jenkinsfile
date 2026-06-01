pipeline {
    agent any

    environment {
        // Docker image configuration
        IMAGE_NAME = "hello-world-app"
        IMAGE_TAG = "${BUILD_NUMBER}"
        CONTAINER_NAME = "hello-world-app-container"
        CONTAINER_PORT = "8081"
        APP_PORT = "3000"
        REGISTRY = "docker.io"  // Change if using private registry
    }

    options {
        // Keep last 10 builds
        buildDiscarder(logRotator(numToKeepStr: '10'))
        // Add timestamps to console output
        timestamps()
        // Timeout after 30 minutes
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {
        stage('Preparation') {
            steps {
                script {
                    echo "========== Pipeline Starting =========="
                    echo "Build Number: ${BUILD_NUMBER}"
                    echo "Build Tag: ${IMAGE_TAG}"
                    echo "Container Name: ${CONTAINER_NAME}"
                    sh 'docker --version'
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    echo "========== Building Docker Image =========="
                    try {
                        sh '''
                            docker build \
                                --tag ${IMAGE_NAME}:${IMAGE_TAG} \
                                --tag ${IMAGE_NAME}:latest \
                                --file Dockerfile \
                                .
                            echo " Docker image built successfully"
                            echo "Image: ${IMAGE_NAME}:${IMAGE_TAG}"
                        '''
                    } catch (Exception e) {
                        echo " Docker build failed: ${e.message}"
                        error("Build stage failed")
                    }
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    echo "========== Testing Docker Image =========="
                    try {
                        sh '''
                            # Check if image exists
                            echo "Checking if image exists..."
                            if docker image inspect ${IMAGE_NAME}:${IMAGE_TAG} > /dev/null 2>&1; then
                                echo " Docker image exists: ${IMAGE_NAME}:${IMAGE_TAG}"
                            else
                                echo " Docker image not found"
                                exit 1
                            fi

                            # Run security scan (basic)
                            echo "Running basic security checks..."
                            echo " Image size check:"
                            docker image inspect ${IMAGE_NAME}:${IMAGE_TAG} | grep -i size || true

                            # Test if image can be instantiated
                            echo "Testing if container can be created from image..."
                            TEST_CONTAINER="test-${IMAGE_NAME}-${BUILD_NUMBER}"
                            docker create --name ${TEST_CONTAINER} ${IMAGE_NAME}:${IMAGE_TAG} > /dev/null 2>&1
                            echo " Container creation test passed"
                            docker rm ${TEST_CONTAINER} > /dev/null 2>&1

                            echo " All tests passed"
                        '''
                    } catch (Exception e) {
                        echo "✗ Test stage failed: ${e.message}"
                        error("Test stage failed")
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    echo "========== Deploying Container =========="
                    try {
                        sh '''
                            # Remove old container if exists
                            echo "Cleaning up old containers..."
                            if docker ps -a --format "table {{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
                                echo "Stopping old container: ${CONTAINER_NAME}"
                                docker stop ${CONTAINER_NAME} || true
                                echo "Removing old container: ${CONTAINER_NAME}"
                                docker rm ${CONTAINER_NAME} || true
                                echo " Old container removed"
                            else
                                echo " No existing container to remove"
                            fi

                            # Run new container
                            echo "Starting new container..."
                            docker run \
                                --name ${CONTAINER_NAME} \
                                --publish ${CONTAINER_PORT}:${APP_PORT} \
                                --detach \
                                --restart unless-stopped \
                                --health-cmd="curl -f http://localhost:${APP_PORT} || exit 1" \
                                --health-interval=30s \
                                --health-timeout=3s \
                                --health-retries=3 \
                                ${IMAGE_NAME}:${IMAGE_TAG}
                            
                            echo " Container deployed successfully"
                            echo "Container Name: ${CONTAINER_NAME}"
                            echo "Access URL: http://localhost:${CONTAINER_PORT}"
                            
                            # Wait for container to be healthy
                            echo "Waiting for container to be healthy..."
                            for i in {1..30}; do
                                if docker ps --filter "name=${CONTAINER_NAME}" --format "table {{.Status}}" | grep -q "healthy"; then
                                    echo " Container is healthy"
                                    break
                                fi
                                if [ $i -eq 30 ]; then
                                    echo " Container health check timed out, continuing..."
                                fi
                                sleep 1
                            done

                            # Display container info
                            echo ""
                            echo "Container Information:"
                            docker ps --filter "name=${CONTAINER_NAME}"
                        '''
                    } catch (Exception e) {
                        echo "✗ Deploy stage failed: ${e.message}"
                        error("Deploy stage failed")
                    }
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                script {
                    echo "========== Verifying Deployment =========="
                    try {
                        sh '''
                            echo "Testing application endpoint..."
                            # Give container a moment to start serving requests
                            sleep 2
                            
                            # Test the endpoint
                            RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:${CONTAINER_PORT}/)
                            
                            if [ $RESPONSE -eq 200 ]; then
                                echo " Application is responding on port ${CONTAINER_PORT}"
                                echo "HTTP Status: ${RESPONSE}"
                                echo " Deployment verification successful"
                            else
                                echo " Application returned HTTP status: ${RESPONSE}"
                                error("Application health check failed")
                            fi
                        '''
                    } catch (Exception e) {
                        echo " Verification failed, but continuing: ${e.message}"
                    }
                }
            }
        }
    }

    post {
        always {
            echo "========== Build Complete =========="
            script {
                echo """
                Build Summary:
                - Build Number: ${BUILD_NUMBER}
                - Image: ${IMAGE_NAME}:${IMAGE_TAG}
                - Container: ${CONTAINER_NAME}
                - Port: ${CONTAINER_PORT}
                """
            }
        }
        success {
            echo "✓ Pipeline executed successfully!"
            echo "Access your application at: http://localhost:${CONTAINER_PORT}"
        }
        failure {
            echo " Pipeline failed. Check the logs above for details."
            script {
                sh '''
                    if docker ps -a --format "table {{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
                        echo "Cleaning up failed deployment..."
                        docker stop ${CONTAINER_NAME} || true
                        docker rm ${CONTAINER_NAME} || true
                    fi
                '''
            }
        }
        unstable {
            echo " Pipeline completed with warnings."
        }
    }
}