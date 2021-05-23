import assert from 'assert';
import electron from 'electron';

function createIPCFunctions(channel, action, defaultData) {
  const ipcFunction = async (parameters) => {
    const args = {};
    for(const key in defaultData){
      args[key] = defaultData[key];
    }
    args['action'] = action;
    args['parameters'] = parameters;

    const result = await electron.ipcRenderer.invoke(channel, args);
    return result;
  }
  return ipcFunction;
}

const handler = {
  get: function(obj, prop){
    assert.notStrictEqual(prop, 'ipc_functions');
    assert.notStrictEqual(prop, 'constructor');
    if(!('ipc_functions' in obj)){
      obj['ipc_functions'] = {};
    }
    if(!(prop in obj)){
      obj[prop] = createIPCFunctions(obj.channel, prop, obj.defaultData);
    }
    return obj[prop];
  }
};

class ProxyObject{
  static create_new(channel, defaultData){
    return new Proxy({channel, defaultData}, handler);
  }
}

export default ProxyObject;
