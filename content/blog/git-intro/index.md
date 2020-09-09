---
title: Git intro
date: 2019-06-13 23:18:05
description: An awesome introduction to git, you should definitely read it.
tags:
    - git
---

## Keep track of our works (man git)

Git is a command line application, meaning it's an application that we run in the terminal / command prompt.

The purpose of git is to keep track of our works. As a programmer, what we usually do at work is write code. With git, we can see what are the things that we added, edited, or removed from our project's source code.

By default, git doesn't just track everything we do to our source code. Therefore we need to tell git which changes we made to the source code that we want to keep track later, as we discuss later.

## Get a repo (git init, clone)

A repository (or repo) is basically a project containing source codes that is tracked by git.

There's two main way to get a git repo. First, we can create our brand new project and tell git to keep track of it. Or, we can grab other people's project that is already tracked by git somewhere.

To use the first method:
- We can create new project or we can use any existing project which hasn't been tracked by git
- Navigate to project directory via terminal / command prompt, `cd <project_dir>`
- Run `git init`

To use the second method:
- Search for any git project, e.g from github
- And then run `git clone <repo_url>`
- This will download the project into our local machine

## Introduce yourself (git config)

Because, beside keeping track of changes in a repo, git also keep track of who did the changes.

Therefore, before we make any changes to the project, we have to introduce ourselves, well, at least we tell our name and email so git can identify us.

To do that we can run this command

```
git config --global user.name="Your Name"
git config --global user.email="your.email@somewhere.com"
```

## Pick and keep (git status, add, commit)

There are at least 3 kinds of changes that we usually do to when we write code: creating, editing, or deleting files.

For illustration, let say we create some new files in our repo: `file_a.txt`, `file_b.txt`, and `file_c.txt`. After we created those files, however, git still doesn't know a thing about them. If we want git to keep track of the new files, we have to tell git to 'record' it.

The basic flow is:
- We made changes (add, edit, or delete)
- We 'pick' which changes we want git to 'record', using `git add` command
- Finally we tell git to `record` the changes, using `git commit -m "<commit message>"` command

Continuing the illustration, let say we only want to keep track of `file_a.txt`, so the steps is:
- Run `git add file_a.txt`
- Then run `git commit -m "add file_a to the repo"`

A commit is set of changes that git record, and the commit message can be used to add remarks of what we do in a commit.

So what happens to `file_b.txt` and `file_c.txt`? Well, they're fine and they're still in our repo, but git still doesn't know a thing about them.

One way to know the status of changes in our repo is to use the `git status` command. It will output current changes that happen, whether we add new files, edit some existing files (that is already tracked by git), or delete some files.

If we run `git status`, git will tell us that `file_b.txt` and `file_c.txt` is 'untracked', meaning git doesn't know about it yet.

If we run `git add file_b.txt`, and then run `git status` again, now git will tell that `file_b.txt` is 'ready to be committed', meaning we have 'picked' which changes that we want git to record.

Then, if we run `git commit -m "add file_b"`, and then run `git status` again, `file_b.txt` is now dissapear from the output, just like `file_a.txt` previously. Because `git status` only tells us about what are the current changes that happens in the repo, and since `file_a.txt` and `file_b.txt` has now tracked by git, it doesn't appear in the output.

Right now, if we edit the content of `file_c.txt`, and then run `git status` git will always tells us it is 'unstaged', because there's no information about the file whatsoever. However, if we edit `file_a.txt` or `file_b.txt`, and then run `git status`, git will tell us that its 'modified', because git has a way to compare the file content with the content from latest commit.


## Reading history (git log)

The essentials of using git is to create a series of commits. For a reminder, a commit contain information of a change that we made.

To see commits in a repo, we run `git log` command. It will display list of commits so far in the repo.

As we can see, each commit contain additional information, like the commit `hash` or commit id, the commit message, the commit date, and the author. It also contain other stuff that we don't need to focus right now. Later we can use this information to further manipulate our repo.

Tips: we can use `git log --oneline` to display each commit in one line, so we can have a better view when we have a lot of commits.

## Another place to keep (git remote)

Another purpose of git is to make collaboration with other people easier. So far, we only work alone, in our local machine, but we need to share our work with others. For that purpose, git let us 'copy' our repo to other location with the concept of `remote`.

A remote can be thought as a place where the 'copy' of our local repo is kept. The idea is, it contains all commits from our local repo and can be located anywhere on the internet, so that other people can have access to it. Since other people can have access to it, it means they can do their work and create their commits and then we can collaborate.

We can setup our own server to host the remote repo, or we can just use third party service. One of the most popular service is github.com.

To 'connect' our repo to a remote, first we need to create a pointer to a remote.

```
git remote add origin <url>
```

The `<url>` is where the remote repo is, and `origin` is the name of the pointer that points to that `<url>`. The `origin` can be thought as 'nickname' for a remote, so later if we want to refer to that url we can refer to the 'nickname' instead.

We can have more than one remote repo, for example if we want to 'connect' our repo to another remote repo, we can run:

