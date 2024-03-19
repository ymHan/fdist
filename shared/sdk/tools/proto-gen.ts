import { exec } from 'child_process';
import * as fg from 'fast-glob';
import * as fs from 'fs';
import * as path from 'path';

const SDK_PATH    = './';
const SRC_PATH    = `${SDK_PATH}/src`;
const PROTO_PATH  = `${SRC_PATH}/proto`;
const PB_PATH     = `${SRC_PATH}/pb`;
const PLUGIN      = `--plugin=node_modules/.bin/protoc-gen-ts_proto -I=${PROTO_PATH}`;
const SDK_PROTO   = `${PROTO_PATH}/*.proto`;
const NESTJS      = '--ts_proto_opt=nestJs=true';
const SUFFIX      = '--ts_proto_opt=fileSuffix=.pb';

const cmd = (value: string) => {
  return exec(value, (error, stdout, stderr) => {
    if (error) {
      throw new Error(`[Exec] ${error.message}`);
    } else if (stderr) {
      throw new Error(`[Stderr] $(stderr)`);
    }

    if (stdout && stdout.length) {
      console.log(stdout);
    }
  });
}

const removeLineFromFile = (filePath: string, searchKeyword: string): void => {
  const data = fs.readFileSync(filePath, { encoding: 'utf-8' });
  const lines = data.split('\n');
  const newLines = lines.filter((line) => !line.includes(searchKeyword));
  const updateData = newLines.join('\n').replace(/\n{2,}/g, '\n');

  fs.writeFileSync(filePath, updateData);
};

const exportProtobufFiles = (): void => {
  const srcDir = `${path.dirname(__dirname)}/src`;
  const outDir = `${srcDir}`;
  const outFile = `${outDir}/index.ts`;

  removeLineFromFile(outFile, '/pb/');

  for (const item of fg.sync(`${srcDir}/pb/*.pb.ts`)) {
    removeLineFromFile(item, 'export const protobufPackage = "');

    const filePath = path.relative(outDir, item).replace(/\.ts$/, '');

    fs.writeFileSync(outFile, `\nexport * from './${filePath}';`, { flag: 'a+' });
  }
}

cmd(`protoc ${PLUGIN} --ts_proto_out=${PB_PATH} ${SDK_PROTO} ${NESTJS} ${SUFFIX}`).on('close', () => {
  exportProtobufFiles();
  cmd(`prettier --write src/index.ts && tsc --build`).on('close', () => {
    cmd('mkdir -p dist/proto && cp src/proto/* dist/proto');
  });
});
