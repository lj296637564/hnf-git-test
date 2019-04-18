import axios from 'axios'
import querystring from "querystring"
import http from "http"


const serverport = {
    IP: "172.16.2.20", // 192.168.99.115//何威   192.168.99.202:8097  //192.168.99.145:羊越 //192.168.99.118:8090 罗垒  127.0.0.1   // localhost 172.16.2.20   笔记本
    PORT: "8090"
}
let option = {
    host: serverport.IP,
    port: serverport.PORT,
    path: "",
    method: "POST",
    headers: {

    }
}

let common = {}
common.$axios = (url, data) => {
    return axios.post(url, data)
}
common.$HttpPost = (path, data) => {
        // let postData = JSON.stringify(data);
        let postData = querystring.stringify(data)
        option.path = path

        option.headers = {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Content-Length': Buffer.byteLength(postData),
                'Access-Control-Allow-Origin': '*',
                // 'Access-Control-Allow-Headers':'Origin,X-Requested-With,Content-Type,Accept',
                /**
                 * 此注释不能删除
                 * **/
                // 'Content-Type':'application/json; charset=UTF-8',  //'application/x-www-form-urlencoded; charset=UTF-8'   //'application/json; charset=UTF-8'//'application/x-www-form-urlencoded'
                // 'Content-Length':postData.length
            }
            // if(path.indexOf('login')<0){
            //   option.headers.token=sessionStorage.getItem('token')
            // }
            // option.headers.token="52555fd5gsd8gre1gwer5gSDFREOJO"
        return new Promise((resolve, reject) => {
            try {
                let req = http.request(option, (res) => {
                        res.setEncoding('utf-8');
                        let _data = '';
                        res.on('data', (chunk) => {
                            _data += chunk
                        })
                        res.on('end', () => {
                            if (res.statusCode === 200) {
                                resolve(JSON.parse(_data));
                            } else {
                                console.log(res);
                                reject({
                                    "errno": res.statusCode,
                                    "errmsg": _data //res.statusMessage
                                });
                            }
                        });
                    })
                    // req.on('response',response=>{
                    //   if(response.headers.token){
                    //     sessionStorage.setItem('token',response.headers.token)
                    //   }
                    // })
                req.on('timeout', (e) => {
                    if (req.res) {
                        req.res('abort')
                    }
                    req.abort()
                })
                req.on('error', (err) => {
                    // console.log(err);
                    reject(err)
                })
                req.write(postData)
                req.end()
            } catch (err) {
                console.error(err)
                reject(err)
            }
        }).catch((err) => {
            console.log("err: " + err)
        })
    }
    // 格式化时间日期
common.formatDate = function(format, data) {
    let date = new Date(data || '');
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = date.getDate() + ' ';
    let h = date.getHours() + ':';
    let m = +date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
    let s = date.getSeconds();

    if (format === 'yyyy-MM-dd hh:mm:ss') {
        return Y + M + D + h + m + s
    } else {
        switch (date.getDay() + '') {
            case '0':
                return '星期天'
            case '1':
                return '星期一'
            case '2':
                return '星期二'
            case '3':
                return '星期三'
            case '4':
                return '星期四'
            case '5':
                return '星期五'
            case '6':
                return '星期刘'
        }
    }
}

export default common