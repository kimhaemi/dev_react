import babel from "@rollup/plugin-babel";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "./src/index.js", // 진입점
  output: {
    file: "./dist/bundle.js", // 결과물
    format: "esm", // 결과 형식
    sourcemap: true, // 소스맵 출력
  },
  plugins: [
    peerDepsExternal(), // peerDependendcies에 관한 플러그인
    nodeResolve(), // node_modules 관한 플러그인
    commonjs(), // cjs 관한 플러그인
    // 바벨 트랜스파일러 설정
    babel({
      // babel 에 관한 플러그인
      babelHelpers: "bundled",
      presets: [
        "@babel/preset-env",
        "@babel/preset-react",
        "@babel/preset-typescript",
      ],
      extensions: [".js", ".jsx", ".ts", ".tsx"], //babel이 변환해야하는 파일 확장자들
      // runtime: 헬퍼 함수를 @babel/runtime 라이브러리에서 가져온다.
      // bundled: 헬퍼 함수가 각 번들 파일에 포함된다. 기본설정
      // inline: 각 헬퍼 함수가 각 파일에 인라인으로 삽입된다.
      // external: 헬퍼 함수를 외부 모듈로 설정한다.
    }),

    // 타입스크립트
    typescript(),
  ],
};
