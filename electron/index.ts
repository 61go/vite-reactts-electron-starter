// Native
import { join } from 'path';

// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent } from 'electron';
import isDev from 'electron-is-dev';
import childProcess from 'child_process';
import * as fs from 'fs';

const height = 600;
const width = 800;

function createWindow() {
  // Create the browser window.
  const window = new BrowserWindow({
    width,
    height,
    //  change to false to use AppBar
    frame: true,
    show: true,
    resizable: true,
    fullscreenable: true,
    webPreferences: {
      preload: join(__dirname, 'preload.js')
    }
  });

  const port = process.env.PORT || 3000;
  const url = isDev ? `http://localhost:${port}` : join(__dirname, '../src/out/index.html');

  // and load the index.html of the app.
  if (isDev) {
    window?.loadURL(url);
  } else {
    window?.loadFile(url);
  }
  // Open the DevTools.
  // window.webContents.openDevTools();

  // For AppBar
  ipcMain.on('minimize', () => {
    // eslint-disable-next-line no-unused-expressions
    window.isMinimized() ? window.restore() : window.minimize();
    // or alternatively: win.isVisible() ? win.hide() : win.show()
  });
  ipcMain.on('maximize', () => {
    // eslint-disable-next-line no-unused-expressions
    window.isMaximized() ? window.restore() : window.maximize();
  });

  ipcMain.on('close', () => {
    window.close();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // 唤起python

  const exeName = process.platform === 'win32' ? 'pyapp.exe' : 'pyapp';
  // 在这里添加启动外部程序的代码
  const exeDir = isDev ? 'python/dist/' : 'resources/python/dist/';
  console.log(exeDir);
  // const exePath = path.join(__dirname, 'path-to-your-exe', 'your-exe-file.exe');
  const args: readonly string[] | undefined = []; // 这里可以传递给外部程序的命令行参数
  const options = {
    cwd: exeDir, // 可选: 工作目录
    env: process.env // 可选: 环境变量
  };
  if (false) {
    // 是否内嵌Python进程，默认为true，即在electron进程中启动python子进程。非内嵌模式是独立启动python进程
    const subprocess = childProcess.spawn(exeName, args, options);
    console.info('start python success....');
    subprocess.stdout.on('data', (data) => {
      console.info(`stdout: ${data}`);
    });

    subprocess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    subprocess.on('close', (code) => {
      console.info(`child process exited with code ${code}`);
    });
  }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on('message', (event: IpcMainEvent, message: any) => {
  console.log(message);
  setTimeout(() => event.sender.send('message', 'hi from electron'), 500);
});

ipcMain.on('write-file', (event: IpcMainEvent, data: Uint8Array) => {
  console.log('我被调用 了');
  fs.writeFile('D://wav/output.wav', data, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('File written successfully!');
    }
  });
  event.sender.send('write-file', 'hi from electron');
});
