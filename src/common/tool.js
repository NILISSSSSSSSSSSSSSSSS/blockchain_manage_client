import { url } from "api/url-config"

//获取url
export function getUrl(){
  //判断是pc和html5,还是app
  return url=="" ? `${window.location.protocol}//${window.location.host}` : url;
}