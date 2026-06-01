# Hello World App - Jenkins CI/CD Pipeline

A complete DevOps project demonstrating a Jenkins CI/CD pipeline for building, testing, and deploying a Node.js web application in Docker containers.

## Project Structure

```
.
├── app.js                 # Node.js application
├── package.json          # Node.js dependencies
├── Dockerfile            # Docker image definition
├── Jenkinsfile           # Jenkins declarative pipeline
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## Prerequisites

### Local Requirements
- Git installed
- GitHub account
- Docker (optional, for local testing)
- Node.js (optional, for local development)

### Jenkins Requirements
- Jenkins running in Docker container on Windows host
- Jenkins user with `sudo` privileges (NOPASSWD configured)
- Docker installed inside Jenkins container
- Git plugin installed in Jenkins
- No additional plugins required (basic Jenkins setup is sufficient)

## Setup Instructions

### Step 1: Initialize Local Repository

```bash
# Create a new directory
mkdir hello-world-jenkins-app
cd hello-world-jenkins-app

# Initialize git repository
git init

# Copy all files (app.js, package.json, Dockerfile, Jenkinsfile, .gitignore)
# to this directory

# Configure git (if not already configured)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: Add Hello World app with Jenkins pipeline"
```

### Step 2: Push to GitHub

```bash
# Create a new repository on GitHub (https://github.com/new)
# Name it: hello-world-jenkins-app
# Do NOT initialize with README, .gitignore, or license

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/hello-world-jenkins-app.git
git branch -M main
git push -u origin main
```

**Get Your Repository URL:**
- GitHub Repository: `https://github.com/YOUR_USERNAME/hello-world-jenkins-app`

### Step 3: Configure Jenkins Pipeline Job

#### 3.1 Create a New Pipeline Job in Jenkins

1. Go to Jenkins Dashboard
2. Click **"New Item"** (top left)
3. Enter job name: `Hello-World-CI-CD-Pipeline`
4. Select **"Pipeline"** and click **OK**

#### 3.2 Configure the Pipeline

1. **General Tab:**
   - Check: "GitHub project"
   - Enter Project URL: `https://github.com/YOUR_USERNAME/hello-world-jenkins-app`

2. **Build Triggers Tab:**
   - Check: "GitHub hook trigger for GITScm polling"
   - Or manually trigger builds if webhook is not configured

3. **Pipeline Tab:**
   - **Definition:** Select "Pipeline script from SCM"
   - **SCM:** Select "Git"
   - **Repository URL:** `https://github.com/YOUR_USERNAME/hello-world-jenkins-app.git`
   - **Credentials:** (optional if public repo)
   - **Branch Specifier:** `*/main`
   - **Script Path:** `Jenkinsfile` (default)

4. Click **Save**

### Step 4: Trigger the Pipeline

**Option A: Manual Trigger**
1. Go to the job in Jenkins
2. Click **"Build Now"**
3. Monitor progress in **"Build History"**

**Option B: GitHub Webhook (Automatic)**

1. In your GitHub repository:
   - Go to **Settings → Webhooks**
   - Click **"Add webhook"**
   - Payload URL: `http://YOUR_JENKINS_URL/github-webhook/`
   - Event: Select "Push events"
   - Click **"Add webhook"**

2. Now every push to `main` triggers a build automatically

### Step 5: View Pipeline Execution

1. Click on the build number (e.g., `#1`)
2. Click **"Console Output"** to see live logs
3. Monitor the stages:
   - ✓ Preparation
   - ✓ Build (Docker image creation)
   - ✓ Test (Image validation)
   - ✓ Deploy (Container launch)
   - ✓ Verify Deployment (Health check)

## Pipeline Stages Explained

### Stage 1: Preparation
- Displays build information
- Verifies Docker is available

### Stage 2: Build
- Builds Docker image from Dockerfile
- Tags image with build number
- Creates two tags: `latest` and `${BUILD_NUMBER}`

### Stage 3: Test
- Verifies image exists
- Tests if container can be created from the image
- Performs basic security checks

### Stage 4: Deploy
- Stops and removes any old running container
- Launches new container on port 8081 (mapped to 3000 inside)
- Configures health checks
- Sets restart policy to "unless-stopped"

### Stage 5: Verify Deployment
- Tests application endpoint with curl
- Confirms HTTP 200 response

## Accessing the Application

After successful deployment:

```
URL: http://localhost:8081
```

Or from Windows host if Jenkins container is on network:
```
URL: http://jenkins-container-ip:8081
```

You should see a styled "Hello World" page with:
- Application name
- Container hostname
- Current timestamp
- Node.js version

## Common Commands

### Check Running Container

