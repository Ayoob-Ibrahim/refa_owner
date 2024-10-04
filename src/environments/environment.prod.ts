
export const environment = {
  production: true,
  url: ""
};
let ServerObject: any = new Object();


let appName = 'qa';

let applicationSelection = {
  'live': 'refa-live',
  'qa': 'refa-qa',
  'local': 'refa-local',
  'ip': 'refa-ip'
}


switch (applicationSelection[appName]) {
  case 'refa-live':
    ServerObject = {
      liveDomain: 'https://refa.eitworks.com/refa',
      formsUrl: "/Dcservice/form",
      gridUrl: '/DCDesignDataServlet/displaydata',
      widgetsUrl: '/DCDesignDataServlet/getwidgets',
      fileUpload: '/DCDesignDataServlet/fileupload',
      websocket: 'wss://ge-fleeton.thegoldenelement.com/refa/WebSocket',
      imageUrl: '/Dcservice/download',
      singleFileUpload: '/DCDesignDataServlet/singlefileupload',
     workFlowWithOutToken: '/WorkFlowEnginee/Registration',
      workFlow: '/WorkFlowEnginee/registration',
    }
    break;

  case 'refa-qa':
    ServerObject = {
      liveDomain: 'https://refa.eitworks.com/refa',
      formsUrl: "/Dcservice/form",
      gridUrl: '/DCDesignDataServlet/displaydata',
      widgetsUrl: '/DCDesignDataServlet/getwidgets',
      fileUpload: '/DCDesignDataServlet/fileupload',
      websocket: 'wss://ge-fleeton.thegoldenelement.com/refa/WebSocket',
      imageUrl: '/Dcservice/download',
      singleFileUpload: '/DCDesignDataServlet/singlefileupload',
     workFlowWithOutToken: '/WorkFlowEnginee/Registration',
      workFlow: '/WorkFlowEnginee/registration',
    }
    break;

  case 'refa-local':
    ServerObject = {
      liveDomain: 'https://refa.eitworks.com/refa',
      formsUrl: "/Dcservice/form",
      gridUrl: '/DCDesignDataServlet/displaydata',
      widgetsUrl: '/DCDesignDataServlet/getwidgets',
      fileUpload: '/DCDesignDataServlet/fileupload',
      websocket: 'wss://ge-fleeton.thegoldenelement.com/refa/WebSocket',
      imageUrl: '/Dcservice/download',
      singleFileUpload: '/DCDesignDataServlet/singlefileupload',
     workFlowWithOutToken: '/WorkFlowEnginee/Registration',
      workFlow: '/WorkFlowEnginee/registration',
    }
    break;

  case 'refa-ip':
    ServerObject = {
      liveDomain: 'http://161.97.169.98:8083/refa',
      formsUrl: "/Dcservice/form",
      gridUrl: '/DCDesignDataServlet/displaydata',
      widgetsUrl: '/DCDesignDataServlet/getwidgets',
      fileUpload: '/DCDesignDataServlet/fileupload',
      websocket: 'wss://ge-fleeton.thegoldenelement.com/refa/WebSocket',
      imageUrl: '/Dcservice/download',
      singleFileUpload: '/DCDesignDataServlet/singlefileupload',
     workFlowWithOutToken: '/WorkFlowEnginee/Registration',
      workFlow: '/WorkFlowEnginee/registration',
    }
}

export const ServerUrl = Object.assign(ServerObject);








//  * For easier debugging in development mode, you can import the following file
//   * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
//   *
//  * This import should be commented out in production mode because it will have a negative impact
//   * on performance if an error is thrown.
//  * /
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
