Download and Installation
Go to Releases · [Checkmarx/ast-cli (github.com)](https://github.com/Checkmarx/ast-cli/releases)
Download the relevant package compatible with your Operating System.
Place the tool in any location and extract it.
Configuration methods
Configuration can be done by 3 methods

CLI parameters - when submitting any CLI command you can add the configuration parameters.
Configuration file - a configuration file can be created by running the CLI configure command. The Configuration files are kept in the users home directory under a subdirectory named ($HOME/.checkmarx)
Environment variables - the environment variables of your system
When variables are submitted using multiple methods, the precedence is used in above order when there is a conflict between the different provided values.

Authentication method
CLI can be configure to authenticate via user API key or service account credential(Client ID and Client Secret). If you are using the CLI in pipeline or as part of the automated build process. You must use service account rather API key.

If you want to use Cx One CLI for other testing or individual purpose, then login to Cx One portal, go to setting Icon ->Identify and Access Management -> generate the API key. Setup the API key in CLI instead of service account credential.

Create Authentication Configuration file
Open the CLI on your machine, and navigate to the CLI tool file location
Run .\cx configure (for Mac users use ./cx configure) and enter the information asked
AST Base URI: https://fis.cxone.cloud
AST Base Auth URI: https://fis.cxone.cloud
AST Tenant: fis
Do you want to use API Key authentication? (Y/N): N
Checkmarx One Client ID []: svc_A19085_aisdev
Client Secret []: snO2hwWDTUVcvNa9rY0JiAOw3EoUvOuO
Run ./cx auth validate to validate the connection is successful and authenticated. The response will be "Successfully authenticated to Checkmarx One server!"

cli command :
cx scan create --project-name "AIS_Authentication_Intelligence_System" --project-groups "CxOne_BS_AIS_Authentication_Intelligence_System_A19085" --project-tags "scid:19085" --branch "test" -s "C:/workspace/AISDEV/ais-gui"
