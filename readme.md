# gulpfile
Build files for my dev environments.

# setup
## bash script
In `.bash_profile`, add the following function:
```bash
export GULPFILE=/path/to/gulp/install
serve(){
    gulp ${2} --gulpfile ${GULPFILE:-./gulpfile.js} --cwd ${1:-.}
}
```
This script assumes the bash variable `$GULPFILE` is set with a valid pointer to the gulpfile in this repo.

## directory structure
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

# running
Assuming you’ve added the bash function and configured gulp, you can now run `serve` from the project root. Gulp will watch `src` and compile to `dist`.
