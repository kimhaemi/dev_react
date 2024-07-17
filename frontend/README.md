참조: <br />
https://velog.io/@_junukim/Typescript-React-Rollup%EC%9C%BC%EB%A1%9C-%ED%92%80%EC%84%B8%ED%8A%B8-Component-Library%EB%A7%8C%EB%93%A4%EA%B8%B0

1. package.json init
   먼저 package.json을 만들기 위해 터미널에 명령어를 작성해준다.

npm init
명령어를 작성하고 나면 여러 질문을 할 것이다. 전부 엔터 누르고 마지막에 yes 하면 된다.
그러면 package.json 파일이 생성된다. 그리고 이어서 필요한 모듈들을 다운로드한다.

명령어는 네 줄 다 작성해야 한다.

// babel
npm i -D @babel/core babel-preset-react-app

// rollup
npm i -D @rollup/plugin-commonjs @rollup/plugin-json @rollup/plugin-node-resolve rollup rollup-plugin-peer-deps-external rollup-plugin-postcss rollup-plugin-typescript2

// typescript, react
npm i -D @types/react typescript

// postcss
npm i -D node-sass postcss postcss-loader postcss-prefixer

모든 모듈이 다운로드 되고 나면 package.json에 peerDependency를 추가한다.
(peerDependency는 간단히 말해, 현 package(FCC)에 모듈을 다운하는 게 아니라 package를 사용하는 쪽(FCC를 사용하는 곳)에서 dependeny를 갖고 있어야 한다.)

{
...
"devDependencies": {
...
},
"peerDependencies": {
"react": "^16.8.6",
"react-dom": "^16.8.6"
}
}
peerDependency를 끝으로 모듈 다운로드는 끝이 났다.

그리고 build파일들을 외부에서 캐치할 수 있게 타입들과 빌드파일들을 package.json에 명시해주어야한다.

+추가로 간편 명령어 등록도 해주었다.

{
"name": "flex-customer-contract",
"version": "1.0.0",
"description": "components for contract in flex",
"license": "UNLICENSED",
// type 명시
"types": "lib/index.d.ts",
// 외부에서 접근할 index 명시
"main": "dist/esm.js",
"directories": {
"example": "example"
},
"scripts": {
"start": "npm run exam & npm run watch",
"build": "rollup -c",
"watch": "rollup -cw",
"exam": "cd example && npm start",
"lint": "eslint . --ext .js,.jsx,.ts,.tsx"
},
"author": "junwoo@flex.team",
"devDependencies": {
...
},
"peerDependencies": {
...
}
} 2. rollup config
다음으로 rollup.config.js 파일을 생성한다.
rollup은 특이하게 config를 배열로 설정할 수 있다.
배열로 설정하게 되면 배열의 인자에 맞춰서 여러 개의 build파일이 생성된다.

import pkg from './package.json';
import typescript from 'rollup-plugin-typescript2';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import postcssPrefixer from 'postcss-prefixer';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

const extensions = ['.js', '.jsx', '.ts', '.tsx', '.scss'];

process.env.BABEL_ENV = 'production';

function setUpRollup({ input, output }) {
return {
input,
exports: 'named',
output,
watch: {
include: '\*',
exclude: 'node_modules/\*\*',
},
plugins: [
peerDepsExternal(),
json(),
resolve({ extensions }),
commonjs({
include: /node_modules/,
}),
typescript({ useTsconfigDeclarationDir: true }),
postcss({
extract: true,
modules: true,
sourceMap: true,
use: ['sass'],
plugins: [
postcssPrefixer({
prefix: `${pkg.name}__`,
}),
],
}),
],
external: ['react', 'react-dom'],
};
}

export default [
setUpRollup({
input: 'index.ts',
output: {
file: 'dist/cjs.js',
sourcemap: true,
format: 'cjs',
},
}),
setUpRollup({
input: 'index.ts',
output: {
file: 'dist/esm.js',
sourcemap: true,
format: 'esm',
},
}),
];
위 config파일을 간단히 설명하면

