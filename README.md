# NodeJS File System Watcher Examples
Every so often, I find myself needing to run a script or program when some file or folder on my computer has changed. The `fs.watch()` function in NodeJS serves this purpose reasonably well, but I usually spend more time than I would like just trying to get it to work the way I need. **That's where these scripts come in to play.**

I've written two example scripts based upon using `fs.watch()`, which calls a callback function when something in a specified directory has changed. These scripts are ready to use out-of-the-box (once you replace the example file paths with ones from your actual system). These examples are not bulletproof. They are meant to serve as building blocks to get you started 

## `file-copy-example.js`
This example simply copies the files from the specified watch directory into a specified destination directory whenever something in the watch directory changes. I used a variation of this to copy compiled program output to another folder. Every time I would compile my code, this script would copy the output elsewhere. The comments in the file itself give a more detailed explanation.

Once you set your specific filepaths, just run the file with node!

    node file-copy-example.js

## `run-child-process-example.js`
This example runs a child process and kills/restarts it whenever something in the watch directory changes. This is based upon a script I wrote to relaunch my node server app every time I modified the code. The comments in the file itself give a more detailed explanation.

Once you set your specific filepaths, just run the file with node!

    node run-child-process-example.js

## Debouncing Detail
By default, `fs.watch()` will fire the listener callback function for every single change or new file created/copied to the watch directory. Even copying a single file into your watch directory will call the listener function twice (on my Windows 10 machine). To remedy this, both of these examples delay the execution of the important code (the file copy or the child process kill/restart) via `setTimeout()`. This allows you to only run your code once, even if multiple files changed in the directory. You can specify how long the delay should be. For example, if copying a few files to your watch directory takes 3 seconds and you want the script to compress them all to single file, you might want to set time delay to 4 or 5 seconds. That way your code to compress the files will have run once for all the files.