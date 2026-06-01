# CI-CD-Pipeline-Application

A complete DevOps project demonstrating a Jenkins CI/CD pipeline for building, testing, and deploying a Node.js web application in Docker containers.

## Project Structure

```text
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
- Docker-in-Docker sidecar container (jenkins-docker) configured
- Docker installed inside Jenkins container
- Git plugin installed in Jenkins
- No additional plugins required (basic Jenkins setup is sufficient)


## Setup Instructions

### Step 1: Initialize Local Repository

```bash
# Create a new directory
mkdir Jenkins-CI-CD-Pipeline-Application
cd Jenkins-CI-CD-Pipeline-Application
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
git commit -m "Initial commit: Add  Pipeline with Jenkins pipeline"
```

### Step 2: Push to GitHub

```bash
# Create a new repository on GitHub (https://github.com/new)
# Enter job name: Pipeline-CI-CD-App
# Do NOT initialize with README, .gitignore, or license

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/Jenkins-CI-CD-Pipeline-Application
git branch -M main
git push -u origin main
```

**Get Your Repository URL:**
- GitHub Repository: `https://github.com/YOUR_USERNAME/Jenkins-CI-CD-Pipeline-Application`

### Step 3: Configure Jenkins Pipeline Job

#### 3.1 Create a New Pipeline Job in Jenkins

1. Go to Jenkins Dashboard
2. Click **"New Item"** (top left)
3. Enter job name: Pipeline-CI-CD-App
4. Select **"Pipeline"** and click **OK**

#### 3.2 Configure the Pipeline

1. **General Tab:**
   - Check: "GitHub project"
   - Enter Project URL: `https://github.com/YOUR_USERNAME/Jenkins-CI-CD-Pipeline-Application`

2. **Build Triggers Tab:**
   - Check: "GitHub hook trigger for GITScm polling"
   - Or manually trigger builds if webhook is not configured

3. **Pipeline Tab:**
   - **Definition:** Select "Pipeline script from SCM"
   - **SCM:** Select "Git"
   - **Repository URL:** `https://github.com/YOUR_USERNAME/Jenkins-CI-CD-Pipeline-Application`
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
URL: http://localhost:8084
```

Or from Windows host if Jenkins container is on network:
```
URL: http://jenkins-container-ip:8084
```

You should see a styled dashboard page with:
- CI-CD-Pipeline-Application title
- Container hostname
- Current timestamp
- Node.js version


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
| `IMAGE_NAME` | `pipleline-CI-CD-app` | Docker image name |
| `IMAGE_TAG` | `${BUILD_NUMBER}` | Docker image tag (build number) |
| `CONTAINER_NAME` | `pipleline-CI-CD-app-container` | Running container name |
| `CONTAINER_PORT` | `8084` | Port exposed on host |
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


## Author

**DevOps Engineer:** Eman
