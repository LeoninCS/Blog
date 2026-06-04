import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(execFile);

await run('npm', ['run', 'sync:obsidian']);
await run('npm', ['run', 'build']);

const statusBefore = await git(['status', '--porcelain']);
if (!statusBefore.trim()) {
  console.log('Obsidian 同步后没有文件变化。');
  process.exit(0);
}

await run('git', ['add', 'src/content/blog', 'static/blog-assets']);

const staged = await git(['diff', '--cached', '--name-only']);
if (!staged.trim()) {
  console.log('Obsidian 同步后没有可提交内容。');
  process.exit(0);
}

const message = `docs: 同步 Obsidian 笔记`;
await run('git', ['commit', '-m', message]);
await run('git', ['push', 'origin', 'main']);

async function git(args) {
  const { stdout } = await exec('git', args);
  return stdout;
}

async function run(command, args) {
  console.log(`$ ${command} ${args.join(' ')}`);
  const child = exec(command, args);

  try {
    const { stdout, stderr } = await child;
    if (stdout) process.stdout.write(stdout);
    if (stderr) process.stderr.write(stderr);
  } catch (error) {
    if (error.stdout) process.stdout.write(error.stdout);
    if (error.stderr) process.stderr.write(error.stderr);
    throw error;
  }
}
