pipeline {
    agent {
        kubernetes {
            yaml """
apiVersion: v1
kind: Pod
metadata:
  labels:
    name: saraswati-hedis-results-api
spec:
  containers:
  - name: node
    image: node:13.10.1-alpine3.11
    command:
    - cat
    tty: true
  - name: kaniko
    image: gcr.io/kaniko-project/executor:debug
    imagePullPolicy: Always
    command:
    - /busybox/cat
    tty: true
    volumeMounts:
      - name: jenkins-docker-cfg
        mountPath: /kaniko/.docker
  volumes:
  - name: jenkins-docker-cfg
    projected:
      sources:
      - secret:
          name: mh-docker-hub
          items:
            - key: config.json
              path: config.json
"""
        }
    }

    stages {
        stage('Jenkins Install Dependencies') {
            steps {
                echo 'Installing..'
                container('node') {
                    sh 'yarn'
                }
            }
        }
        stage('Jenkins Test') {
            steps {
                echo 'Testing..'
                container('node') {
                    sh 'yarn test'
                    publishCoverage(
                        failUnstable: true,
                        failNoReports: true,
                        skipPublishingChecks: true,
                        adapters: [
                            cobertura(
                                path: 'coverage/clover.xml', 
                                thresholds: [
                                    [thresholdTarget: 'Line', unhealthyThreshold: 15.0, unstableThreshold: 10.0]
                                ]
                            )
                        ], 
                        sourceFileResolver: sourceFiles('NEVER_STORE')
                    )
                }
            }
        }
        /*stage('Build Production with Kaniko') {
            when {
                expression {env.GIT_BRANCH == 'master'} 
            }
            steps {
                container(name: 'kaniko', shell: '/busybox/sh') {
                sh '''#!/busybox/sh
                    /kaniko/executor --context `pwd` --verbosity debug --destination=amidatech/saraswati-hedis-results-api:latest
                '''
                }
            }
        }
        stage('Build Develop with Kaniko') {
            when { 
                expression {env.GIT_BRANCH == 'develop'} 
            }
            steps {
                container(name: 'kaniko', shell: '/busybox/sh') {
                sh '''#!/busybox/sh
                    /kaniko/executor --context `pwd` --verbosity debug --destination=amidatech/saraswati-hedis-results-api:develop
                '''
                }
            }
        }*/
    }
}