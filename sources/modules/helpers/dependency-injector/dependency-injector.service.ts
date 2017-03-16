/**
 * Define how a service is registered and the way to create or retrieve instance of
 */
class RegisteredService
{
  private _type:any;
  private _factory:() => any;

    getType(): any
    {
      return this._type;
    }

    getFactory(): any
    {
      return this._factory;
    }

    constructor(type:any, factory:any)
    {
      this._type = type;
      this._factory = factory;
    }
}

/**
 * Service container, with automatic service instanciation with dependency injection
 */
export class Ioc
{
  private static registeredServices:{[id: string] : RegisteredService;} = {};
  private static registeredInstances:any = {};


/**
 * Register a new service, giving a custom way of creating an instance of the given contract
 * @interfaceName {string} Name of the interface, base type of all instances which will be created
 * @factoryFunction {Function} Function to be called when a service instance is requested
 */
  static registerCustom(interfaceName:string, factoryFunction: () => any)
  {
    Ioc.registeredServices[interfaceName] = new RegisteredService(null, factoryFunction);
  }

/**
 * Register a new service, in a factory mode
 * (means that a new instance of this service  * must be created each time the service is requested)
 * @interfaceName {string} Name of the interface, base type of all instances which will be created
 */
  static registerType(interfaceName:string, type:any)
  {
    Ioc.registeredServices[interfaceName] = new RegisteredService(type, () => Ioc.getInstanceInternal(interfaceName));
  }

/**
 * Register a new service, in a singleton way
 * (mean the same instance will be returned each time the service is requested)
 * @interfaceName {string} Name of the interface, base type of the instance which will be created
 */
  static registerInstance(interfaceName:string, type:any)
  {
    Ioc.registeredServices[interfaceName] = new RegisteredService(type,
      (): any =>
      {
        if (this.registeredServices[interfaceName])
        {
          if (this.registeredInstances[interfaceName] === undefined)
          {
            this.registeredInstances[interfaceName] = Ioc.getInstanceInternal(type);
          }
        }
        else
        {
          throw new Error("Service not registered : " + interfaceName);
        }
        return this.registeredInstances[interfaceName];
      });
  }


/**
 * Get an instance of the requested contract or the specified type
 * @typeOrInterface Contract name or type of the instance to be returned
 * @remarks if parameter is the interface name, the method will look at the corresponding registered type to return the instance
 * if parameter is a type, will try to create an instance of the type with dependency injection
 */
  static getInstance(typeOrInterface:any):any
  {
    let service:RegisteredService = Ioc.registeredServices[typeOrInterface];

    if (service === undefined)
    {
      return Ioc.getInstanceInternal(typeOrInterface);
    }
    return service.getFactory()();
  }

  private static getInstanceInternal(typeOrInterface:any):any
  {
    let service:RegisteredService = Ioc.registeredServices[typeOrInterface];
    var type = service !== undefined ? service.getType() : undefined;
    type = type || typeOrInterface;
    if (type.prototype !== undefined
          && type.prototype.__create !== undefined)
    {
      return type.prototype.__create.apply(type);
    }
    else if (type.prototype !== undefined)
    {
      return new type();
    }
    else
    {
      throw new Error("Interface type not registered or unknown type");
    }
  }
}