```bash
# SSH into Jenkins container first
docker exec -it jenkins-container-name bash

# List running containers
sudo docker ps

# View container logs
sudo docker logs hello-world-app-container

# Access container shell
sudo docker exec -it hello-world-app-container sh
```

### Manual Testing (Inside Jenkins Container)

```bash
# Build image manually
sudo docker build --tag hello-world-app:test .

# Run container manually
sudo docker run --name test-container -p 9000:3000 -d hello-world-app:test

# Test endpoint
curl http://localhost:9000

# Stop container
sudo docker stop test-container
sudo docker rm test-container
```

## Troubleshooting

### Issue: "docker: command not found"
**Solution:** Docker not installed in Jenkins container or PATH issue
```bash
# Inside Jenkins container
which docker
docker --version
```

### Issue: "Permission denied" for docker commands
**Solution:** Jenkins user needs docker group permissions or sudo access
```bash
# Verify sudo works
sudo docker ps
# If NOPASSWD is configured, this should work
```

### Issue: Container fails to start
**Solution:** Check logs
```bash
sudo docker logs hello-world-app-container
```

### Issue: "Port already in use"
**Solution:** Another container is using port 8081
```bash
# Find process using port
sudo docker ps | grep 8081
# Kill the container
sudo docker stop <container-id>
```

### Issue: "Cannot reach application"
**Solution:** Ensure container is healthy
```bash
sudo docker ps
# Check STATUS column - should show "Up ... (healthy)"
# If not healthy, wait or check logs
sudo docker logs hello-world-app-container
```

## Customization

### Change Deployment Port
Edit `Jenkinsfile` line with:
```groovy
CONTAINER_PORT = "8081"
```
Change to your desired port (e.g., "8080", "9000")

### Change Application Port
Edit `app.js` line:
```javascript
const port = 3000;
```
Also update `Dockerfile` EXPOSE and `Jenkinsfile` APP_PORT

### Use Private Docker Registry
Edit `Jenkinsfile`:
```groovy
REGISTRY = "your-registry.com"
// And add credentials configuration
```

### Add More Tests
Edit `Jenkinsfile` Test stage to add:
- Unit tests
- Integration tests
- Code quality checks
- Security scanning

## Project File Descriptions

| File | Purpose |
|------|---------|
| `app.js` | Node.js web server (runs on port 3000) |
| `package.json` | Node.js dependencies and scripts |
| `Dockerfile` | Instructions to build Docker image |
| `Jenkinsfile` | Jenkins pipeline configuration |
| `.gitignore` | Files to exclude from git |
| `README.md` | This documentation |

## Pipeline Workflow Diagram

```
GitHub Commit
     ↓
GitHub Webhook (optional)
     ↓
Jenkins Trigger
     ↓
[Preparation] ← Display build info
     ↓
[Build] ← Docker build
     ↓
[Test] ← Image validation
     ↓
[Deploy] ← Container launch
     ↓
[Verify] ← Health check
     ↓
Success/Failure
     ↓
Post Actions (logs, cleanup if failed)
```

## Environment Variables

The Jenkinsfile uses these environment variables:

| Variable | Default | Purpose |
|----------|---------|---------|
| `IMAGE_NAME` | `hello-world-app` | Docker image name |
| `IMAGE_TAG` | `${BUILD_NUMBER}` | Docker image tag (build number) |
| `CONTAINER_NAME` | `hello-world-app-container` | Running container name |
| `CONTAINER_PORT` | `8081` | Port exposed on host |
| `APP_PORT` | `3000` | Port inside container |
| `REGISTRY` | `docker.io` | Docker registry |

## Security Considerations

1. **Docker Daemon Access:** Jenkins user has sudo access to docker
2. **Credentials:** No hardcoded credentials in code
3. **Health Checks:** Container includes health check endpoint
4. **Restart Policy:** Container restarts automatically on failure
5. **Image Cleanup:** Old containers are removed before deployment

## Next Steps

### To Enhance This Pipeline:

1. **Add Unit Tests:**
   ```javascript
   // Add test files to app.js
   ```

2. **Add Code Quality Checks:**
   - ESLint for JavaScript
   - SonarQube integration

3. **Add Artifact Management:**
   - Push image to Docker Registry
   - Archive build logs

4. **Add Multiple Environments:**
   - Development
   - Staging
   - Production

5. **Add Notifications:**
   - Email on failure
   - Slack integration

6. **Add Performance Testing:**
   - Load testing
   - Performance baselines

## Support & Documentation

- Jenkins Documentation: https://www.jenkins.io/doc/
- Docker Documentation: https://docs.docker.com/
- GitHub CI/CD: https://docs.github.com/en/actions
- Node.js: https://nodejs.org/docs/

## License

MIT

## Author

DevOps Engineer
