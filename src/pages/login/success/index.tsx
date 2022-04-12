import {useEffect} from "react";
import * as cache from "@/utils/cache";
import {history} from 'umi';

export default function LoginSuccess(props: any) {

  useEffect(() => {
    console.log(props);
    const {location: {query: {access_token, username, loginType}}} = props;
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
