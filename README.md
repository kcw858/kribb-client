pm2 설치할 것.

1. pm2 서비스 등록
pm2 startup 명령어를 입력한 후 출력으로 나오는 텍스트를 그대로 다시 커맨드라인에 입력하여
pm2를 서비스로 등록시킵니다.
(https://pm2.keymetrics.io/docs/usage/startup/ 참조)

2. nodejs 버전 : Node 14	4.14+

node-sass 버전별 필요한 nodejs 버전: https://www.npmjs.com/package/node-sass

nodejs 16 버전 이상을 사용하는 경우 node-sass와 버전이 맞지않아 npm install에서 에러가 발생하거나 설치시 에러가 없어도 실행시 webpack-xxx-style-loader.js에서 에러가 발생함. 반드시 nodejs는 14버전을 사용할 것.

nodejs 14버전:  https://nodejs.org/en/blog/release/v14.18.3/

3. 클라이언트 웹서버 시작
클라이언트 서버에 받아 npm install로 관련 모듈을 제대로 설치 한 뒤 npm start(dev모드), npm run prod(pm2로 저장됨)라는 명령어로
서버를 실행하면 됩니다.

```bash
pm2 start npm -- start && pm2 save  (4100번 포트 사용)
또는,
npm run prod             (기본은 80포트, 임시로 4000번 포트 사용)
```

잘등록되었는지 확인하기위해 물리 서버를 재시작하여 pm2 list로 확인해 보시면 됩니다!

포트변경이 필요한 경우
build/webpack.config.client.prod.js 하단에 보시면 서버에서 사용할 포트를 지정할 수 있습니다.
현재는 4000으로 되어있습니다.

localhost에서 실행할 때, ｢wds｣: Error: listen EACCES: permission denied 0.0.0.0:4100 에러가 발생한다면,
```bash
netsh interface ipv4 show excludedportrange protocol=tcp
```
명령으로 WSL에 의해 포트가 이미 점유되지 않았는지 확인하고 해당 포트 범위를 피해서 사용할 것.

https://superuser.com/questions/1437780/how-to-fix-listen-eacces-permission-denied-on-any-port/1568476#1568476
 

