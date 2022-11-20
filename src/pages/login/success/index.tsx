import {useEffect} from "react";
import * as cache from "@/utils/cache";
import {useSearchParams} from "@@/exports";
import {history} from "@@/core/history";


export default () => {

  const [searchParams] = useSearchParams();
  let access_token = searchParams.get("access_token") || '';
  let username = searchParams.get("username") || '';
  let loginType = searchParams.get("loginType") || '';

  useEffect(() => {
    if (access_token) {
      console.log(access_token, username, loginType);
      cache.setItem('Authorization', access_token);
      cache.setItem('username', username);

      history.push({
        pathname: "/project/home"
      });
    } else {
      history.push({
        pathname: "/login"
      });
    }

  })

  return (<></>)
}
