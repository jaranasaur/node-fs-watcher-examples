const fs = require('fs');

/*
  This example listens for changes in a directory (the 'watchDir' variable) and then copies the contents
  of the watchDir to a destination dir ('destDir') after the specifed time delay when a change occurs.
  The 'listener' function passed to fs.watch will run every time a file is changed. We debounce this by
  only running our code if the 'watching' bool is true. If 'watching' is true and  a change occurs,
  'watching' immediately gets set to false, and doesn't get set back to true until the specified 'timeDelay' has passed.
*/

// the directory to watch for changes (backslash at the end is required in this case)
const watchDir = '/path/to/source/';

// the directory to copy files to (backslash at the end is required in this case)
const destDir = '/path/to/dest/';

let watching = true;
const timeDelay = 2000; // in milliseconds

// the function that will be called every time there is a change
// the 'eventType' and 'filename' arguments aren't used in this example, but they are there in case you need them
function listener(eventType, filename) {

  // don't continue if we're "not watching"
  if (!watching) return;

  // stop watching, in case of any more changes to the watchDir occur before our time delay passes
  watching = false;
  
  console.log(`changes detected at: ${new Date().toLocaleTimeString()}`);

  // will copy our files after the specified 'timeDelay'
  setTimeout(() => {
    console.log('copying new files...');
    
    // copy each file in the 'watchDir' to the 'destDir'
    fs.readdirSync(watchDir).forEach((file) => {
      fs.copyFileSync(`${watchDir}${file}`, `${destDir}${file}`);
    });
    
    console.log('done!\n');

    // start watching for changes to our 'watchDir' again
    watching = true;

    console.log('waiting for changes...');
  }, timeDelay);
}

// start the actual file system watch and pass our listener
fs.watch(watchDir, { recursive: false }, listener);

console.log('waiting for changes...');