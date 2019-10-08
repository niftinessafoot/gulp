# gulpfile
My global gulp runner, serving all my local web projects.

While I warrant hard drive storage is cheap and plentiful, it also pains me to have gulp installed in multiple locations and house literaly _hundreds_ of readme.md files for all the node dependencies Gulp requires.

Out of pure stubbornness, therefore, I have built this gulp runner to address all my task builder needs from one folder.

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

I keep the `$GULPFILE` export in a system-specific exports file, which is why the two are separate.

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
