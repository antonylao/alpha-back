import { Routes } from "../routes"

export const transformRoutesForFront = (param: { beginningSlash: boolean } = { beginningSlash: false }) => {

  //find list of controllers
  const controllers = new Set<string>(Routes.map((obj) => {
    return obj.controller.name
  }))

  //create obj to return: returnObj
  let returnObj = {}

  //initialize keys pof returnObj to controller names, with value set to empty object
  Array.from(controllers).forEach((controller) => {
    returnObj[controller] = {}
  })

  //for each route, initialize key of dedicated controller to value of action, with value name of the route
  Routes.forEach((obj) => {
    returnObj[obj.controller.name][obj.action] = param.beginningSlash ? obj.route : obj.route.substring(1)
  })

  return returnObj
}