setUpRollup이라는 함수를 만들어서 rollup config setting을 한다.
index.ts파일을 불러와서 빌드하고 각각 dist/cjs.js와 dis/dsm.js로 추출한다.
source-map파일을 함께 만들며 각각의 format은 cjs, esm으로 한다.
peerDependency를 사용할 수 있다.
json파일을 읽을 수 있다. (package.json을 읽기 위함)
ts 컴파일이 가능하다.
postcss를 통해 scss를 컴파일링 할 수 있다. 그리고 scss를 통해 만들어진 파일들의 이름앞에 prefix를 설정한다. 3. tsconfig.json 설정
FCC는 타입스크립트를 사용하기 때문에 ts를 관리하는 tsconfig 파일을 만들어 줘야한다.
(tsconfig 설정은 ts빌드 파일 관련한 설정을 제외하곤 생략)

{
"compilerOptions": {
"declaration": true,
"declarationDir": "./lib", // lib폴더에 ts 타입 속성을 빌드한다.
"target": "es5",
"lib": ["dom", "dom.iterable", "esnext"],
"skipLibCheck": true,
"esModuleInterop": true,
"allowSyntheticDefaultImports": true,
"strict": true,
"module": "es6",
"moduleResolution": "node",
"resolveJsonModule": true,
"jsx": "react",
"typeRoots": ["@types"]
},
"include": ["**/*.tsx", "**/*.ts", "@types", "index.ts"],
"exclude": ["node_modules", "build", "dist", "lib", "example", "rollup.config.js"]
} 4. 테스트 환경 구성
FCC는 라이브러리기 때문에 다른 React 프로젝트에서 install 해서 테스트를 해봐야했다.
때문에 나는 cra를 이용하여 테스트 환경을 구성하였다.

// rollup.config.js가 있는 path에서
create-react-app example
그리고 cra로 만들어진 package.json 에 FCC를 install 하였다.

{
"name": "example",
"version": "0.1.0",
"dependencies": {
"@testing-library/jest-dom": "^5.11.4",
"@testing-library/react": "^11.1.0",
"@testing-library/user-event": "^12.1.10",
// 요기
"flex-customer-contract": "file:..",
"react": "^17.0.1",
"react-dom": "^17.0.1",
"react-scripts": "4.0.1",
"web-vitals": "^0.2.4"
},
"scripts": {
"start": "PORT=8000 react-scripts start",
"build": "react-scripts build",
"test": "react-scripts test",
"eject": "react-scripts eject"
}
}
package.json에서 FCC를 install 할 때 path를 file:..으로 해주었는데, example 밖에 존재하는 FCC의 package.json에서 index.js를 main으로 설정해 주었기에 동작한다.

5. index.ts 생성 및 개발
   기본적인 세팅이 마무리되었으니 직접 ts, tsx파일을 생성해서 library를 만들어야한다.

먼저 명령어로 rollup watch를 실행시킨다. rollup watch는 react의 hot-loader와 같은 역할을 한다. 그리고 example에서 테스트 해야하니까 함께 실행시킨다.

// ter 1
npm run watch

// ter 2
npm run exam
본격적으로 개발에 들어가서 \*.scss파일들의 타입을 정의한다.

// @types/index.d.ts
declare module '\*.scss' {
const content: { [className: string]: string };
export = content;
}
그리고 root가 될 index.ts와 demo component Input.tsx 를 작성한다

// index.ts

export { default as Input } from './components/Input';
// components/Input.tsx
import React from 'react';

import 'index.scss';

const Input = () => {
return (

<div class="like-input">인풋인 척 하는 div</div>
);
};

export default Input;
그리고 scss테스트를 위해 index.scss파일을 생성한다.

// index.scss
.like-input {
width: 20px;
height: 20px;
background: red;
} 6. 라이브러리 테스트
빌드가 성공적으로 돌아가면 /example/src에서 FCC를 install후 사용할 수 있다.

import React from 'react';
import \* as FCC from 'flex-customer-contract';

function App() {
return (

<div className="App">
<FCC.Input />
</div>
);
}

export default App;
코드리뷰로 코드 다듬기 ✨
코드리뷰 과정에서 53개의 코멘트를 받았다. 그리고 그 중 반영하면서 삽질을 많이 했던 부분들을 정리해보았다.

절대경로를 설정하면 build 결과물이 회손될 수 있다. (path문제)
tslint는 deprecated 되었다. -> eslint로
rollup이 모노레포로 변화하면서 @rollup/~의 꼴로 package들이 변했다.
rollup-plugin-typescript2 package는 build시간을 많이 저하시킨다.
ant design의 build를 봤더니 .css, .js 이렇게만 build하더라. -> FCC도 이렇게 해보자!
