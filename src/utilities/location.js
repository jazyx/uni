/**
 * frontend/src/utilities/location.js
 */


export const parsePath = () => {
  const { pathname } = location
  console.log("pathname:", pathname)// /uni/Name/group/*

  const [ base, name, group ] = pathname.split("/")
                                        .filter(x => !!x)
  return { name, group }
}