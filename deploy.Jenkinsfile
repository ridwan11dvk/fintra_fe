/*
  catatan untuk menggunakan pipeline ini adalah:
  - nama branch harus sudah sesuai standar yaitu development, qa dan Production
*/
@Library("kai-jenkins-lib") _

/* 'nama-key-di-vault': 'output/lokasi/file/disimpan' */
def vault_mapping = [
    '.env': '.env',
]

/* kalo mau pake common-file di uncomment saja 
def vault_common = [
    'zz-custom-php.ini': 'zz-custom-php.ini',
    'supervisord-laravel-nonroot.conf': 'supervisord.conf',
    'Caddyfile-hardened-v2': 'Caddyfile',
]
*/

pipeline {
    agent any

    environment {
        /* Perlu diganti secara manual. */
        APP_NAME = 'finalink-fe'
        STREAM = 'FINANCE'

        /* system information */
        WEBSERVER = 'Node.js'
        FRAMEWORK = 'React'
        LANGUAGE = 'JS'
    }

    // manual parameter
    // parameters {
    //     string(name: 'TAG', defaultValue: 'alpha.0.0.0', description: 'TAG for version (opsional)')
    // }

    // Stages
    stages {
        stage('Populate Environment Variable') {
            steps {
                script {
                    setup.populate_env_okd_bdx()
                }
            }
        }

        stage('Setup Git Parameter') {
            steps {
                script {
                    setup.set_git_parameter()
                }
            }
        }

        /* mirror to git.kai.id */
        stage('Git Push to Gitlab KAI') {
            when {
                expression {
                    return env.ENV == 'DEV'
                }
            }
            steps {
                script {
                    setup.push_to_gitkai()
                }
            }
        }

        stage('Unit Test & Coverage') {
            when {
                expression {
                    return env.ENV == 'DEV'
                }
            }
            agent {
                docker {
                    image 'node:26-alpine'
                    reuseNode true
                    args '-u root'
                }
            }
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    sh """
                        find . -name "lcov.info" -delete
                        find . -name "lcov-report" -type d -exec rm -rf {} + || true
                        find . -name ".nyc_output" -type d -exec rm -rf {} + || true
                        find . -name "coverage.xml" -delete
                        rm -rf node_modules
                        npm install --legacy-peer-deps --cache /tmp/npm-cache
                        npm i -D @vitest/coverage-v8
                        npm run test:unit:coverage
                    """
                }
            }
            
        }


        stage('Static Code Analysis with Sonarqube') {
            when {
                expression {
                    return env.ENV == 'DEV'
                }
            }
            steps {
                script {
                    setup.scan_with_sonarqube(language: LANGUAGE)
                }
            }
        }

        // Push image to KAI registry
        stage('Build & Push Image') {
            steps {
                script {
                    /* kalo nama filenya dinamis kaya config asp dotnet bisa dilakukan begini */
                    // switch (env.VER) {
                    // case 'alpha':
                    //         env.ENV_ASP = 'dev'
                    //         break
                    // case 'beta':
                    //         env.ENV_ASP = 'dev'
                    //         break
                    // case 'live':
                    //         env.ENV_ASP = 'prod'
                    //         break
                    // }
                    
                    // /* 'nama-key-di-vault': 'output/lokasi/file/disimpan' */
                    // def vault_mapping = [
                    //     "application-${ENV_ASP}.properties": "src/main/resources/application-${ENV_ASP}.properties",
                    //     "application.properties": "src/main/resources/application.properties",
                    //     ".env": ".env",
                    // ]

                    setup.get_config_from_map(vault_map: vault_mapping)
                    // setup.get_config_from_map(vault_map: vault_common, vault_dir: "config/${ENV}/common-file")
                    k8s.build_image_and_push(docker_arg: "", dockerfile: "Dockerfile")
                }
            }
        }

        // Update manifest to trigger RKE for deployment
        stage('Update Manifest') {
            steps {
                script {
                    k8s.update_manifest()
                }
            }
        }

        /*
        stage('Ask for deploy confirmation in prod') {
            when {
                expression {
                    return env.ENV == 'Production'
                }
            }
            steps {
                input("Lanjut deploy ke PRODUCTION???")
            }
        }
        */

        // Deploy
        stage('Deploy App') {
            steps {
                script {
                    k8s.deploy_app()
                }
            }
        }
    }

    post {
        always {
            script {
                post.defaultAlways()
            }
            //cleanWs() // uncomment barangkali file lama membuat docker buildnya error
        }
        success {
            script {
                post.defaultSuccess()
            }
        }
        unstable {
            script {
                post.defaultUnstable()
            }
        }
        failure {
            script {
                post.defaultFailure()
            }
        }
        changed {
            script {
                post.defaultChanged()
            }
        }
    }
}

