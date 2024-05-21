def deployToServer(serverAddress) {
    def deploying = "#!/bin/bash \n" + 
        "docker rm -f ${NAME_WEB} \n" +
        "docker pull ${DOCKER_HUB}/${NAME_WEB}:$DOCKER_TAG \n" +
        "docker run --name=${NAME_WEB} -d -p 80:80 ${DOCKER_HUB}/${NAME_WEB}:$DOCKER_TAG" 

    sshagent(credentials: ['jenkins-ssh-key']) {
        sh """
            ssh -o StrictHostKeyChecking=no -i jenkins-ssh-key tuan@$serverAddress "echo \\\"${deploying}\\\" > deploy-web.sh \
            && chmod +x deploy-web.sh && chown tuan:docker /var/run/docker.sock && chmod g+rw /var/run/docker.sock && ./deploy-web.sh && exit"
        """  
    }

}

def sendTelegramMessage(token, chatId, message) {
    sh """
    curl -s -X POST https://api.telegram.org/bot${token}/sendMessage -d chat_id=${chatId} -d text="${message}"
    """
}

pipeline{
    agent any
    environment{
        PATH_PROJECT = '/home/projects/VDT-midterm-web'

        SONAR_PROJECT_KEY = credentials('vdt-midterm-web-sonar-project-key')
        SONAR_TOKEN = credentials('sonarqube-token')
        SONAR_HOST_URL= credentials('sonar-host-url')

        DOCKER_HUB ='tuanquang1811'
        DOCKER_HUB_CREDENTIALS = credentials('dockerhub-credentials')
        NAME_WEB = 'vdt-midterm-web'
        DOCKER_TAG = "${GIT_BRANCH.tokenize('/').pop()}-${GIT_COMMIT.substring(0,7)}"

        ENV_FILE_VDT_MIDTERM_WEB = ''

        TELEGRAM_TOKEN = credentials('telegram-token') 
        TELEGRAM_CHAT_ID = credentials('telegram-chatId') 
        TEXT_PRE_BUILD = "Jenkins is building ${JOB_NAME}"

        IP_APP_SERVER_1 = credentials('ip-app-server-1')
        IP_APP_SERVER_2 = credentials('ip-app-server-2')

    }
    stages{
        stage("Prepare pipeline") {
            steps {
                script {
                    sendTelegramMessage(TELEGRAM_TOKEN, TELEGRAM_CHAT_ID, TEXT_PRE_BUILD)
                }
            }
        }
        stage('Checkout source' ){
            steps{
                sh "sudo cp -r . $PATH_PROJECT \
                && sudo chown -R jenkins:jenkins $PATH_PROJECT \
                && sudo chmod -R 755  $PATH_PROJECT \
                "
            }
        }
        stage('Check lint and prettier'){
            steps{
                sh "cd $PATH_PROJECT && npm install && npm run prettier"
            }
        }
        stage('Test with sonarqube'){
            steps{
                withSonarQubeEnv('sonarqube connection') {
                    sh "cd $PATH_PROJECT && docker run --rm \
                    -e SONAR_HOST_URL=${SONAR_HOST_URL} \
                    -e SONAR_SCANNER_OPTS='-Dsonar.projectKey=${SONAR_PROJECT_KEY}' \
                    -e SONAR_TOKEN=${SONAR_TOKEN} \
                    -v '.:/usr/src' \
                    sonarsource/sonar-scanner-cli"
                }
            }
        }
        stage('Build and push image'){
           when {
                expression {
                     return sh(script: 'git describe --exact-match --tags HEAD', returnStatus: true) == 0
                }
            }
            steps{ 
                script { 
                    try {
                        timeout(time: 3, unit: 'MINUTES') {
                            env.userChoice = input message: 'Do you want to build and push image to docker hub?',
                                parameters: [choice(name: 'Versioning service', choices: 'Yes\nNo', description: 'Choose "Yes" if you want to build and push image to docker hub')]
                        }
                        if(env.userChoice == 'Yes') {     
                            withCredentials([file(credentialsId: 'vdt-midterm-web-env', variable: 'ENV_FILE_VDT_MIDTERM_WEB')]) {
                                ENV_FILE_VDT_MIDTERM_WEB = readFile(file:"$ENV_FILE_VDT_MIDTERM_WEB").trim()
                            }

                            sh "echo \"$ENV_FILE_VDT_MIDTERM_WEB\" > $PATH_PROJECT/.env"

                            env.IMAGE_TAG = DOCKER_TAG
                            sh " cd $PATH_PROJECT \
                            && IMAGE_TAG=${IMAGE_TAG} \
                            && NAME_WEB=${NAME_WEB} \
                            && docker-compose build --parallel \
                            && docker tag ${NAME_WEB}:$DOCKER_TAG ${DOCKER_HUB}/${NAME_WEB}:$DOCKER_TAG \
                            && echo $DOCKER_HUB_CREDENTIALS_PSW | docker login -u $DOCKER_HUB_CREDENTIALS_USR --password-stdin \
                            && docker push ${DOCKER_HUB}/${NAME_WEB}:$DOCKER_TAG \
                            && docker rmi  ${DOCKER_HUB}/${NAME_WEB}:$DOCKER_TAG "
                        } else {
                            echo "build and push image to docker hub cancelled"
                        }
                    } catch(Exception err) {
                        def user = err.getCauses()[0].getUser()
                        if('SYSTEM' == user.toString()) {
                            def didTimeout = true
                            echo "Timeout. Build and push image to docker hub cancelled" 
                        } else {
                            echo "Build and push image to docker hub cancelled by: ${user}"
                        }
                    }          
                }
            }
        }
        stage('Deploy'){
            when {
                expression {
                     return sh(script: 'git describe --exact-match --tags HEAD', returnStatus: true) == 0
                }
            }
            steps{
                script{
                    try {
                        timeout(time: 3, unit: 'MINUTES') {
                            env.userChoice = input message: 'Do you want to deploy?',
                                parameters: [choice(name: 'Versioning service', choices: 'Yes\nNo', description: 'Choose "Yes" if you want to deploy')]
                        }
                        if(env.userChoice == 'Yes') {   
                            deployToServer(IP_APP_SERVER_1)
                            deployToServer(IP_APP_SERVER_2)
                        } else {
                            echo "deploy cancelled"
                        }
                    }
                    catch(Exception err) {
                        def user = err.getCauses()[0].getUser()
                        if('SYSTEM' == user.toString()) {
                            def didTimeout = true
                            echo "Timeout. Deploy cancelled" 
                        } else {
                            echo "Deploy cancelled by: ${user}"
                        }
                    }
                }
            }
        
        }
    }
    post{
        success {
            sendTelegramMessage(TELEGRAM_TOKEN, TELEGRAM_CHAT_ID, "JOB ${JOB_NAME} is Success")
        }
        failure {
            sendTelegramMessage(TELEGRAM_TOKEN, TELEGRAM_CHAT_ID, "JOB ${JOB_NAME} is Failure")
        }
        aborted {
            sendTelegramMessage(TELEGRAM_TOKEN, TELEGRAM_CHAT_ID, "JOB ${JOB_NAME} is Aborted")
        }
    }
      
}
