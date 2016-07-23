#gulpfile
Build files for my dev environments.

#setup
##bash script
In `.bash_profile`, add the following function:
```bash
serve(){ /usr/local/bin/gulp --gulpfile ~/Dropbox/webdev/gulp/gulpfile.js --cwd ${1:-.}; }
```
This assumes two things:

  * `/usr/local/bin/gulp` as the global gulp install.
  * `~/Dropbox/webdev/gulp/gulpfile.js` is the gulpfile to run.

##directory structure
Script assumes this directory structure:
```
project
 |-- .git
 |-- src
 |    |-- scss
 |    |-- js
 |    |-- i
 |    |-- inc
 |-- dist
```
The only important directory is `src`, as `dist` will create itself if need be. Version control wherever you want.

#running
Assuming you’ve added the bash function and configured gulp, you can now run `serve` from the project root. Gulp will watch `src` and compile to `dist`.
