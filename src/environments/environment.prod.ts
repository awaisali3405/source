export const environment = {
    production: true,
    webServicePath: 'http://' + window.location.hostname + ':80/',
    enableUpload: true,
    enableDownload: true,
    enableLogin: true,
    maxNoVariantsForAlignments: 235,
    firstPage: '/real-ws/plist',
    loginTextHint: 'Username: admin Password: admin will give you full access to the system. Username: user1 Password: user1 will give you access to the running-example log along with the possibility to download the running-example. Username: user2 Password: user2 will give you access to the receipt log but without the possibility to download the log.',
    overallEnableBPMN: false,
    overallEnableAlignments: true
};
