// Internal modules
import { Ioc } from '../modules/helpers/dependency-injector/dependency-injector.service';

function ctorWrapper(Constructor, args:any[]): any {
    return function() {

         var Temp = function(){}, // temporary constructor
             inst, ret; // other vars

         // Give the Temp constructor the Constructor's prototype
         Temp.prototype = Constructor.prototype;

         // Create a new instance
         inst = new Temp;

         // Call the original Constructor with the temp
         // instance as its context (i.e. its 'this' value)
         ret = Constructor.apply(inst, args);
         // If an object has been returned then return it otherwise
         // return the original instance.
         // (consistent with behaviour of the new operator)
         return Object(ret) === ret ? ret : inst;

    }
}

export function inject(...interfaceTypes:any[])
{
  return function(target:any)
  {
    target.prototype.__create = function()
    {
      var params = [];
      for (var i=0; i< interfaceTypes.length; i++)
      {
        var instance = Ioc.getInstance(interfaceTypes[i]);
        params.push(instance);
      }
      var newInstance = ctorWrapper(target, params)();
      return newInstance;
    }
  };
}
