import router from "../router";
export default ()=>{
  if( window.history.length <= 1 ) {
    router.push({path: "/"})
    return false
  } else {
    router.back(-1)
    return false
  }
}