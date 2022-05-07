export default function create(el, className, ...attrs) {
  const element = document.createElement(el);
  if (className) element.classList.add(className);
  //   if (dataAttrs.length) {
  //     dataAttrs.forEach(([attrName, attrValue]) => {
  //       element.dataset[attrName] = attrValue;
  //     });
  //   }
  if (attrs.length) {
    attrs.forEach(([attrName, attrValue]) => {
      element.setAttribute(attrName, attrValue);
    });
  }
  // console.log(element);
  return element;
}
