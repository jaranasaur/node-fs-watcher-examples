const fs = require('fs');
const { spawn, exec } = require('child_process');

/*
  This example runs a child process, listens for changes in a directory (the 'watchDir' variable),
  and then kills and re-runs the child process after the specifed time delay when a change occurs. We also setup
  stdout and stderr listeners for the child process, so the child processes console output will also 
  be displayed with this scripts output. The 'listener' function passed to fs.watch will run every time
  a file is changed. We debounce this by only running our code if the 'watching' bool is true. 
  If 'watching' is true and a change occurs, 'watching' immediately gets set to false, and doesn't
  get set back to true until the specified 'timeDelay' has passed.
*/

// the directory to watch for changes (backslash at the end is required in this case)
const watchDir = '/path/to/source/';

// the path to the child process (for example, just running Windows Notepad, which is in the system PATH so no filepath is required)
const childProcessPath = 'notepad.exe';

let watching = true;
const timeDelay = 2000; // in milliseconds
let childProcess; // this will be the child process (returned from spawn()) that we manipulate

// spawn child process and setup stdout/stderr listeners so we can get CLI output from the child process
function startChildProcess() {
  console.log('starting child process...');
  childProcess = spawn(childProcessPath);
  // childProcess = spawn('node', ['./my-script.js']); // example launching another node script as the child procces
  childProcess.stdout.on('data', (data) => {console.log(`${data}`)});
  childProcess.stderr.on('data', (data) => {console.error(`${data}`)});
}

// the function that will be called every time there is a change
// the 'eventType' and 'filename' arguments aren't used in this example, but they are there in case you need them
function listener(eventType, filename) {

  // don't continue if we're "not watching"
  if (!watching) return;

  // stop watching, in case of any more changes to the watchDir occur before our time delay passes
  watching = false;

  console.log(`changes detected at: ${new Date().toLocaleTimeString()}`);

  setTimeout(() => {
    console.log('killing child process...');
    childProcess.kill();
    startChildProcess();

    // example of launching another script if a certain file in the watchDir has changed
    // if (filename == 'myfile.txt') {
    //   exec('node ./some-script.js');
    // }

    console.log('done!\n');

    // start watching for changes to our 'watchDir' again
    watching = true;

    console.log('waiting for changes...');
  }, timeDelay);
}

// launch the child process for the first time
startChildProcess();

// start the actual file system watch and pass our listener
fs.watch(watchDir, { recursive: false }, listener);

console.log('waiting for changes...');