```
git remote add other_remote <url>
```

We can give nickname to the remote as we want, as long as it doesn't clash with other remote name. The term `origin` in the first example is conventional, indicating that it is the 'main' remote.

Now that we have a remote repo, we can 'upload' our changes to the remote repo. To do so, we use the `git push` command, for example:

```
git push origin master
```

Again, the `origin` is the name of the remote, while `master` is the name of the target branch we want to upload to.

After we 'upload' our changes to remote repo, other people who want to collaborate with us can download the latest changes by 'downloading' it from the repo.

To get latest changes from remote repo, we can use `git pull` command, for example:

```
git pull origin master
```

## Time travel (HEAD)

We have learned previously that we can view history of commits using `git log`. What if I told you that we can also 'go back' to any of those commits?

For illustration, we run `git log --oneline` and these are the commits that we have:

```
1234d commit 4
1234c commit 3
1234b commit 2
1234a commit 1
```

This tells us that the latest commit `hash` is `1234d` with the message `commit 4`. The latest commit when we run `git log` is the current structure or content of our repo.

Let say we want to 'undo' the changes in `commit 4`, and 'go back' to `commit 3`, what we can do is run this command:

```
git reset --hard 1234c
```

This command will make `commit 3` the latest commit, and if we run `git log --oneline` again, the `commit 4` is now dissapear:

```
1234c commit 3
1234b commit 2
1234a commit 1
```

Git has a pointer called `HEAD`. The purpose of `HEAD` is to indicate what is the current structure of our project. We can think of our repo as a series of commits and by default `HEAD` is always pointing to the latest commit.

In the previous example, we can also think of what we have done as 'moving' the `HEAD` to points to the previous commit, so that the previous commit became the 'latest' commit.

We can tell git to display where the `HEAD` is using this command:

```
git log --oneline --decorate
```

The `--oneline` will output one commit per line, and the `--decorate` will display the `HEAD` and some other information.

## Alternate reality (git branch)

When we build an application, sometimes we need to add features, or maybe fixing bugs. When we make changes, we tend to also make mistakes. We don't want the changes that we made to break the current application. We need a way to make changes and test the changes afterward in 'isolation', and then combine the changes back.

We can think of series of commits that we made so far as a 'timeline'. What we need to do is to create separate 'timeline'. This concept of separate path to make changes is called `branch` in git. With `branch` we can create multiple series of commits where each timeline has its own set of changes.

By default, when we create new project using `git init` we only have one `branch` with the name of `master`. That is where we previosly create our commits. To make a new `branch`, we use `git branch` command, for example:

```
git branch develop
```

Now we have a new `branch` called `develop`.

Previously, we only have one branch, `master`, and everytime we make changes, the commit will be added to the `master` branch timeline. Now that we have more than one `branch`, every changes will be added to whichever `branch` is currently 'active'. And right now the active branch is still the `master` branch, because the previous command only create the `develop` branch but not yet activating it.

If you still remember our discussion about `HEAD` in the previous section, the `HEAD` is pointing to the latest commit. But previously, since we only have one branch, the `HEAD` is pointing to the latest commit on the `master` branch. The active branch is determined by where the `HEAD` points to. Because the `HEAD` still points to `master`, that means `master` is the 'active' branch. We can move the `HEAD` to points to another branch by using `git checkout` command. For example if we want to activate `develop` branch, we can use this command:

```
git checkout develop
```

From now on, if we create new commits, it will be added to the `develop` branch and the `master` branch will not know any changes we made in `develop` branch.

For example, the `master` branch have:
```
file_a.txt
file_b.txt
file_c.txt
```

If we `checkout` the `develop` branch and add new files to our project and commit the changes:
```
file_a.txt
file_b.txt
file_c.txt

file_x.txt
file_y.txt
file_z.txt
```

Now, if we `checkout` the `master` branch again using `git checkout master`, we won't see the newly added files. The files in the `master` branch is still the following:
```
file_a.txt
file_b.txt
file_c.txt
```

This is because `master` and `develop` each have their own 'version' of project structure and contents.

When we finish the development in the `develop` branch, after testing it and feeling confident about the changes, we can combine the two branch together. We do so by first checking out the target branch, which is the branch that we want to receive the changes, and then run `git merge <source_branch>` command.

For example, if we want to merge all the changes from `develop` branch back to our `master` branch, first we checkout `master` branch

```
git checkout master
```

And then we run:

```
git merge develop
```

Now the structure of our project become:

```
file_a.txt
file_b.txt
file_c.txt

file_x.txt
file_y.txt
file_z.txt
```

Git is smart enough to detect any duplicate files, therefore if two branches contains files with same name, if the content of those files is the same, git will think its safe to ignore it and leave the file as it is.

If the two branches contain files with same name but different content, git can detect the difference and automatically combine the content of the file properly if it can.

Now that we have more than one branch, we can also `push` to or `pull` from specified branch. For example `git pull origin develop` will get any changes from `origin` remote, from `develop` branch in the remote. Or `git push origin develop` to push our local changes to `develop` branch in the remote.

