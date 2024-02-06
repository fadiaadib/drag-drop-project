namespace App {
  // Autobind method decorator
  export function Autobind(
    _: any,
    _2: string,
    propertyDesc: PropertyDescriptor
  ) {
    const newPropertDescriptor: PropertyDescriptor = {
      enumerable: false,
      configurable: true,
      get() {
        return propertyDesc.value.bind(this);
      },
    };

    return newPropertDescriptor;
  }
}
