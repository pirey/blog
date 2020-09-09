---
title: Save external image to gallery with ionic
date: 2016-04-13 21:06:15
description: Here you will learn to save external image to gallery in ionic
tags:
    - angularjs
    - cordova
    - ionic
---

A few days ago I need to implement a feature where the user can save some displayed image in ionic app to the device image gallery. In my case, it was an image displayed using html img tag with external source url. So all I need was some method to download that file. Though the task is simple, it's been a-lot-of-browsing activity since it was my first time dealing with cordova plugin. Then I decided to write this post, to explain the steps needed and wrap it all up. Let's begin. First we create an ionic project, and move to that directory

```
ionic start saveimage blank
cd saveimage
```

Then make sure we add appropriate platform **Note:** this tutorial is intended to work with android platform, since I have not successfully make it works on iOS.

```
# for android
ionic platform add android
```

In this project we will use ngCordova for easier use of cordova plugin within ionic. To set it up you can download the source files from [their website](http://ngcordova.com) or you can simply download it via bower:

```
bower install ngCordova
```

If you don't have bower installed just type the following command to install it.

```
npm install -g bower
```

And then include it in `www/index.html`. If you installed it via bower, you can find the source file in `www/lib/` directory. Or include the appropriate file if you donwload the source files from the ngcordova website.

```html
<script src="lib/ngCordova/dist/ng-cordova.js"></script>
<script src="cordova.js"></script>
```

Next we need to include the ngCordova into our module. Open `www/js/app.js` and add the following

```javascript
angular.module('myApp', ['ngCordova'])
```

For the actual action to download the file, we need to install the [cordova file transfer plugin](http://ngcordova.com/docs/plugins/fileTransfer/).

```
ionic plugin add cordova-plugin-file-transfer
```

The file transfer plugin does not automatically add the downloaded file to the gallery, so we need additional plugin to do it. Install plugin to refresh gallery.

```
ionic plugin add https://github.com/lotterfriends/refreshgallery
```

Note that without this plugin, we can still download the image file, but to make it available in the gallery, we have to reboot our device, and that's kind of..inefficient. Ok, setup clear. Let's make a test button to download the file. Don't forget to associate the template with our controller. Put this in `www/index.html` 

```html
<ion-content class="padding" ng-controller="HomeCtrl">
  <button ng-click="downloadImage()" class="button button-block button-positive">
  Download
  </button>
</ion-content>
```

Now create the controller, and make a scope function. Add the following code in the `www/js/app.js`

```javascript
.controller('HomeCtrl', function($scope, $cordovaFileTransfer) {
  $scope.downloadImage = function() {
    var url = "http://ngcordova.com/img/ngcordova-logo.png",
        filename = url.split("/").pop(),
        targetPath = cordova.file.externalRootDirectory \+ filename,
        options = {},
        trustHosts = true;

    $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
      .then(
        function(result) {
          alert('Download success');
          refreshMedia.refresh(targetPath);
        },
        function(err) {
          alert('Error: ' + JSON.stringify(err));
        },
        function(progress) {
          // progressing download...
        }
      );
  };
});
```

We add `$cordovaFileTransfer` as dependency to our controller. This is the service ngCordova provide to us. Then we call the `$cordovaFileTransfer.download()` method to download the file. The url parameter is the path to the file we want to download, and targetPath is the directory in the device to save our downloaded file.

And..here is the part where I get lost I tried using `cordova.file.dataDirectory` but I can't find the downloaded file anywhere on my device's file browser let alone in the gallery, because apparently it points to private directory where the app is installed. Took me some times to realize it after exploring my android's directories using `adb shell` command. Then, I finally found out that `cordova.file.externalRootDirectory` actually points to the root of **internal storage** of my android device! So I used it instead. Notice that the `cordova.file` is actually provided by [cordova file plugin](http://ngcordova.com/docs/plugins/file/), however we can still access it with the file transfer plugin. You can get full list of provided paths [here](https://github.com/apache/cordova-plugin-file#where-to-store-files).

Note for iOS, I think you can use the `cordova.file.dataDirectory` path, but I haven't tested it yet. Back to our download method. It returns a promise that we can pass some callback function on it. The first one is success callback, second is error callback, and the last is the callback that is called when the download is still progressing. And if you haven't already noticed the `refreshMedia`, it is provided by 'refresh gallery plugin'. The `refreshMedia.refresh()` method makes the file available in the gallery, immediately after downloaded.

**Important:** currently, we have to test the app on device and we can not test it in the browser via 'ionic serve'... Well, you guess what? I think actually we can! But maybe that will be a discussion for another post.

## Conclusion

Congratulations! We have learn how to download external image directly through ionic, moreover, we have also learn how to deal with cordova plugin. Well, thanks for reading! I hope you found something useful from here.
