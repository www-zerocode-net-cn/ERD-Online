import React from "react";
import ParticlesBg from "particles-bg";
import SignIn from "./SignIn";
import icon from "./icon";
import "./style/login.css";
import {Image, notification} from "antd";


export default class Login extends React.Component {
    componentDidMount() {
        notification.open({
            key: 'wechat',
            placement: 'bottomRight',
            style: {width: '175px'},
            duration: 10000,
            message: '微信群',
            description: (
                <div>
                    <Image
                        width={128}
                        src={`/qrcode.jpg`}
                        placeholder={
                            <Image
                                preview={false}
                                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
                            />
                        }
                    />
                </div>
            ),
        });
    }

    componentWillUnmount() {
        notification.close('wechat');
    }

    state = {
        data: [],
        loading: false,
        hasMore: true,
    };


    render() {
        let config = {
            num: [4, 7],
            rps: 0.1,
            radius: [5, 40],
            life: [1.5, 3],
            v: [2, 3],
            tha: [-50, 50],
            alpha: [0.6, 0],
            scale: [.1, 0.9],
            body: icon,
            position: "all",
            //color: ["random", "#ff0000"],
            cross: "dead",
            random: 10
        };

        return (
            <div>
                <SignIn/>
                <ParticlesBg type="custom" config={config} bg={true}/>
            </div>
        );
    }
}

