/**
 * Copyright 2016 Felix Rotthowe.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function(RED) {
  "use strict";
  var userDir="";
  if (RED.settings.userDir){
    userDir=RED.settings.userDir+"/";
  } 


  function GetSmarthomeMessages(config) {
    RED.nodes.createNode(this,config);
    var smarthome = require("smarthome");
    var util = require('util');
    var node = this;
    var user = this.credentials.username;
    var pass = this.credentials.password;
    this.on('input', function(msg) {
      smarthome.setLogLevel("error");
      if (!user || !pass) {
        node.warn("No credentials set for RWE Smarthome");
        return;
      }
      smarthome.connect(user, pass, function(error, api) {
        if (error) {
          util.log(error)
        } else {
          api.getMessages( function(error, data) {
            if (error) {
              util.log(error)
            } else {
              msg.payload = data;
              node.send(msg);
            } 
            api.disconnect( );
          } );
        }
      });
    });
  }

  RED.nodes.registerType("RWE SH",GetSmarthomeMessages,{
    credentials: {
      username: {type:"text"},
      password: {type: "password"}
    }
  });

}
